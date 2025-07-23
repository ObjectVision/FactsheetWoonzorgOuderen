import StackedBarGraph from "./GraphStakedBar";
import "./Panel.css";

interface PanelProps {
    title: string;
    data: JSON
  }

  
function Panel({title, data}:PanelProps) {

  return (
  <div className="panel-container">
    <h1 className="panel-title">{title}</h1>
    <div className="panel-graph">
        {/* graph hier */}
        <StackedBarGraph data={data}/>
    </div>
  </div>
  )
}

export default Panel
