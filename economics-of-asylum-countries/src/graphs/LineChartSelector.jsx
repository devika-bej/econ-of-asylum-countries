import React, { useState } from "react";
import { lur_data, ggxwdn_data, pcpipch_data } from "../utils/data_parser";
import { countryState } from "../context/CountryProvider";

/*
    This component is responsible for showning the type of data to be displayed on line chart in compare country page
    
    The line chart uses the value of currLineData as a dependancy for re-rendering
    this component is what actually changes the dependancys
*/

const LineChartSelector = () => {
  const { setCurrLineData } = countryState();
  const dataOptions = [
    { label: "Unemployment rates", value: lur_data },
    { label: "Debt as percentage of GDP", value: ggxwdn_data },
    { label: "Inflation rate", value: pcpipch_data },
  ];

  const [selectedData, setSelectedData] = useState(null);

  // this logic is for checking if the any of the options have been selected/changed on the selector
  const handleChange = (event) => {
    const selectedValue = event.target.value;
    const selectedOption = dataOptions.find(
      (option) => option.label === selectedValue
    );
    setSelectedData(selectedOption.value);
    setCurrLineData(selectedOption.value);
  };

  return (
    <div>
      <select onChange={handleChange}>
        {dataOptions.map((option) => (
          <option key={option.label} value={option.label}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LineChartSelector;
