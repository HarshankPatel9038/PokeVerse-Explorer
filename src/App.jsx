import { BrowserRouter, Route, Routes } from "react-router-dom";
import Pokemon from "./pokemon/Index";
import PokemonDetails from "./pokemon/PokemonDetails";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Pokemon />} />
        <Route path="/:pokemonName" element={<PokemonDetails />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
