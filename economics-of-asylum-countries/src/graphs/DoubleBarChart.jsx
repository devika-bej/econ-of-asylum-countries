import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { countryState } from "../context/CountryProvider";
import BarChartSelector from "./BarChartSelector";
import { conversion_country } from "../utils/data_parser";

const DoubleBarChart = ({ countryTwoID }) => {
  // country selected from geomap page
  const { currBarData, ID } = countryState();

  // check if all required data available
  if (!currBarData || !currBarData[ID] || !currBarData[countryTwoID])
    return <h1> No Data present !</h1>;

  // reference for the svg
  const ref = useRef();

  // filtering the required data
  const curr_data = currBarData[ID];
  const data = [];
  const curr_data_two = currBarData[countryTwoID];
  const data_two = [];

  for (const year of curr_data.present) {
    const value = parseFloat(curr_data[year].replace(/,/g, ""));
    data.push({ Year: year, Value: value });
  }

  for (const year of curr_data_two.present) {
    const value = parseFloat(curr_data_two[year].replace(/,/g, ""));
    data_two.push({ Year: year, Value: value });
  }

  const year_union = [...curr_data.present, ...curr_data_two.present];

  useEffect(() => {
    // picking chart dimensions
    const chartWidth = parseFloat(d3.select(ref.current).style("width"));
    const chartHeight = parseFloat(d3.select(ref.current).style("height"));
    Math.max(
      d3.max(data, (d) => d.Value),
      d3.max(data_two, (d) => d.Value)
    );

    // set the dimensions and margins of the graph
    const margin = { top: 10, right: 10, bottom: 60, left: 60 },
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
    const x = d3.scaleBand().range([0, width]).domain(year_union).padding(0.2);
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
      .domain([
        0,
        Math.max(
          d3.max(data, (d) => d.Value),
          d3.max(data_two, (d) => d.Value)
        ),
      ])
      .range([height, 0]);
    svg.append("g").call(d3.axisLeft(y));

    // Bars
    const bars = svg
      .selectAll("mybar")
      .data(data)
      .join("rect")
      .attr("x", (d) => x(d.Year))
      .attr("y", height)
      .attr("width", x.bandwidth() * 0.4)
      .attr("height", 0)
      .attr("class", "mybar");
    const bars_two = svg
      .selectAll("mybartwo")
      .data(data_two)
      .join("rect")
      .attr("x", (d) => x(d.Year) + x.bandwidth() / 2)
      .attr("y", height)
      .attr("width", x.bandwidth() * 0.4)
      .attr("height", 0)
      .attr("class", "mybar2");

    // Animation
    bars
      .transition()
      .duration(800)
      .attr("y", (d) => y(d.Value))
      .attr("height", (d) => height - y(d.Value));
    bars_two
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
          .html(
            `Country: ${conversion_country[ID]}<br>Year: ${d.Year}<br>Value: ${d.Value}`
          );
      })
      .on("mousemove", function (event) {
        tooltip
          .style("top", event.pageY - 10 + "px")
          .style("left", event.pageX + 10 + "px");
      })
      .on("mouseout", function () {
        tooltip.style("visibility", "hidden");
      });
    bars_two
      .on("mouseover", function (event, d) {
        tooltip
          .style("visibility", "visible")
          .html(
            `Country: ${conversion_country[countryTwoID]}<br>Year: ${d.Year}<br>Value: ${d.Value}`
          );
      })
      .on("mousemove", function (event) {
        tooltip
          .style("top", event.pageY - 10 + "px")
          .style("left", event.pageX + 10 + "px");
      })
      .on("mouseout", function () {
        tooltip.style("visibility", "hidden");
      });
  }, [currBarData, ID, data, data_two]); // rerender everytime the data and country changes

  return (
    <div>
      <BarChartSelector />
      <svg width={"50vw"} height={"80vh"} id="barchart" ref={ref} />
    </div>
  );
};

export default DoubleBarChart;
