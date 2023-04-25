export interface DataWrap {
  data: time | markdown
  prompt: string
}

export interface time {
  id: string
  timeline: pair[]
}

export interface pair {
  time: string
  text: string
}

export interface markdown {
  markdown: string
}

export function isDataWrap(rjson: any): rjson is DataWrap {
  if (!('data' in rjson)) return false
  if (!(isMarkdown(rjson.data) || isTime(rjson.data))) return false
  return true
}

export function isMarkdown(rjson: any): rjson is markdown {
  if (!('markdown' in rjson)) return false
  return true
}

export function isTime(rjson: any): rjson is time {
  if (!('id' in rjson)) return false
  if (!('timeline' in rjson)) return false
  if (Array.isArray(rjson.timeline)) {
    const list = rjson.timeline
    return list.every((it: any) => isPair(it))
  }
  return false
}

function isPair(rjson: any): rjson is pair {
  if (!('time' in rjson)) return false
  if (!('text' in rjson)) return false
  return true
}
