import "./App.css";
import { useState, useEffect, useMemo } from "react";
function App() {
  // input ricerca
  const [search, setSearch] = useState("");
  const [suggest, setSuggest] = useState([]);

  useEffect(() => {
    if (search === "") return setSuggest([]);
    fetch(`http://localhost:3333/products?search=${search}`)
      .then((res) => res.json())
      .then((data) => setSuggest(data))
      .catch((err) => console.error(err));
  }, [search]);
  return (
    <>
      <div>
        <h1>Ricerca intelligente</h1>
        <div className="suggest-container">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cerca..."
            list="products-suggestions"
          />
          <datalist id="products-suggestions">
            {suggest?.map((p) => {
              return (
                <option value={p.name}>
                  {p.brand} - {p.price}€
                </option>
              );
            })}
          </datalist>
        </div>
      </div>
    </>
  );
}

export default App;
