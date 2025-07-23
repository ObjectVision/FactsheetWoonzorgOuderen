import { useEffect, useState } from "react";
import "./App.css";
import NavPanel from "./NavPanel";
import Factsheet from "./Factsheet";

function App() {
  const [currentNeighborhood, setCurrentNeighborhood] = useState<string>("Test wijk");

  useEffect(() => {
    console.log(currentNeighborhood);
  }, [currentNeighborhood]);

  return (
    <div id="app-container">
      <NavPanel
        currentNeighborhood={currentNeighborhood}
        setCurrentNeighborhood={setCurrentNeighborhood}
      />
      <Factsheet currentNeighborhood={currentNeighborhood} />
    </div>
  );
}

export default App;
