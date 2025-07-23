import Panel from "./Panel"
import * as batdata from "./assets/bat.json"
interface FactsheetProps {
  currentNeighborhood: string;
}

function Factsheet({currentNeighborhood}:FactsheetProps) {

    return (
      <div id="factsheet">
      <h3>Info over {currentNeighborhood}</h3>
      <h1><span>6.035</span> Kwetsbare ouderen</h1>
        {/* <Panel title="Geschiktheid totale Woningvoorraad" data={[30,40,30]}/> */}
        <Panel title="Geschiktheid corporatiebezit BAT" data={batdata.default}/>
      </div>
    )
  }
  
  export default Factsheet
  