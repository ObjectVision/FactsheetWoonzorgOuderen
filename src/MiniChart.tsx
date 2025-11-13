import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import styled from "styled-components";

// === Styled Components ===
const PanelContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  padding: 1rem;
`;

const Card = styled.div`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

// === Reusable Chart Component ===
export const MiniChart = ({ type = "bar" }) => {
  const ref = useRef(null);

  useEffect(() => {
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const width = 220;
    const height = 120;
    const margin = { top: 10, right: 10, bottom: 10, left: 10 };

    svg.attr("width", width).attr("height", height);

    const data = Array.from({ length: 8 }, () => Math.random() * 100);

    const x = d3
      .scaleBand()
      .domain(d3.range(data.length))
      .range([margin.left, width - margin.right])
      .padding(0.2);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    if (type === "bar") {
      svg
        .selectAll("rect")
        .data(data)
        .join("rect")
        .attr("x", (_, i) => x(i))
        .attr("y", (d) => y(d))
        .attr("height", (d) => y(0) - y(d))
        .attr("width", x.bandwidth())
        .attr("fill", "#3b82f6")
        .attr("rx", 3);
    }

    if (type === "line") {
      const line = d3
        .line()
        .x((_, i) => x(i) + x.bandwidth() / 2)
        .y((d) => y(d))
        .curve(d3.curveMonotoneX);

      svg
        .append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#10b981")
        .attr("stroke-width", 2)
        .attr("d", line);
    }

    if (type === "area") {
      const area = d3
        .area()
        .x((_, i) => x(i) + x.bandwidth() / 2)
        .y0(y(0))
        .y1((d) => y(d))
        .curve(d3.curveCatmullRom);

      svg
        .append("path")
        .datum(data)
        .attr("fill", "rgba(59,130,246,0.4)")
        .attr("stroke", "#2563eb")
        .attr("stroke-width", 1.5)
        .attr("d", area);
    }
  }, [type]);

  return <svg ref={ref}></svg>;
};