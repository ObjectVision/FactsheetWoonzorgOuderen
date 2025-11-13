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
    const height = 150;
    const margin = { top: 10, right: 10, bottom: 10, left: 10 };

    svg.attr("width", width).attr("height", height);

    const data = Array.from({ length: 10 }, () => Math.random() * 100);

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

    const color = d3.scaleSequential(d3.interpolateCool).domain([0, d3.max(data)]);

    // === Switch between chart types ===
    switch (type) {
      case "bar":
        svg
          .selectAll("rect")
          .data(data)
          .join("rect")
          .attr("x", (_, i) => x(i))
          .attr("y", (d) => y(d))
          .attr("height", (d) => y(0) - y(d))
          .attr("width", x.bandwidth())
          .attr("fill", (d) => color(d))
          .attr("rx", 3);
        break;

      case "line":
        svg
          .append("path")
          .datum(data)
          .attr("fill", "none")
          .attr("stroke", "#2563eb")
          .attr("stroke-width", 2)
          .attr(
            "d",
            d3
              .line()
              .x((_, i) => x(i) + x.bandwidth() / 2)
              .y((d) => y(d))
              .curve(d3.curveCatmullRom)
          );
        break;

      case "area":
        svg
          .append("path")
          .datum(data)
          .attr("fill", "rgba(59,130,246,0.4)")
          .attr("stroke", "#2563eb")
          .attr("stroke-width", 1.5)
          .attr(
            "d",
            d3
              .area()
              .x((_, i) => x(i) + x.bandwidth() / 2)
              .y0(y(0))
              .y1((d) => y(d))
              .curve(d3.curveBasis)
          );
        break;

      case "scatter":
        svg
          .selectAll("circle")
          .data(data)
          .join("circle")
          .attr("cx", (_, i) => x(i) + x.bandwidth() / 2)
          .attr("cy", (d) => y(d))
          .attr("r", 5)
          .attr("fill", "#16a34a");
        break;

      case "radial":
        const radius = 60;
        const arc = d3
          .arc()
          .innerRadius(radius - 10)
          .outerRadius(radius)
          .startAngle(0)
          .endAngle((Math.random() * 0.7 + 0.3) * 2 * Math.PI);
        const g = svg
          .append("g")
          .attr("transform", `translate(${width / 2}, ${height / 2})`);
        g.append("path").attr("d", arc).attr("fill", "#2563eb");
        g.append("circle")
          .attr("r", radius - 10)
          .attr("fill", "rgba(37,99,235,0.15)");
        break;

      case "donut":
        const donut = d3.pie()(data.slice(0, 5));
        const arcGen = d3.arc().innerRadius(35).outerRadius(60);
        const gDonut = svg
          .append("g")
          .attr("transform", `translate(${width / 2}, ${height / 2})`);
        gDonut
          .selectAll("path")
          .data(donut)
          .join("path")
          .attr("d", arcGen)
          .attr("fill", (_, i) => d3.schemeTableau10[i]);
        break;

      case "horizontal-bar":
        const yH = d3
          .scaleBand()
          .domain(d3.range(data.length))
          .range([margin.top, height - margin.bottom])
          .padding(0.2);
        const xH = d3
          .scaleLinear()
          .domain([0, d3.max(data)])
          .range([margin.left, width - margin.right]);
        svg
          .selectAll("rect")
          .data(data)
          .join("rect")
          .attr("x", margin.left)
          .attr("y", (_, i) => yH(i))
          .attr("width", (d) => xH(d) - margin.left)
          .attr("height", yH.bandwidth())
          .attr("fill", "#3b82f6");
        break;

      case "radar":
        const points = 6;
        const angleSlice = (Math.PI * 2) / points;
        const radarRadius = 50;
        const radarData = Array.from({ length: points }, () => Math.random());
        const lineRadial = d3
          .lineRadial()
          .radius((d) => radarRadius * d)
          .angle((_, i) => i * angleSlice)
          .curve(d3.curveLinearClosed);
        svg
          .append("g")
          .attr("transform", `translate(${width / 2}, ${height / 2})`)
          .append("path")
          .datum(radarData)
          .attr("d", lineRadial)
          .attr("fill", "rgba(59,130,246,0.3)")
          .attr("stroke", "#2563eb")
          .attr("stroke-width", 2);
        break;

      case "lollipop":
        svg
          .selectAll("line")
          .data(data)
          .join("line")
          .attr("x1", (_, i) => x(i) + x.bandwidth() / 2)
          .attr("x2", (_, i) => x(i) + x.bandwidth() / 2)
          .attr("y1", y(0))
          .attr("y2", (d) => y(d))
          .attr("stroke", "#3b82f6")
          .attr("stroke-width", 2);
        svg
          .selectAll("circle")
          .data(data)
          .join("circle")
          .attr("cx", (_, i) => x(i) + x.bandwidth() / 2)
          .attr("cy", (d) => y(d))
          .attr("r", 5)
          .attr("fill", "#3b82f6");
        break;

      case "dot":
        svg
          .selectAll("circle")
          .data(data)
          .join("circle")
          .attr("cx", () => Math.random() * (width - 40) + 20)
          .attr("cy", () => Math.random() * (height - 40) + 20)
          .attr("r", 4)
          .attr("fill", "#9333ea")
          .attr("opacity", 0.7);
        break;

      case "sparkline":
        const sparkData = data.slice(0, 20);
        svg
          .append("path")
          .datum(sparkData)
          .attr("fill", "none")
          .attr("stroke", "#f97316")
          .attr("stroke-width", 2)
          .attr(
            "d",
            d3.line().x((_, i) => (i / sparkData.length) * width).y((d) => height - d)
          );
        break;

      case "bubbles":
        const bubbleData = Array.from({ length: 12 }, () => ({
          r: Math.random() * 20 + 5,
          x: Math.random() * (width - 40) + 20,
          y: Math.random() * (height - 40) + 20,
        }));
        svg
          .selectAll("circle")
          .data(bubbleData)
          .join("circle")
          .attr("cx", (d) => d.x)
          .attr("cy", (d) => d.y)
          .attr("r", (d) => d.r)
          .attr("fill", (_, i) => d3.schemeTableau10[i % 10])
          .attr("opacity", 0.8);
        break;

      default:
        break;
    }
  }, [type]);

  return <svg ref={ref}></svg>;
};