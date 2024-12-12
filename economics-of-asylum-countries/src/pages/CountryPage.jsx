import React from "react";
import { countryState } from "../context/CountryProvider";
import SingleCountry from "./SingleCountry";
import CompareCountry from "./CompareCountry";
import Navbar from "../graphs/Navbar";

const CountryPage = () => {
  const {countryView} = countryState();
  return (
    <>
      <Navbar />
      {
        countryView=="SingleCountry" &&
        <SingleCountry />
      }
      {
         countryView=="CompareCountry" &&
        <CompareCountry />
      }
    </>
  );
};

export default CountryPage;
