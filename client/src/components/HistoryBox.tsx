import { Avatar, List } from 'antd'
import { DataWrap, isMarkdown, isTime } from '../interface/DataWrap'
import ListItem from './ListItem'
import Markdown from './Markdown'
import Time from './Timeline'
import TreeView from './Tree'

interface HistoryBoxProps {
  history: DataWrap[]
}

function HistoryBox(props: HistoryBoxProps) {
  return (
    <div className="repl-history">
      <List
        itemLayout="vertical"
        dataSource={props.history}
        renderItem={(item, index) => (
          <>
            <List.Item className="listitem" style={{ padding: '20px' }}>
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
