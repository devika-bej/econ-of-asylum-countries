import React, { useState } from "react";
import {
  gdp_data,
  ggxwdn_data,
  lur_data,
  pcpipch_data,
  pppgdp_data,
  ppppc_data,
} from "../utils/data_parser";
import { countryState } from "../context/CountryProvider";

/*
    This component is responsible for showning the type of data to be displayed on barchart
    
    The bar chart uses the value of currBarData as a dependancy for re-rendering
    this component is what actually changes the dependancys
*/

const BarChartSelector = () => {
  const { setCurrBarData } = countryState();
  const dataOptions = [
    { label: "GDP Data", value: gdp_data },
    { label: "Purchasing Power Parity per Capita Data", value: ppppc_data },
    { label: "Purchasing Power Parity GDP Data", value: pppgdp_data },
    { label: "Labour Underutilization Rate Data", value: lur_data },
    { label: "GGXWDN NGDP Data", value: ggxwdn_data },
    {
      label: "Price Change of High Technology Products Data",
      value: pcpipch_data,
    },
  ];

  const [selectedData, setSelectedData] = useState(null);

  // this logic is for checking if the any of the options have been selected/changed on the selector
  const handleChange = (event) => {
    const selectedValue = event.target.value;
    const selectedOption = dataOptions.find(
      (option) => option.label === selectedValue
    );
    setSelectedData(selectedOption.value);
    setCurrBarData(selectedOption.value);
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

export default BarChartSelector;
