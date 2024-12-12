import outgoing_refugee_data from "../datasets/outgoing_refugee_data.json" with { type: "json" };
import incoming_refugee_data from "../datasets/incoming_refugee_data.json" with { type: "json" };
import gdp_data from "../datasets/NGDP.json" with { type: "json" };
import ppppc_data from "../datasets/PPPPC.json" with { type: "json" };
import pppgdp_data from "../datasets/PPPGDP.json" with { type: "json" };
import lur_data from "../datasets/LUR.json" with { type: "json" };
import ggxwdn_data from "../datasets/GGXWDN_NGDP.json" with { type: "json" };
import pcpipch_data from "../datasets/PCPIPCH.json" with { type: "json" };
import population_data from "../datasets/population_dataset.json" with { type: "json" };
import country_numeric from "../datasets/country_numeric.json" with {type: "json"};
import conversion_country from "../datasets/conversion_country.json" with {type: "json"};

export {
    outgoing_refugee_data, 
    incoming_refugee_data, 
    gdp_data, 
    ppppc_data, 
    pppgdp_data, 
    lur_data, 
    ggxwdn_data, 
    pcpipch_data, 
    population_data, 
    // country name to country id mapping 
    country_numeric, 
    // country id to country name mapping
    conversion_country, 
};
