import "./Panel.css";

function Panel({title, data}) {

  return (
  <div className="panel-container">
    <h1 className="panel-title">{title}</h1>
    <div className="panel-graph">
        {/* graph hier */}
        <svg><rect fill='black'></rect></svg>
    </div>
  </div>
  )
}

export default Panel
