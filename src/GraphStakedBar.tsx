
import * as d3 from 'd3'
import { array, number, object } from 'prop-types'
import React, { useEffect, useRef } from 'react'

function StackedBarGraph({ dataSet, colors, width, barHeight, time }) {
  const graph = useRef(null)
  d3.formatDefaultLocale({
    thousands: '.',
    grouping: [3],
    currency: ['', '€'],
  })
  colors = colors || ['#0B71A1', '#dddddd', '#7794A1']

  useEffect(() => {
    if (dataSet && graph.current) {
      const x = d3.scaleLinear().range([0, width]).domain([0, 100]).clamp(true)

      const div = d3.select(graph.current)

      const colorscale = d3
        .scaleOrdinal()
        .domain(dataSet.map((el) => el.key))
        .range(colors)

      const max = d3.max(Object.entries(dataSet).map(([_, { value }]) => value))

      div
        .selectAll('.grafiek')
        .data(dataSet)
        .join(
          (enter) => {
            const g = enter
              .append('div')
              .classed('grafiek', true)
              .attr('id', (d) => d.key)
              .style('width', (d) => {
                return x(d.value) + 'px'
              })
            g.append('div')
              .classed('rectangle', true)
              .style('height', barHeight + 'px')
              .style('background', (d) => {
                return colorscale(d.key)
              })
              .style('width', (d) => {
                return x(d.value) + 'px'
              })
              .html((d) => (d.value > 0 ? `<p> ${d.value}%</p>` : ''))

            g.append('p')
              .html((d) => (d.value > 0 ? d.key : ''))
              .classed('titles', true)
              .style('margin-top', (d, i) => 10 + 'px')
              .style('color', (d) => d3.rgb(colorscale(d.key)).darker(0.8))
          },

          (update) => {
            update
              .transition()
              .duration(time)
              .style('width', (d) => {
                return x(d.value) + 'px'
              })
            update
              .select('.rectangle')
              .html((d) => (d.value > 0 ? `<p> ${d.value}%</p>` : ''))
              .transition()
              .duration(time)
              .style('width', (d) => {
                return x(d.value) + 'px'
              })
            update.select('.titles').html((d) => (d.value > 0 ? d.key : ''))
          },
          (exit) => {
            exit.remove()
          }
        )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSet, width])

  return <div className="values" ref={graph} />
}

StackedBarGraph.propTypes = {
  dataSet: array,
  colors: array,
  margin: object,
  width: number,
  height: number,
}

export default StackedBarGraph
