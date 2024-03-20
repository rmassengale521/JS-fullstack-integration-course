const axios = require("axios");

const HttpError = require("../models/http-error");

const API_KEY = "pk.e4a35f10b64a2d67017363f95969c194";

const getCoordsForAddress = async (address) => {
    const response = await axios.get(
        `https://us1.locationiq.com/v1/search.php?key=${API_KEY}&q=${encodeURIComponent(address)}&format=json`
    );

    const data = response.data[0];

    // console.log(data);

    if (!data || data.status === "ZERO_RESULTS") {
        const error = new HttpError("Could not find location for the specified address.", 422);
        throw error;
    }

    const coorLat = data.lat;
    const coorLon = data.lon;
    const coordinates = {
        lat: coorLat,
        lng: coorLon
    };

    return coordinates;
}

module.exports = getCoordsForAddress;