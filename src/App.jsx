import "./App.css";
import { useState, useEffect, useCallback } from "react";

function debounce(callback, delay) {
  let timer;
  return (value) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback(value);
    }, delay);
  };
}

function App() {
  // input ricerca
  const [search, setSearch] = useState("");
  const [suggest, setSuggest] = useState([]);
  const [item, setItem] = useState(null);

  // ottimizzazione debounce della lista suggerita
  const handleSearch = useCallback(
    debounce((search) => {
      console.log("ricerca");
      if (search.trim() === "") return setSuggest([]);
      fetch(`http://localhost:3333/products?search=${search}`)
        .then((res) => res.json())
        .then((data) => setSuggest(data))
        .catch((err) => console.error(err));
    }, 500),
    []
  );

  useEffect(() => handleSearch(search), [search]);

  const fetchItemDetailed = async (id) => {
    try {
      const res = await fetch(`http://localhost:3333/products/${id}`);
      const data = await res.json();
      setItem(data);
      setSearch("");
      setSuggest([]);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <div>
        <h1>Ricerca intelligente</h1>
        <div className="suggest-container">
          <input
            name="search"
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            placeholder="Cerca..."
          />
          <div className="products-suggestions">
            {suggest?.map((p) => (
              <p key={p.id} onClick={() => fetchItemDetailed(p.id)}>
                {p.name} - {p.price}€
              </p>
            ))}
          </div>
          {item && (
            <div>
              <h1>{item.name}</h1>
              <img src={item.image} alt={item.name} />
              <p>{item.brand}</p>
              <p>
                <em>Price:</em> {item.price}€
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
