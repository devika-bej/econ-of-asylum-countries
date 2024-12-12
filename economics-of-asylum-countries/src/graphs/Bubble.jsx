import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import { lur_data, ggxwdn_data, pcpipch_data } from "../utils/data_parser";
import { countryState } from "../context/CountryProvider";
import { conversion_country } from "../utils/data_parser";
// import * as d3Legend from "d3-color-legend";

const GroupVisualization = () => {
  const { ID } = countryState();
  const [selectedYear, setSelectedYear] = useState("2023");
  const [selectedData, setSelectedData] = useState("lur_data"); // State for selected data representation
  const years = [
    "2008",
    "2009",
    "2010",
    "2011",
    "2012",
    "2013",
    "2014",
    "2015",
    "2016",
    "2017",
    "2018",
    "2019",
    "2020",
    "2021",
    "2022",
    "2023",
  ];
  const datasets = ["lur_data", "ggxwdn_data", "pcpipch_data"]; // Options for data representation
  const option_mapping = {
    lur_data: "Unemployment Rates",
    ggxwdn_data: "Debt as % of GDP",
    pcpipch_data: "Inflation as % of GDP",
  };
  const svgRef = useRef();
  // const legendRef = useRef();

  useEffect(() => {
    // Initial draw when component mounts
    drawBubbleChart(selectedYear, selectedData);
    // drawLegend();
  }, [selectedYear, selectedData]);

  const drawBubbleChart = (year, dataKey) => {
    d3.select(svgRef.current).selectAll("*").remove();
    // Extracting data for the selected year and data representation
    const data = Object.entries(eval(dataKey)).map(([country, values]) => ({
      country,
      value: values[year] || 0,
    }));

    const svg = d3.select(svgRef.current);

    // Define the scales for mapping data to visual properties
    const radiusScale = d3
      .scaleSqrt()
      .domain([d3.min(data, (d) => d.value), d3.max(data, (d) => d.value)])
      .range([2, 20]);

    // Define a diverging color scale
    const colorScale = d3
      .scaleSequential(d3.interpolateRdYlBu) // Using a diverging color scale
      .domain([0, d3.max(data, (d) => d.value)]);

    const simulation = d3
      .forceSimulation(data)
      .force("charge", d3.forceManyBody().strength(+11))
      .force("center", d3.forceCenter(700, 700))
      .force(
        "collide",
        d3.forceCollide().radius((d) => radiusScale(d.value) + 18) // Adjust the collision detection radius
      )
      .on("tick", ticked);

    const g = svg.append("g");

    function ticked() {
      const circles = g
        .selectAll("circle")
        .data(data)
        .join("circle")
        .attr("r", (d) => {
          // Set the radius based on the value, but if the value is small, null, or zero, set a minimum radius
          if (d.value < 2) {
            return 5;
          }
          return radiusScale(d.value * 1.5);
        })
        .attr("fill", (d) => {
          // Set fill color based on value
          if (d.country === ID) {
            return "yellow"; // Yellow fill for highlighted country
          } else {
            return colorScale(d.value);
          }
        })
        .attr("stroke", (d) => {
          // Set stroke color based on value
          // if (d.country === ID) {
          //   return "none"; // No stroke for highlighted country
          // } else if (d.value < 1) {
          //   return "red"; // Red stroke for empty circles
          // }
          return "none"; // No stroke for filled circles
        })
        .attr("stroke-width", 2) // Set stroke width for non-highlighted circles
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .on("mouseover", handleMouseOver)
        .on("mousemove", handleMouseOver)
        .on("mouseout", handleMouseOut)
        .call(
          d3
            .drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended)
        );

      function handleMouseOver(event, d) {
        const tooltip = d3.select("#tooltip");
        tooltip
          .style("opacity", 1)
          .html(`${conversion_country[d.country]}: ${d.value}`)
          .style("position", "absolute")
          .style("left", `${event.pageX}px`)
          .style("top", `${event.pageY}px`)
          .style("font-size", "20px"); // Adjust the font size as needed
      }

      function handleMouseOut() {
        d3.select("#tooltip").style("opacity", 0);
      }

      // const labels = g
      //   .selectAll("text")
      //   .data(data)
      //   .join("text")
      //   .text((d) => (d.country === ID ? conversion_country[d.country] : null))
      //   .attr("text-anchor", "middle")
      //   .style("fill", (d) => "black")
      //   .attr("dy", ".35em")
      //   .attr("x", (d) => d.x)
      //   .attr("y", (d) => d.y);
    }

    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      // Calculate the new position within the SVG boundaries
      const newX = Math.max(
        radiusScale(d.value),
        Math.min(1800 - radiusScale(d.value), event.x)
      );
      const newY = Math.max(
        radiusScale(d.value),
        Math.min(1800 - radiusScale(d.value), event.y)
      );

      // Update the position of the circle and its label
      d.fx = newX;
      d.fy = newY;

      // Update the position of the circle within SVG boundaries
      d3.select(this)
        .attr("cx", (d) => d.fx)
        .attr("cy", (d) => d.fy);
      d3.select(this.nextSibling)
        .attr("x", (d) => d.fx)
        .attr("y", (d) => d.fy);
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  };

  const changeStackCountry = (event) => {
    const year = event.target.value;
    setSelectedYear(year);
  };

  const changeDataRepresentation = (event) => {
    const dataKey = event.target.value;
    setSelectedData(dataKey);
  };

  return (
    <div className="dropdown">
      <div className="flex-col text-center">
        <div style={{ width: "300px" }} />
        <label htmlFor="bubbleChartSelectYear">Select A Year: </label>
        <div className="select text-center">
          <select
            id="bubbleChartSelectYear"
            onChange={changeStackCountry}
            value={selectedYear}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <label htmlFor="dataRepresentation">Select Data Representation: </label>
        <div className=" flex  items-center justify-center select text-center">
          <select
            id="dataRepresentation"
            onChange={changeDataRepresentation}
            value={selectedData}
            className="block appearance-none  bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 rounded shadow leading-tight focus:outline-none focus:shadow-outline text-lg" // Increased text size using text-lg class
          >
            {datasets.map((dataset) => (
              <option
                key={dataset}
                value={dataset}
                className="bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 rounded shadow leading-tight focus:outline-none focus:shadow-outline text-lg" // Increased text size using text-lg class
              >
                {option_mapping[dataset]}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div id="tooltip"></div>
      <svg width="1800" height="1800" ref={svgRef} />
      {/* <svg width="300" height="50" ref={legendRef} /> */}
    </div>
  );
};

export default GroupVisualization;
