import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchJson } from "./api";

const PokemonDetails = () => {
  const [pokemon, setPokemon] = useState(null);
  const [speciesData, setSpeciesData] = useState(null);
  const [evolutionChain, setEvolutionChain] = useState([]);
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
          const species = await fetchJson(
            data.species.url,
            `${pokemonName} species`
          );
          setSpeciesData(species);

          if (species.evolution_chain?.url) {
            const evoData = await fetchJson(species.evolution_chain.url, 'evolution chain');
            const getEvolutions = (chainData) => {
              const evos = [];
              const traverse = (node) => {
                const id = node.species.url.split('/').filter(Boolean).pop();
                evos.push({ name: node.species.name, id });
                node.evolves_to.forEach(traverse);
              };
              traverse(chainData.chain);
              return evos;
            };
            setEvolutionChain(getEvolutions(evoData));
          }
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
        <h3>Loading details for {pokemonName}...</h3>
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

  const primaryType = pokemon.types[0].type.name;

  return (
    <div className="main pokemon-details-container">
      <Link to="/" className="back-button">
        ← Back to Pokedex
      </Link>
      
      <div className="pokemon-details-wrapper">
        <div className="pokemon-detail-img-container">
          <div className="sticky-img-wrapper" style={{ position: 'sticky', top: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', width: '100%' }}>
            <div className="pokemon-detail-img">
              <img
                src={pokemon.sprites.other.dream_world.front_default || pokemon.sprites.front_default}
                alt={pokemon.name}
              />
            </div>
            <div className="badges-container" style={{ justifyContent: 'center' }}>
              {pokemon.types.map((type) => (
                <span key={type.type.name} className="badge">
                  {type.type.name}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        <div className="pokemon-main-detail">
          <div className="pokemon-header">
            <h1 className="pokemon-title">{pokemon.name}</h1>
            <span className="pokemon-id">#{pokemon.id.toString().padStart(3, '0')}</span>
          </div>
          
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', fontStyle: 'italic', margin: '-15px 0 10px', fontWeight: '500' }}>
            {speciesData.flavor_text_entries?.find(entry => entry.language.name === 'en')?.flavor_text.replace(/[\n\f]/g, ' ')}
          </p>

          <div className="detail-section">
            <div className="detail-section-title" style={{ borderColor: `var(--type-${primaryType})` }}>Base Stats</div>
            <div className="stats-grid">
              {pokemon.stats.map((stat) => {
                const statNameMap = {
                  'hp': 'HP',
                  'attack': 'ATK',
                  'defense': 'DEF',
                  'special-attack': 'Sp.A',
                  'special-defense': 'Sp.D',
                  'speed': 'SPD'
                };
                const displayStat = statNameMap[stat.stat.name] || stat.stat.name;
                const percentage = Math.min((stat.base_stat / 255) * 100, 100);
                
                return (
                  <div className="stat-row" key={stat.stat.name}>
                    <span className="stat-name">{displayStat}</span>
                    <span className="stat-value">{stat.base_stat}</span>
                    <div className="stat-bar-bg">
                      <div 
                        className="stat-bar-fill" 
                        style={{ 
                          width: `${percentage}%`, 
                          backgroundColor: `var(--type-${primaryType})` 
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="info-grid">
            <div className="detail-section">
              <div className="detail-section-title">Physical Traits</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div className="info-item">
                  <span className="info-label">Height / Weight</span>
                  <span className="info-value">{pokemon.height / 10}m / {pokemon.weight / 10}kg</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Color / Shape</span>
                  <span className="info-value">{speciesData.color.name} / {speciesData.shape.name}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Habitat</span>
                  <span className="info-value">{speciesData.habitat?.name || "unknown"}</span>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <div className="detail-section-title">Training</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div className="info-item">
                  <span className="info-label">Base Exp</span>
                  <span className="info-value">{pokemon.base_experience}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Capture Rate</span>
                  <span className="info-value">{speciesData.capture_rate}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Growth Rate</span>
                  <span className="info-value">{speciesData.growth_rate.name.replace('-', ' ')}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="detail-section">
            <div className="detail-section-title">Abilities</div>
            <div className="badges-container">
              {pokemon.abilities.map((ability) => (
                <span key={ability.ability.name} className="badge" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                  {ability.ability.name.replace('-', ' ')}
                  {ability.is_hidden && <small style={{ marginLeft: '5px', color: 'var(--text-secondary)' }}>(Hidden)</small>}
                </span>
              ))}
            </div>
          </div>

          {evolutionChain.length > 1 && (
            <div className="detail-section">
              <div className="detail-section-title">Evolutions</div>
              <div className="evolutions-wrapper">
                {evolutionChain.map(evo => (
                  <Link to={`/${evo.name}`} key={evo.name} className="evolution-card">
                     <div className="evolution-img-container">
                       <img 
                         src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${evo.id}.svg`} 
                         alt={evo.name} 
                         onError={(e) => { e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evo.id}.png`; }}
                       />
                     </div>
                     <span className="evolution-name">
                       {evo.name}
                     </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default PokemonDetails;
