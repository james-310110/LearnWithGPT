import { useState } from 'react'
import { Timeline, TimelineItemProps } from 'antd'
import { time } from '../interface/DataWrap'

interface timePorps {
  data: time
}

export default function VideoTime(props: timePorps) {
  const [start, setStart] = useState<number>(0)
  const items:
    | TimelineItemProps[]
    | { label: JSX.Element; children: string }[]
    | undefined = []
  props.data.timeline.forEach((element) => {
    items.push({
      label: (
        <a href="#" onClick={() => setStart(convert(element.time))}>
          {element.time}
        </a>
      ),
      children: element.text,
    })
  })

  return (
    <>
      <iframe
        width="700"
        height="400"
        style={{ alignItems: 'Center' }}
        src={`https://www.youtube.com/embed/${props.data.id}?autoplay=0&mute=1&start=${start}`}
      ></iframe>
      <Timeline mode={'left'} items={items} />
    </>
  )
}

function convert(time: string): number {
  var a = time.split(':') // split it at the colons

  // minutes are worth 60 seconds. Hours are worth 60 minutes.
  var seconds = +a[0] * 60 + +a[1]
  return seconds
}
