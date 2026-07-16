import { useState, useEffect, useRef, useCallback } from "react";
import "./pokemon.css";
import PokemonCard from "./PokemonCard";
import { Link } from "react-router-dom";
import { fetchJson } from "./api";

const Pokemon = () => {
  const [pokemon, setPokemon] = useState([]);
  const [allPokemonList, setAllPokemonList] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
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
    
    // Fetch all pokemon names/urls for the search functionality
    const fetchAllPokemon = async () => {
      try {
        const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=10000");
        const data = await res.json();
        setAllPokemonList(data.results);
      } catch (err) {
        console.error("Failed to fetch all pokemon names:", err);
      }
    };
    fetchAllPokemon();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      return;
    }

    const fetchSearchResults = async () => {
      setLoading(true);
      setError(null);
      
      const filtered = allPokemonList
        .filter((p) => p.name.includes(search.toLowerCase().trim()))
        .slice(0, 30); // Limit to 30 results to avoid API overload

      try {
        const innerApiData = filtered.map(async (value) => {
          return fetchJson(value.url, value.name);
        });
        const innerData = await Promise.all(innerApiData);
        setSearchResults(innerData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const debounceId = setTimeout(() => {
      fetchSearchResults();
    }, 500);

    return () => clearTimeout(debounceId);
  }, [search, allPokemonList]);

  const displayData = search.trim() ? searchResults : pokemon;

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
      
      {displayData.length === 0 && !loading ? (
        <div style={{ textAlign: 'center', margin: '50px 0', color: 'var(--text-secondary)' }}>
          <h2>No Pokemon found matching "{search}"</h2>
        </div>
      ) : (
        <>
          <div className="card-wrapper">
            {displayData.map((pokemonData, index) => {
              if (displayData.length === index + 1 && !search) {
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
