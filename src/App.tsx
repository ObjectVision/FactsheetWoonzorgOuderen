import { useEffect, useState} from "react";
import "./App.css";
import Map from "./Map";
import SwipeableTemporaryDrawer from "./Drawer.tsx";

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
    <div>
      <div id="details-area">
        <SwipeableTemporaryDrawer/>
      </div>
      <div id="map-area">
        <Map/>
      </div>
    </div>
  );
}

export default App;
