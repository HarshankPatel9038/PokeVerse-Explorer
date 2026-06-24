import { useState, useEffect } from "react";
import "./pokemon.css";
import PokemonCard from "./PokemonCard";
import { Link } from "react-router-dom";
import { fetchJson } from "./api";

const Pokemon = () => {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const API = "https://pokeapi.co/api/v2/pokemon?limit=500";

  const getApiData = async () => {
    try {
      const data = await fetchJson(API, "Pokemon list");

      const innerApiData = data?.results?.map(async (value) => {
        return fetchJson(value.url, value.name);
      });

      const innerData = await Promise.all(innerApiData);
      setPokemon(innerData);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getApiData();
  }, []);

  const searchData = pokemon.filter((pokemonData) =>
    pokemonData.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="center-elem">
        <h3>Loading...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="center-elem">
        <h3>{error}</h3>
      </div>
    );
  }

  return (
    <div className="main">
      <h1 className="main-title">Let&apos;s Catch Pokemon</h1>
      <div className="input-wrapper">
        <input
        className="search-input"
          type="text"
          placeholder="Search Pokemon"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="card-wrapper">
        {searchData.map((pokemon) => {
          return (
            <Link key={pokemon.id} to={`/${pokemon.name}`}>
              <PokemonCard pokemonData={pokemon} />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Pokemon;
