import * as d3 from "d3";
import { useEffect, useRef } from "react";
import "./GraphStackedBar.css";

function StackedBarGraph({ data }) {
  const graph = useRef(null);
  d3.formatDefaultLocale({
    thousands: ".",
    grouping: [3],
    currency: ["", "€"],
  });
  const colors = ["#d7191c","#fdae61","#abd9e9","#2c7bb6"];

  const width = 300;
  const barHeight = 100;

  useEffect(() => {
    if (data && graph.current) {
   

      const div = d3.select(graph.current);
      const colorscale = d3
        .scaleOrdinal()
        .domain(data.map((el) => el.key))
        .range(colors);

      const max = d3.max(Object.entries(data).map(([_, { value }]) => value));
      
      const x = d3.scaleLinear().range([0, width]).domain([0, max]).clamp(true);
      
      div
        .selectAll(".grafiek")
        .data(data)
        .join(
          (enter) => {
            const g = enter
              .append("div")
              .classed("grafiek", true)
              .attr("id", (d)=> {
                return `${d.key}`
              })
              .style("width", (d) => {
                return x(d.value) + "px";
              });
            g.append("div")
              .classed("rectangle", true)
              .style("height", barHeight + "px")
              .style("background", (d) => {
                return colorscale(d.key);
              })
              .style("width", (d) => {
                return x(d.value) + "px";
              })
              .html((d) => (d.value > 0 ? `<p> ${d.value}</p>` : ""));

            g.append("p")
              .html((d) => (d.value > 0 ? d.key : ""))
              .classed("titles", true)
              .style("margin-top", (d, i) => 10 + "px")
              .style("color", (d) => d3.rgb(colorscale(d.key)).darker(0.8));
          },
          (update) => {
            update
              .transition()
              .duration(2)
              .style("width", (d) => {
                return x(d) + "px";
              });
            update
              .select(".rectangle")
              .html((d) => (d.value > 0 ? `<p> ${d.value}</p>` : ""))
              .transition()
              .duration(2)
              .style("width", (d) => {
                return x(d.value) + "px";
              });
            update.select(".titles").html((d) => (d.value > 0 ? d.key : ""));
          },
          (exit) => {
            exit.remove();
          }
        );
    }
  }, [data]);

  return <div className="values" ref={graph} />;
}

export default StackedBarGraph;
