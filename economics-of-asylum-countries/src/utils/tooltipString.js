import { incoming_refugee_data, outgoing_refugee_data } from "./data_parser";

// returns the contents of the tooltip given the content type, year, country data point

export const getTooltipContent = (contentType, currentYear, d) => {
  var content = "";
  if (contentType == "None") content = "";
  else if (contentType == "Incoming refugees")
    content = incoming_refugee_data[currentYear][d.id]
      ? incoming_refugee_data[currentYear][d.id]
      : "0";
  else if (contentType == "Outgoing refugees")
    content = outgoing_refugee_data[currentYear][d.id]
      ? outgoing_refugee_data[currentYear][d.id]["Count"]
      : "0";
  else
    content = (
      (outgoing_refugee_data[currentYear][d.id]
        ? outgoing_refugee_data[currentYear][d.id]["Count"]
        : 0) -
      (incoming_refugee_data[currentYear][d.id]
        ? incoming_refugee_data[currentYear][d.id]
        : 0)
    ).toString();
  return content;
};
