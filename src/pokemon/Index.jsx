import { useState, useEffect, useRef, useCallback } from "react";
import "./pokemon.css";
import PokemonCard from "./PokemonCard";
import { Link } from "react-router-dom";
import { fetchJson } from "./api";

const Pokemon = () => {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [nextUrl, setNextUrl] = useState("https://pokeapi.co/api/v2/pokemon?limit=24");

  const observer = useRef();
  const lastPokemonElementRef = useCallback(node => {
    if (loadingMore || loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && nextUrl && !search) {
        getApiData(nextUrl, true);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loadingMore, loading, nextUrl, search]);

  const getApiData = async (url, isLoadMore = false) => {
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const data = await fetchJson(url, "Pokemon list");
      setNextUrl(data.next);

      const innerApiData = data?.results?.map(async (value) => {
        return fetchJson(value.url, value.name);
      });

      const innerData = await Promise.all(innerApiData);
      
      if (isLoadMore) {
        setPokemon((prev) => [...prev, ...innerData]);
      } else {
        setPokemon(innerData);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    getApiData("https://pokeapi.co/api/v2/pokemon?limit=24", false);
  }, []);

  const searchData = pokemon.filter((pokemonData) =>
    pokemonData.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading && pokemon.length === 0) {
    return (
      <div className="center-elem">
        <h3 style={{ fontSize: '24px', letterSpacing: '0px', animation: 'pulse 1.5s infinite' }}>
          Catching Pokemon...
        </h3>
      </div>
    );
  }

  if (error && pokemon.length === 0) {
    return (
      <div className="center-elem">
        <h3 style={{ color: '#ef4444' }}>{error}</h3>
      </div>
    );
  }

  return (
    <div className="main">
      <h1 className="main-title">PokeVerse Explorer</h1>
      <div className="input-wrapper">
        <input
          className="search-input"
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      
      {searchData.length === 0 ? (
        <div style={{ textAlign: 'center', margin: '50px 0', color: 'var(--text-secondary)' }}>
          <h2>No Pokemon found matching "{search}"</h2>
        </div>
      ) : (
        <>
          <div className="card-wrapper">
            {searchData.map((pokemonData, index) => {
              if (searchData.length === index + 1) {
                return (
                  <Link ref={lastPokemonElementRef} key={pokemonData.id} to={`/${pokemonData.name}`}>
                    <PokemonCard pokemonData={pokemonData} />
                  </Link>
                );
              } else {
                return (
                  <Link key={pokemonData.id} to={`/${pokemonData.name}`}>
                    <PokemonCard pokemonData={pokemonData} />
                  </Link>
                );
              }
            })}
          </div>
          
          {loadingMore && (
            <div className="infinite-loader-container">
              <div className="infinite-loader"></div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Pokemon;
