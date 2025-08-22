import { useRef, useEffect } from "react";
import {
  select
} from "d3";

const data = [
  { x: 0, y: 10 },
  { x: 1, y: 20 },
  { x: 2, y: 15 },
  { x: 3, y: 25 },
  { x: 4, y: 30 },
];



export function DonutChart() {
  const ref = useRef<SVGSVGElement | null>(null);

  //draws chart
  useEffect(() => {
    const svg = select(ref.current!);

    //var svg = d3.select("#circle").append("svg").attr("width", 200).attr("height", 200)

    // Add the path using this helper function
    svg.append('circle')
    .attr('cx', 100)
    .attr('cy', 100)
    .attr('r', 30)
    .attr('stroke', 'black')
    .attr('fill', '#69a3b2');
    }, [data]);

  return <svg ref={ref}></svg>;
};