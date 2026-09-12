import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./notfound.css";

const GHOST_POKEMON = {
  id: "???",
  name: "Missingno.",
  sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/201.svg",
  types: ["ghost", "normal"],
};

const NotFound = () => {
  const navigate = useNavigate();
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 300);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="notfound-wrapper">
      {/* Floating Pokeballs background */}
      <div className="pokeball-bg">
        {[...Array(6)].map((_, i) => (
          <div key={i} className={`pokeball-float pokeball-float-${i + 1}`}>
            <div className="pb-top" />
            <div className="pb-middle">
              <div className="pb-button" />
            </div>
            <div className="pb-bottom" />
          </div>
        ))}
      </div>

      <div className="notfound-container">
        {/* Error Code */}
        <div className={`error-code ${glitch ? "glitch" : ""}`} data-text="404">
          404
        </div>

        {/* Pokemon Card Style */}
        <div className="ghost-card">
          <div className="ghost-card-header">
            <span className="ghost-id">#???</span>
            <div className="ghost-types">
              <span className="ghost-type ghost">GHOST</span>
              <span className="ghost-type normal">NORMAL</span>
            </div>
          </div>

          <div className="ghost-sprite-wrapper">
            <div className="ghost-radar-ring ring-1" />
            <div className="ghost-radar-ring ring-2" />
            <div className="ghost-radar-ring ring-3" />
            <img
              src={GHOST_POKEMON.sprite}
              alt="Missingno"
              className="ghost-sprite"
            />
          </div>

          <div className="ghost-card-body">
            <h2 className="ghost-name">MISSINGNO.</h2>
            <p className="ghost-desc">
              A Pokémon that should not exist. The page you're looking for has
              fled into the tall grass — and may never come back.
            </p>
          </div>
        </div>

        {/* Pokedex scan line */}
        <div className="scan-line" />

        {/* Actions */}
        <div className="notfound-actions">
          <button
            id="back-home-btn"
            className="action-btn primary-btn"
            onClick={() => navigate("/")}
          >
            <span className="btn-pokeball" />
            Return to PokéDex
          </button>
          <button
            id="go-back-btn"
            className="action-btn secondary-btn"
            onClick={() => navigate(-1)}
          >
            ← Go Back
          </button>
        </div>

        <p className="error-flavor">
          "The page used Fly... but it fled instead."
        </p>
      </div>
    </div>
  );
};

export default NotFound;
