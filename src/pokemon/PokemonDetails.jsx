import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchJson } from "./api";

const PokemonDetails = () => {
  const [pokemon, setPokemon] = useState(null);
  const [speciesData, setSpeciesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { pokemonName } = useParams();
  const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(
    pokemonName?.toLowerCase() || ""
  )}`;

  useEffect(() => {
    const getApiData = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchJson(pokemonUrl, pokemonName);
        setPokemon(data);

        if (data.species && data.species.url) {
          const speciesData = await fetchJson(
            data.species.url,
            `${pokemonName} species`
          );
          setSpeciesData(speciesData);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getApiData();
  }, [pokemonName, pokemonUrl]);

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

  if (!pokemon || !speciesData) {
    return (
      <div className="center-elem">
        <h3>Pokemon details are unavailable.</h3>
      </div>
    );
  }

  return (
    <div className="main">
      <div className="pokemon-details-wrapper">
        <div className="pokemon-detail-img">
          <img
            src={pokemon.sprites.other.dream_world.front_default}
            alt={pokemon.sprites.other.dream_world.front_default}
          />
        </div>
        <div className="pokemon-main-detail">
          <h1 className="pokemon-title">{pokemon.name}</h1>
          <div className="flex-info-wrapper">
            <div className="flex-info">
              <h5 className="title">Height: </h5>
              <span>{pokemon.height}</span>
            </div>
            <div className="flex-info">
              <h5 className="title">Weight: </h5>
              <span>{pokemon.weight}</span>
            </div>
            <div className="flex-info">
              <h5 className="title">Speed: </h5>
              <span>{pokemon.stats[5].base_stat}</span>
            </div>
            <div className="flex-info">
              <h5 className="title">Attack: </h5>
              <span>{pokemon.stats[1].base_stat}</span>
            </div>
            <div className="flex-info">
              <h5 className="title">Experience: </h5>
              <span>{pokemon.base_experience}</span>
            </div>
            <div className="flex-info">
              <h5 className="title">color: </h5>
              <span>{speciesData.color.name}</span>
            </div>
            <div className="flex-info">
              <h5 className="title">Base Happiness: </h5>
              <span>{speciesData.base_happiness}</span>
            </div>
            <div className="flex-info">
              <h5 className="title">Capture Rate: </h5>
              <span>{speciesData.capture_rate}</span>
            </div>
            <div className="flex-info">
              <h5 className="title">Generation: </h5>
              <span>{speciesData.generation.name}</span>
            </div>
            <div className="flex-info">
              <h5 className="title">Growth Rate: </h5>
              <span>{speciesData.growth_rate.name}</span>
            </div>
            <div className="flex-info">
              <h5 className="title">Habitat: </h5>
              <span>{speciesData.habitat?.name || "unknown"}</span>
            </div>
            <div className="flex-info">
              <h5 className="title">Shape: </h5>
              <span>{speciesData.shape.name}</span>
            </div>
          </div>
          <div className="pokemon-info">
            <h5 className="title">Type({pokemon.types.length}): </h5>
            <ul>
              {pokemon.types.map((type) => (
                <li key={type.type.name}>
                  {type.type.name}
                </li>
              ))}
            </ul>
          </div>
          <div className="pokemon-info">
            <h5 className="title">Abilities({pokemon.abilities.length}): </h5>
            <ul>
              {pokemon.abilities.map((abilities) => (
                <li key={abilities.ability.name}>
                  {abilities.ability.name}
                </li>
              ))}
            </ul>
          </div>
            <div className="pokemon-info">
              <h5 className="title">Egg Groups({speciesData.egg_groups.length}): </h5>
              <ul>
                {speciesData.egg_groups.map((egg) => (
                  <li key={egg.name}>

                    {egg.name}
                  </li>
                ))}
              </ul>
            </div>
            <div className="pokemon-info">
              <h5 className="title">Pokedex({speciesData.pokedex_numbers.length}): </h5>
              <ul>
                {speciesData.pokedex_numbers.map((pokedex) => (
                  <li key={pokedex.pokedex.name}>

                    {pokedex.pokedex.name}
                  </li>
                ))}
              </ul>
            </div>
        </div>
        <div className="other-details">
          <div className="pokemon-info">
            <h5 className="title">Move({pokemon.moves.length}): </h5>
            <ul>
              {pokemon.moves.map((move) => (
                <li key={move.move.name}>
                  {move.move.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetails;
