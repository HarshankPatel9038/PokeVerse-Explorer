import { BrowserRouter, Route, Routes } from "react-router-dom";
import Pokemon from "./pokemon/Index";
import PokemonDetails from "./pokemon/PokemonDetails";

const App = () => {
  const basename =
    import.meta.env.BASE_URL === "/" ? undefined : import.meta.env.BASE_URL;

  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<Pokemon />} />
        <Route path="/:pokemonName" element={<PokemonDetails />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
