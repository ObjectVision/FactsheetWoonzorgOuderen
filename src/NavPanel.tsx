import Map from "./Map";

interface NavPanelProps {
  currentNeighborhood: string;
  setCurrentNeighborhood: (e:string) => void
}

function NavPanel ({ currentNeighborhood, setCurrentNeighborhood }:NavPanelProps) {
  return (
    <div id="nav-panel">
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
