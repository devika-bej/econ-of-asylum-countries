import { createContext, useContext, useState, useEffect } from "react";
import { gdp_data, lur_data } from "../utils/data_parser";

// keeps track of the country selected

const CountryContext = createContext();

const CountryProvider = ({ children }) => {
  const [country, setCountry] = useState(null); // country name
  const [ID, setCountryID] = useState(null); // country ID
  const [year, setYear] = useState("2000"); // year on the slider
  const [currBarData, setCurrBarData] = useState(gdp_data); // data being presented on the bar chart in country pages
  const [currLineData, setCurrLineData] = useState(lur_data); // data being presented on the line chart in compare country page
  const [countryView, setCountryView] = useState("SingleCountry"); // whether to display single country page or compare country page
  return (
    <CountryContext.Provider
      value={{
        country,
        setCountry,
        ID,
        setCountryID,
        currBarData,
        setCurrBarData,
        currLineData,
        setCurrLineData,
        countryView,
        setCountryView,
        year,
        setYear,
      }}
    >
      {children}
    </CountryContext.Provider>
  );
};

export const countryState = () => {
  return useContext(CountryContext);
};

export default CountryProvider;
