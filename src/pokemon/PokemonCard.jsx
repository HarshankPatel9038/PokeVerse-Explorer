const PokemonCard = ({ pokemonData }) => {
  return (
    <div 
      className="card" 
      data-pokemon={pokemonData.id.toString().padStart(3, '0')}
    >
      <div className="card-inner-wrapper">
        <div className="card-img">
          <img 
            src={pokemonData.sprites.other.dream_world.front_default || pokemonData.sprites.front_default} 
            alt={pokemonData.name} 
          />
        </div>
        <div className="card-details">
          <h3 className="card-title">{pokemonData.name}</h3>
          <div className="types-wrapper">
            {pokemonData.types.map((type, index) => {
              return (
                <div className="types" key={index}>
                  {type.type.name}
                </div>
              );
            })}
          </div>
          <div className="pokemon-details">
            <div className="pokemon-info">
              <span>Height</span>
              <strong>{pokemonData.height / 10}m</strong>
            </div>
            <div className="pokemon-info">
              <span>Weight</span>
              <strong>{pokemonData.weight / 10}kg</strong>
            </div>
            <div className="pokemon-info">
              <span>Base Exp</span>
              <strong>{pokemonData.base_experience}</strong>
            </div>
          </div>
          <div className="pokemon-details">
            <div className="pokemon-info">
              <span>HP</span>
              <strong>{pokemonData.stats[0].base_stat}</strong>
            </div>
            <div className="pokemon-info">
              <span>Attack</span>
              <strong>{pokemonData.stats[1].base_stat}</strong>
            </div>
            <div className="pokemon-info">
              <span>Defense</span>
              <strong>{pokemonData.stats[2].base_stat}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;
