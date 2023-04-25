import { message, Select, Spin } from 'antd'
import { useState } from 'react'
import { DataWrap, isDataWrap } from '../interface/DataWrap'
import { isErrorResponse, isSuccessResponse } from '../interface/Response'

interface InputBoxProps {
  // fileList: UploadFile<T>[];
  fileList: string[]
  linkList: string[]
  setHistory: (d: DataWrap[] | ((q: DataWrap[]) => DataWrap[])) => void
  server: string
}

export default function InputBox(props: InputBoxProps) {
  const [textBox, setTextBox] = useState<string>('')
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [count, setCount] = useState<number>(0)
  const [format, setFormat] = useState<string>('paragraph')
  const [loading, setLoading] = useState(false)

  /**
   * Handles the submit button being clicked or the enter key being pressed!
   * You may want to make this function more sophisticated to add real
   * command logic, but for now it just adds the text to the history box.
   */
  function handleSubmit() {
    if (textBox.length != 0) {
      const command = textBox
      setCommandHistory([...commandHistory, command])
      setCount(commandHistory.length)
      setTextBox('')
      let json = JSON.stringify({
        fileList: props.fileList,
        linkList: props.linkList,
        format: format,
        prompt: textBox,
      })
      getData(json)
    }
  }

  /**
   * handle to show the table, prepare for backend
   */
  async function getData(args: string) {
    setLoading(true)
    const data = await getResponse(`${props.server}getdata?data=${args}`)
    const json = await data.json()
    console.log(json)
    if (isSuccessResponse(json)) {
      const data = { data: json.data }
      if (isDataWrap(data)) {
        data.prompt = textBox
        props.setHistory((list) => [...list, data])
      } else {
        message.error(`Error: cannot define return data, check with server.`)
        message.error(`Error: cannot define return data, check with server.`)
      }
    } else if (isErrorResponse(json)) {
      message.error(`Error: ${json.data}`)
      message.error(`Error: ${json.data}`)
    } else {
      message.error(`Error: server not response correctly.`)
      message.error(`Error: server not response correctly.`)
    }
    setLoading(false)
  }

  /**
   * Use up arrow to go to last command
   */
  function up(): void {
    if (count < 0) {
      setCount(0)
      return
    }
    setTextBox(commandHistory[count])
    setCount((e) => e - 1)
  }

  /**
   * Use down arrow to go to next command
   */
  function down(): void {
    if (count >= commandHistory.length - 1) {
      setCount(commandHistory.length)
      return
    }

    if (count <= commandHistory.length) setTextBox(commandHistory[count + 1])
    setCount((e) => e + 1)
  }

  return (
    <div className="repl-input p-3 d-flex align-items-center">
      <Spin
        spinning={loading}
        delay={500}
        tip="Loading"
        size="large"
        className="repl-command-box"
      >
        <input
          disabled={loading}
          aria-label={'Prompt input box'}
          placeholder="Prompt Here!"
          type="text"
          className="repl-command-box p-2"
          onChange={(e) => setTextBox(e.target.value)}
          value={textBox}
          onKeyUp={(e) => {
            if (e.key == 'Enter') handleSubmit()
            if (e.keyCode == 38) up()
            if (e.keyCode == 40) down()
          }}
        />
      </Spin>
      <div className="d-flex flex-wrap align-content-around ms-4 align-items-start">
        <button
          className="repl-button p-2 m-1 btn btn-primary"
          onClick={() => handleSubmit()}
          aria-label={'Prompt button'}
        >
          Submit
        </button>
        <Select
          placeholder="Format"
          style={{ width: 120 }}
          onChange={(e) => setFormat(e)}
          options={[
            { value: 'paragraph', label: 'Paragraph' },
            { value: 'tree', label: 'Tree' },
            { value: 'time', label: 'Timeline' },
          ]}
        />
      </div>
    </div>
  )
}

/**
 * wrapper for fetch url
 * @param url url to fetch
 * @returns Promise
 */
async function getResponse(url: string): Promise<Response> {
  return await fetch(url).catch(() => {
    return new Response(
      JSON.stringify({
        result: 'Serer error',
        msg: 'Access server failed.',
        data: [],
      })
    )
  })
}
