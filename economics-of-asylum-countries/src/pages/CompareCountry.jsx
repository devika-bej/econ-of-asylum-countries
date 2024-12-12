import React, { useState } from "react";
import { countryState } from "../context/CountryProvider";
import { country_numeric } from "../utils/data_parser";
import DoubleBarChart from "../graphs/DoubleBarChart";
import DoubleLineChart from "../graphs/DoubleLineChart";

const CompareCountry = () => {
  const { ID, country } = countryState();
  const [countryTwo, setCountryTwo] = useState(ID);

  const newCountryTwo = (event) => {
    setCountryTwo(country_numeric[event.target.value]);
  };

  return (
    <div className="bg-purple-200 h-dvh grid justify-items-center">
      <select
        defaultValue={country}
        className="h-6 pl-2 mt-2 border-black border-2"
        onChange={newCountryTwo}
      >
        {Object.keys(country_numeric).map((countryOption) => (
          <option key={countryOption} value={countryOption}>
            {countryOption}
          </option>
        ))}
      </select>
      <div className="grid grid-cols-2">
        <DoubleBarChart countryTwoID={countryTwo}></DoubleBarChart>
        <DoubleLineChart countryTwoID={countryTwo}></DoubleLineChart>
      </div>
    </div>
  );
};

export default CompareCountry;
