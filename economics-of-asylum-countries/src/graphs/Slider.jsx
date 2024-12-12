import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { sliderRight } from "d3-simple-slider";
import { countryState } from "../context/CountryProvider";

function Slider() {
  const sliderRef = useRef();
  const { year, setYear } = countryState();
  console.log(year);
  useEffect(() => {
    var currentYear = "2000";
    // setting up slider for geomap
    var slider = sliderRight()
      .min(2000)
      .max(2023)
      .step(1)
      .height(400)
      .default(2000)
      .ticks(24)
      .tickFormat(d3.format("d"))
      .on("onchange", (event) => {
        currentYear = event.toString();
        setYear(currentYear);
      });

    d3.select(sliderRef.current).selectAll(".yearSlider").remove();

    d3.select(sliderRef.current)
      .append("svg")
      .attr("class", "yearSlider")
      .attr("transform", "translate(50,50)")
      .attr("height", 500)
      .call(slider);
  }, []);
  return (
    <div style={{ position: 'absolute', top: 200, left: 30 }}>
      <svg className="w-1/10 h-[40vw] text-black" ref={sliderRef}></svg>
    </div>
  );
}

export default Slider;
