import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { countryState } from "../context/CountryProvider";
import BarChartSelector from "./BarChartSelector";

/*
  Bar chart component which is the second div of the Country Page
  Responsible for rendering the bar chart information everytime the selector value is changed
  Logic below is commented to show what part is responsible for displaying what (rectangles, axes , tooltip etc...)
  
  Starter code and refferences were taken from below
  https://kamibrumi.medium.com/getting-started-with-react-d3-js-d86ccea05f08
  https://www.react-graph-gallery.com/barplot

*/

const BarChart = () => {
  const { currBarData, ID } = countryState();

  if (!currBarData || !currBarData[ID]) return <h1> No Data present !</h1>;

  const ref = useRef();
  const curr_data = currBarData[ID];
  const data = [];

  for (const year of curr_data.present) {
    const value = parseFloat(curr_data[year].replace(/,/g, ""));
    data.push({ Year: year, Value: value });
  }

  useEffect(() => {
    const chartWidth = parseFloat(d3.select(ref.current).style("width"));
    const chartHeight = parseFloat(d3.select(ref.current).style("height"));

    // set the dimensions and margins of the graph
    const margin = { top: 30, right: 30, bottom: 70, left: 60 },
      width = chartWidth - margin.left - margin.right,
      height = chartHeight - margin.top - margin.bottom;

    // remove previous SVG if exists
    d3.select(ref.current).selectAll("*").remove(); // if not done then the re-renders overlap !

    // append the svg object to the body of the page
    const svg = d3
      .select(ref.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // X axis
    const x = d3
      .scaleBand()
      .range([0, width])
      .domain(data.map((d) => d.Year))
      .padding(0.2);
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    // Add Y axis
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.Value)])
      .range([height, 0]);
    svg.append("g").call(d3.axisLeft(y));

    // Bars
    const bars = svg
      .selectAll("mybar")
      .data(data)
      .join("rect")
      .attr("x", (d) => x(d.Year))
      .attr("y", height)
      .attr("width", x.bandwidth())
      .attr("height", 0)
      .attr("class", "mybar");

    // Animation
    bars
      .transition()
      .duration(800)
      .attr("y", (d) => y(d.Value))
      .attr("height", (d) => height - y(d.Value));

    // Tooltip
    const tooltip = d3
      .select("body")
      .append("div")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")
      .style("background-color", "white")
      .style("border", "1px solid black")
      .style("padding", "5px");

    bars
      .on("mouseover", function (event, d) {
        tooltip
          .style("visibility", "visible")
          .html(`Year: ${d.Year}<br>Value: ${d.Value}`);
      })
      .on("mousemove", function (event) {
        tooltip
          .style("top", event.pageY - 10 + "px")
          .style("left", event.pageX + 10 + "px");
      })
      .on("mouseout", function () {
        tooltip.style("visibility", "hidden");
      });
  }, [currBarData, ID]); // rerender everytime the data and country changes

  return (
    <div>
      <BarChartSelector />
      <svg width={"50vw"} height={"90vh"} id="barchart" ref={ref} />
    </div>
  );
};

export default BarChart;
