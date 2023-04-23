// interface HistoryBoxProps {
//   history: DataWrap[];
// }

import { Avatar, Empty, List } from "antd";
import Markdown from "./Markdown";
import Time from "./Timeline";
import TreeView from "./Tree";

const data = [{ a: 1 }, { a: 2 }];

function HistoryBox() {
  return (
    <div className="repl-history">
      {/* <Empty /> */}
      <List
        itemLayout="vertical"
        dataSource={data}
        renderItem={(item, index) => (
          <>
            <List.Item style={{ backgroundColor: "#efdbff", padding: "20px" }}>
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
                style={{ alignItems: "Center" }}
                src="https://www.youtube.com/embed/tgbNymZ7vqY?autoplay=1&mute=1&start=90"
              ></iframe>
              <Time></Time>
              {/* <TreeView></TreeView> */}
              <Markdown markdown="hello there"></Markdown>
              <div className="lh-base fst-normal paragraph">
                <p>
                  For those who are interested in finding random paragraphs,
                  that's exactly what this webpage provides. If both a random
                  word and a random sentence aren't quite long enough for your
                  needs, then a random paragraph might be the perfect solution.
                  Once you arrive at this page, you'll see a random paragraph.
                  If you need another one, all you need to do is click on the
                  "next paragraph" button. If you're a programmer and you need
                  random text to test the program, using these paragraphs can be
                  the perfect way to do this. Anyone who's in search of
                  realistic text for a project can use one or more of these
                  random paragraphs to fill their need.
                </p>
                <p>
                  Improve Writing For writers looking for a way to get their
                  creative writing juices flowing, using a random paragraph can
                  be a great way to do this. One of the great benefits of this
                  tool is that nobody knows what is going to appear in the
                  paragraph. This can be leveraged in a few different ways to
                  force the writer to use creativity. For example, the random
                  paragraph can be used as the beginning paragraph of a story
                  that the writer must finish.
                </p>
                <p>
                  I can also be used as a paragraph somewhere inside a short
                  story, or for a more difficult creative challenge, it can be
                  used as the ending paragraph. In every case, the writer is
                  forced to use creativity to incorporate the random paragraph
                  into the story. Rewriting Skills For some writers, it isn't
                  getting the original words on paper that's the challenge, but
                  rewriting the first and second drafts. Using the random
                  paragraph generator can be a good way to get into a rewriting
                  routine before beginning the project.
                </p>
                <p>
                  In this case, you take the random paragraph and rewrite it so
                  it retains the same meaning, but does so in a better and more
                  concise way. Beginning the day doing this with a random
                  paragraph can make the rewriting of an article, short story,
                  or chapter of a book much easier than trying to begin directly
                  with it. Overcome Writers' Block When it comes to writers'
                  block, often the most difficult part is simply beginning to
                  put words to paper.
                </p>
                <p>
                  One way that can often help is to write about something
                  completely different from what you're having the writers'
                  block about. This is where a random paragraph can be quite
                  helpful. By using this tool you can begin to chip away at the
                  writers' block by simply adding to the random paragraph that
                  appears with the knowledge that it's going to be completely
                  different from any writing you've been doing. Then once you
                  begin to put words on the paper, it should be easier to
                  transition into the writing that needs to get done.
                </p>
              </div>
            </List.Item>
            <br></br>
          </>
        )}
      />
    </div>
  );
}

export default HistoryBox;
