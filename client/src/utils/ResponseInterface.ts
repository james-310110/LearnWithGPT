import { FeatureCollection } from "geojson";
import { Note, isNote } from "./note";

export function isFeatureCollection(json: any): json is FeatureCollection {
  return json.type === "FeatureCollection";
}

export interface GeoJsonSuccessResponse {
  result: string;
  data: FeatureCollection;
}

export interface GeoJsonErrorResponse {
  result: string;
  data: string;
}

export interface NoteSuccessResponse {
  result: string;
  data: [Note];
}

export interface NoteErrorResponse {
  result: string;
  data: string;
}

export function isGeoJsonSuccessResponse(
  rjson: any
): rjson is GeoJsonSuccessResponse {
  if (!("result" in rjson)) return false;
  if (rjson.result !== "success") return false;
  if (!("data" in rjson)) return false;
  if (!isFeatureCollection(rjson.data)) return false;
  return true;
}

export function isGeoJsonErrorResponse(
  rjson: any
): rjson is GeoJsonErrorResponse {
  if (!("result" in rjson)) return false;
  if (rjson.result.substring(0, 5) !== "error") return false;
  if (!("data" in rjson)) return false;
  return true;
}

export function isNoteSuccessResponse(
  rjson: any
): rjson is NoteSuccessResponse {
  if (!("result" in rjson)) return false;
  if (rjson.result !== "success") return false;
  if (!("data" in rjson)) return false;
  rjson.data.forEach((element: any) => {
    if (!isNote(element)) return false;
  });
  return true;
}

export function isNoteErrorResponse(rjson: any): rjson is NoteErrorResponse {
  if (!("result" in rjson)) return false;
  if (rjson.result.substring(0, 5) !== "error") return false;
  if (!("data" in rjson)) return false;
  return true;
}
