import { incoming_refugee_data, outgoing_refugee_data } from "./data_parser";

// returns the statistics required for country page given the content type, year, country id

export const getStatistic = (value, year, ID) => {
  if (value === "Incoming refugees") {
    if (incoming_refugee_data[year] && incoming_refugee_data[year][ID]) {
      return incoming_refugee_data[year][ID];
    }
  } else if (value === "Outgoing refugees") {
    if (
      outgoing_refugee_data[year] &&
      outgoing_refugee_data[year][ID] &&
      outgoing_refugee_data[year][ID]["Count"]
    ) {
      return outgoing_refugee_data[year][ID]["Count"];
    }
  } else if (value === "Net difference") {
    if (
      outgoing_refugee_data[year] &&
      outgoing_refugee_data[year][ID] &&
      incoming_refugee_data[year] &&
      incoming_refugee_data[year][ID]
    ) {
      return (
        outgoing_refugee_data[year][ID]["Count"] -
        incoming_refugee_data[year][ID]
      );
    }
  }
  return "";
};
