import { Avatar, List } from 'antd'
import { DataWrap, isMarkdown, isTime } from '../interface/DataWrap'
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
              {isMarkdown(item.data) && (
                <Markdown markdown={item.data.markdown}></Markdown>
              )}
              {isTime(item.data) && <Time data={item.data}></Time>}
            </List.Item>
            {/* <List.Item style={{ backgroundColor: '#efdbff', padding: '20px' }}>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`}
                      />
                    }
                    title={`Learn With GPT`}
                    description="Here is the response:"
                  />
                  <iframe
                    width="700"
                    height="400"
                    style={{ alignItems: 'Center' }}
                    src="https://www.youtube.com/embed/ZxsrgzZgz1U?autoplay=1&mute=1&start=90"
                  ></iframe>
                  <Time></Time>
                  {/* <TreeView></TreeView> */}
            {/* <Markdown markdown="hello there"></Markdown>
                  <div className="lh-base fst-normal paragraph">
                    <p>
                      For those who are interested in finding random paragraphs, that's
                      exactly what this webpage provides. If both a random word and a random
                      sentence aren't quite long enough for your needs, then a random
                      paragraph might be the perfect solution. Once you arrive at this page,
                      you'll see a random paragraph. If you need another one, all you need to
                      do is click on the "next paragraph" button. If you're a programmer and
                      you need random text to test the program, using these paragraphs can be
                      the perfect way to do this. Anyone who's in search of realistic text for
                      a project can use one or more of these random paragraphs to fill their
                      need.
                    </p>
                  </div>
                </List.Item> */}
            <br></br>
          </>
        )}
      />
    </div>
  )
}

export default HistoryBox
