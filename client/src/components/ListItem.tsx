import { DataElement, DataWrap, isMarkdown, isTime } from '../interface/DataWrap'
import Markdown from './Markdown'
import Time from './Timeline'

interface ItemProps {
  data: DataElement[]
}

function ListItem(props: ItemProps) {
  return (
    <>
      {props.data.map((item, key) => {
        return (
          (isTime(item.data) && (
            <>
              <p key={key} className="paragraph listTitle">
                Files:[{'\n' + item.title + '\n'}]
              </p>
              <Time data={item.data} key={key}></Time>
            </>
          )) ||
          (isMarkdown(item.data) && (
            <>
              <p key={key} className="paragraph listTitle">
                {item.title}
              </p>
              <Markdown markdown={item.data.markdown} key={key}></Markdown>
            </>
          ))
        )
      })}
    </>
  )
}

export default ListItem
