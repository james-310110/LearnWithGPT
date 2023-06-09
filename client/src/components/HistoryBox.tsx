import { Avatar, List } from 'antd'
import { DataWrap } from '../interface/DataWrap'
import ListItem from './ListItem'

interface HistoryBoxProps {
  history: DataWrap[]
  setHistory: (d: DataWrap[] | ((q: DataWrap[]) => DataWrap[])) => void
}

function HistoryBox(props: HistoryBoxProps) {
  function deleteItem(index: number): void {
    var temp = [...props.history]
    temp.splice(index, 1)
    props.setHistory(temp)
  }

  function like(index: number): void {
    const dom = document.getElementById('like-' + index)
    if (dom?.className !== undefined) {
      if (dom?.className === 'unlike') {
        dom.className = 'like'
      } else {
        dom.className = 'unlike'
      }
    }
  }

  return (
    <div className="repl-history">
      <List
        itemLayout="vertical"
        dataSource={props.history}
        renderItem={(item, index) => (
          <>
            <List.Item
              className="listitem"
              style={{ padding: '20px' }}
              actions={[
                <a key={index + 10000} onClick={() => deleteItem(index)}>
                  delete
                </a>,
                <a
                  key={index}
                  className="unlike"
                  onClick={() => like(index)}
                  id={'like-' + index}
                  style={{ textDecoration: 'none' }}
                >
                  like
                </a>,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`}
                  />
                }
                title={`Learn With GPT`}
                description={item.prompt}
              />
              <ListItem data={item.data}></ListItem>

              {/* {isMarkdown(item.data[0].data) && (
                <Markdown markdown={item.data[0].data.markdown}></Markdown>
              )}
              {isTime(item.data[0].data) && <Time data={item.data[0].data}></Time>}
              {isTime(item.data[1].data) && <Time data={item.data[1].data}></Time>} */}

              {/* <>
                {item.data.map((it) => {
                  {
                    isMarkdown(it.data) && (
                      <Markdown markdown={it.data.markdown}></Markdown>
                    )
                  }
                  {
                    isTime(it.data) && <Time data={it.data}></Time>
                  }
                })}
              </> */}
            </List.Item>
            <br></br>
          </>
        )}
      />
    </div>
  )
}

export default HistoryBox
