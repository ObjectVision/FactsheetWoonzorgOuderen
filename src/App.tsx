import { useEffect, useState } from "react";
import "./App.css";
import NavPanel from "./NavPanel";
import Factsheet from "./Factsheet";
import Map from "./Map"

function App() {
  const [currentNeighborhood, setCurrentNeighborhood] = useState<string>("Test wijk");

  useEffect(() => {
    console.log(currentNeighborhood);
  }, [currentNeighborhood]);

      /*<div id="app-container">
      <NavPanel
        currentNeighborhood={currentNeighborhood}
        setCurrentNeighborhood={setCurrentNeighborhood}
      />
      <Factsheet currentNeighborhood={currentNeighborhood} />
    </div>*/
  return (
    <div id="app-main-area">
      <Map/>
    </div>
  );
}

export default App;
