import {
  isNoteSuccessResponse,
  isNoteErrorResponse,
} from "./ResponseInterface";

export interface Note {
  title: string;
  note: string;
  latitude: number;
  longitude: number;
}

/**
 * check if Note
 * @param json json
 * @returns boolean
 */
export function isNote(json: any): json is Note {
  return (
    "title" in json &&
    "note" in json &&
    "latitude" in json &&
    "longitude" in json
  );
}

/**
 * fetch data
 * @param url url
 * @returns response
 */
async function fetchData(url: string): Promise<[Note] | string> {
  const response = await fetch(url);
  if (response.ok) {
    const json = await response.json();
    if (!isNoteSuccessResponse(json) && !isNoteErrorResponse(json)) {
      return "Error: server not response correctly.";
    }
    return json.data;
  } else {
    return "Error: server not response.";
  }
}

/**
 * Get notes
 * @returns all notes or error message
 */
export function getNotes() {
  const url = "http://localhost:3232/note";
  return fetchData(url);
}

/**
 * Get to save
 * @param note note
 * @returns all notes or error message
 */
export function saveNotes(note: Note) {
  const url = "http://localhost:3232/note?note=" + JSON.stringify(note);
  return fetchData(url);
}
