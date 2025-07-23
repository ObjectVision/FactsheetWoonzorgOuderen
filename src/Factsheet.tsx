import Panel from "./Panel"

interface FactsheetProps {
  currentNeighborhood: string;
}

function Factsheet({currentNeighborhood}:FactsheetProps) {

    return (
      <div id="factsheet">
      <h3>Info over {currentNeighborhood}</h3>
        <Panel title="Geschiktheid" data={[0,30,40,50]}/>
        <Panel title="BAT" data={[0,30,40,50]}/>

      </div>
    )
  }
  
  export default Factsheet
  