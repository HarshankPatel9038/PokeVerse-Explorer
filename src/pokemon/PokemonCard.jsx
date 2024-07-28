const PokemonCard = ({ pokemonData }) => {
  return (
    <div className="card" data-pokemon={pokemonData.id}>
      <div className="card-inner-wrapper">
      <div className="card-img">
        <img src={pokemonData.sprites.other.dream_world.front_default} alt={pokemonData.sprites.other.dream_world.front_default} />
      </div>
      <div className="card-details">
        <h3 className="card-title">{pokemonData.name}</h3>
        <div className="types-wrapper">{pokemonData.types.map((type, index) => {
          return (
              <div className="types" key={index}>{type.type.name}</div>
          )
        })}</div>
        <div className="pokemon-details col-3">
          <div className="pokemon-info">
            <span>Height: {pokemonData.height}</span>
          </div>
          <div className="pokemon-info">
            <span>Weight: {pokemonData.weight}</span>
          </div>
          <div className="pokemon-info">
            <span>Speed: {pokemonData.stats[5].base_stat}</span>
          </div>
        </div>
        {/* <div className="pokemon-details col-2">
          <div className="pokemon-info">
            <span>Experience: {pokemonData.base_experience}</span>
          </div>
          <div className="pokemon-info">
            <span>Attack: {pokemonData.stats[1].base_stat}</span>
          </div>
        </div>
          <div className="pokemon-info">
            <span>Abilities: {pokemonData.abilities.map((abilities) => abilities.ability.name).join(", ")}</span>
          </div> */}
      </div>
      </div>
    </div>
  );
};

export default PokemonCard;
