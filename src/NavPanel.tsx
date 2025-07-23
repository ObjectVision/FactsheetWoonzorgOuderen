import Map from "./Map";

interface NavPanelProps {
  currentNeighborhood: string;
  setCurrentNeighborhood: () => string
}

function NavPanel ({ currentNeighborhood, setCurrentNeighborhood }:NavPanelProps) {
  return (
    <div id="nav-panel">
      <img src="./logo.gif" />
      <h1>Gemeente Sittard-Geleen </h1>
      <Map
        currentNeighborhood={currentNeighborhood}
        setCurrentNeighborhood={setCurrentNeighborhood}
      />
      <h3>{currentNeighborhood}</h3>
    </div>
  );
}

export default NavPanel;
