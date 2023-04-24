export interface QueryResponse {
  result: string;
  data: string;
}

export function isSuccessResponse(rjson: any): rjson is QueryResponse {
  if (!("result" in rjson)) return false;
  if (rjson.result !== "success") return false;
  if (!("data" in rjson)) return false;
  return true;
}

export function isErrorResponse(rjson: any): rjson is QueryResponse {
  if (!("result" in rjson)) return false;
  if (rjson.result.substring(0, 5) !== "error") return false;
  if (!("data" in rjson)) return false;
  return true;
}
