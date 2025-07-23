import Map from "./Map"

function NavPanel({currentNeighborhood, setCurrentNeighborhood}) {

  return (
    <div id="nav-panel">
    <h1>Gemeente Sittard-Geleen </h1>
    <Map currentNeighborhood={currentNeighborhood} setCurrentNeighborhood={setCurrentNeighborhood}/>
    <h3>{currentNeighborhood}</h3>
    </div>
  )
}

export default NavPanel
