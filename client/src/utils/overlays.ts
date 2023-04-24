import { FeatureCollection } from "geojson";
import { FillLayer } from "react-map-gl";
import rl_data from "../mockData/fullDownload.json";
import {
  isGeoJsonSuccessResponse,
  isGeoJsonErrorResponse,
  isFeatureCollection,
} from "./ResponseInterface";

/**
 * fetch data
 * @param url url
 * @returns response
 */
async function fetchData(
  url: string
): Promise<GeoJSON.FeatureCollection | string> {
  const response = await fetch(url);
  if (response.ok) {
    const json = await response.json();
    if (!isGeoJsonSuccessResponse(json) && !isGeoJsonErrorResponse(json)) {
      return "Error: server not response correctly.";
    }
    return json.data;
  } else {
    return "Error: server not response.";
  }
}

/**
 * get overlay data from backend
 * @param filter include arg for latitude and longitude
 * @returns
 */
export function overlayData(filter: {
  minLat: string | undefined;
  maxLat: string | undefined;
  minLon: string | undefined;
  maxLon: string | undefined;
}): Promise<GeoJSON.FeatureCollection | string> {
  const url = `http://localhost:3232/filter?filter=` + JSON.stringify(filter);
  return fetchData(url);
}

/**
 * initial data with local
 * @returns GeoJson data
 */
export function initialData(): GeoJSON.FeatureCollection | undefined {
  return isFeatureCollection(rl_data) ? rl_data : undefined;
}

const propertyName = "holc_grade";
export const geoLayer: FillLayer = {
  id: "geo_data",
  type: "fill",
  paint: {
    "fill-color": [
      "match",
      ["get", propertyName],
      "A",
      "#5bcc04",
      "B",
      "#04b8cc",
      "C",
      "#e9ed0e",
      "D",
      "#d11d1d",
      "#ccc",
    ],
    "fill-opacity": 0.2,
  },
};
