import { SearchOutlined, SendOutlined } from '@ant-design/icons'
import { message, Select, Spin } from 'antd'
import Search from 'antd/es/input/Search'
import { useState } from 'react'
import { DataWrap, isDataWrap } from '../interface/DataWrap'
import Pair from '../interface/Pair'
import { isErrorResponse, isSuccessResponse } from '../interface/Response'

interface InputBoxProps {
  // fileList: UploadFile<T>[];
  fileList: Pair[]
  linkList: Pair[]
  setHistory: (d: DataWrap[] | ((q: DataWrap[]) => DataWrap[])) => void
  server: string
}

export default function InputBox(props: InputBoxProps) {
  const [textBox, setTextBox] = useState<string>('')
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [count, setCount] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const audio = new Audio('qingtian.mp3')
  // const audio = new Audio('loading.mp3')

  /**
   * Handles the submit button being clicked or the enter key being pressed!
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
        format: 'prompt',
        prompt: textBox,
      })
      getData(json)
    }
  }

  function handleSummarize() {
    let json = JSON.stringify({
      fileList: props.fileList,
      linkList: props.linkList,
      format: 'summary',
    })
    getData(json)
  }

  /**
   * handle to show the table, prepare for backend
   */
  async function getData(args: string) {
    setLoading(true)
    audio.play()
    const data = await getResponse(`${props.server}getdata?data=${args}`)
    const json = await data.json()
    console.log(json) // TODO
    if (isSuccessResponse(json)) {
      const data = { data: json.data }
      console.log(data) // TODO
      if (isDataWrap(data)) {
        if (textBox.length == 0) data.prompt = 'Summary'
        else data.prompt = textBox
        props.setHistory((list) => [...list, data])
      } else {
        message.error(`Error: cannot define return data, check with server.`)
      }
    } else if (isErrorResponse(json)) {
      message.error(`Error: ${json.data}`)
    } else {
      message.error(`Error: server not response correctly.`)
    }
    setLoading(false)
    audio.pause()
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
    <div className="repl-input">
      <Spin spinning={loading} delay={500} tip="Loading" size="large">
        <div>
          <button
            className="p-2 m-3 btn btn-primary"
            onClick={() => handleSummarize()}
            aria-label={'Summarize button'}
          >
            Summarize Uploads
          </button>
        </div>
        <div style={{ height: '7vh' }}>
          <Search
            className="search"
            placeholder="Prompt Here!"
            loading={loading}
            prefix={<SearchOutlined />}
            enterButton={<SendOutlined style={{ marginBottom: '8px' }} />}
            size="large"
            bordered
            value={textBox}
            onSearch={() => handleSubmit()}
            onPressEnter={() => handleSubmit()}
            onChange={(e) => setTextBox(e.target.value)}
            onKeyUp={(e) => {
              if (e.keyCode == 38) up()
              if (e.keyCode == 40) down()
            }}
            aria-label={'Prompt input box'}
          />
        </div>
      </Spin>
    </div>
  )
}

/**
 * wrapper for fetch url
 * @param url url to fetch
 * @returns Promise
 */
async function getResponse(url: string): Promise<Response> {
  return await fetch(url)
    .then(function (response) {
      // first then()
      if (response.ok) return response
      return new Response(
        JSON.stringify({
          result: 'Serer error',
        })
      )
    })
    .catch(() => {
      return new Response(
        JSON.stringify({
          result: 'Serer error',
        })
      )
    })
}
