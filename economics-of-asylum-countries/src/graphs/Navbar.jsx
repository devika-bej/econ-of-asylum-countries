import React from "react";
import { countryState } from "../context/CountryProvider";

// Navbar on the country page to switch between single country view and compare country view

const Navbar = () => {
  const { countryView, setCountryView } = countryState();
  const handleCountryViewChange = (view) => {
    setCountryView(view);
  };
  return (
    <div className="flex justify-center bg-black text-lg h-[10vh]">
      <button
        className={`${
          countryView === "option1"
            ? "bg-gray-900 text-white"
            : "text-gray-300 hover:bg-gray-700 hover:text-white"
        } px-3 py-2 rounded-md text-xl font-medium focus:outline-none focus:text-white focus:bg-gray-700`}
        onClick={() => handleCountryViewChange("SingleCountry")}
      >
        Single Country
      </button>
      <button
        className={`${
          countryView === "option2"
            ? "bg-gray-900 text-white"
            : "text-gray-300 hover:bg-gray-700 hover:text-white"
        } ml-3 px-3 py-2 rounded-md text-xl font-medium focus:outline-none focus:text-white focus:bg-gray-700`}
        onClick={() => handleCountryViewChange("CompareCountry")}
      >
        Compare Countries
      </button>
    </div>
  );
};

export default Navbar;
