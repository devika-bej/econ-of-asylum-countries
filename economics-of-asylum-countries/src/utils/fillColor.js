import { incoming_refugee_data, outgoing_refugee_data } from "./data_parser";

// given the colorschemes, the type of data in use, the year, and the data point
// returns the color to be used for the country

export const getFillColor = (
  contentType,
  currentYear,
  greyOrColor,
  incomingColors,
  outgoingColors,
  netDifferenceColors,
  incomingColorsGrey,
  outgoingColorsGrey,
  netDifferenceColorsGrey,
  d
) => {
  if (contentType == "None") return "white";
  else if (contentType == "Incoming refugees")
    return incoming_refugee_data[currentYear][d.id]
      ? greyOrColor == "grey"
        ? incomingColorsGrey(incoming_refugee_data[currentYear][d.id])
        : incomingColors(incoming_refugee_data[currentYear][d.id])
      : "white";
  else if (contentType == "Outgoing refugees")
    return outgoing_refugee_data[currentYear][d.id]
      ? greyOrColor == "grey"
        ? outgoingColorsGrey(outgoing_refugee_data[currentYear][d.id]["Count"])
        : outgoingColors(outgoing_refugee_data[currentYear][d.id]["Count"])
      : "white";
  else {
    if (incoming_refugee_data[currentYear][d.id]) {
      if (outgoing_refugee_data[currentYear][d.id])
        return greyOrColor == "grey"
          ? netDifferenceColorsGrey(
              outgoing_refugee_data[currentYear][d.id]["Count"] -
                incoming_refugee_data[currentYear][d.id]
            )
          : netDifferenceColors(
              outgoing_refugee_data[currentYear][d.id]["Count"] -
                incoming_refugee_data[currentYear][d.id]
            );
      else
        return greyOrColor == "grey"
          ? netDifferenceColorsGrey(-incoming_refugee_data[currentYear][d.id])
          : netDifferenceColors(-incoming_refugee_data[currentYear][d.id]);
    } else {
      if (outgoing_refugee_data[currentYear][d.id])
        return greyOrColor == "grey"
          ? netDifferenceColorsGrey(
              outgoing_refugee_data[currentYear][d.id]["Count"]
            )
          : netDifferenceColors(
              outgoing_refugee_data[currentYear][d.id]["Count"]
            );
      else return "white";
    }
  }
};
