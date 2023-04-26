import { AlertTwoTone, QuestionCircleOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'
import React, { useState, useEffect, useMemo } from 'react'
import FileControl from './components/FileControl'
import HistoryBox from './components/HistoryBox'
import InputBox from './components/InputBox'
import { DataWrap } from './interface/DataWrap'
import './style/App.css'
import useLocalStorage from 'use-local-storage'

function App() {
  const defaultDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const [theme, setTheme] = useLocalStorage('theme', defaultDark ? 'dark' : 'light')
  // const [fileList, setFileList] = useState<Array<UploadFile<T>>>([]);
  const [fileList, setFileList] = useState<Array<string>>([])
  const [linkList, setLinkList] = useState<Array<string>>([])
  const [history, setHistory] = useState<Array<DataWrap>>([])
  // Choose to run depend on which server!
  const server = 'http://localhost:8000/'
  // const server = 'http://mock/'

  const switchTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
  }

  return (
    <div className="App" data-theme={theme}>
      {history.length == 0 && (
        <nav className="navbar fixed-top navbar-dark bg-dark">
          <div className="container-fluid justify-content-center">
            <a className="navbar-brand" href="#">
              Learn With GPT
            </a>
          </div>
        </nav>
      )}
      <Tooltip
        placement="right"
        title={`Upload the files and link, then use the query to get your result. Enjoy💖`}
        arrow={true}
        color={'grey'}
      >
        <QuestionCircleOutlined
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: '99999',
            color: 'purple',
          }}
        />
      </Tooltip>
      <AlertTwoTone
        onClick={switchTheme}
        style={{
          position: 'absolute',
          top: '30px',
          right: '10px',
          zIndex: '99999',
        }}
        twoToneColor={theme == 'dark' ? 'white' : 'black'}
      />
      <div className="upload-area">
        <br></br>
        <FileControl
          server={server}
          fileList={fileList}
          setFileList={setFileList}
          linkList={linkList}
          setLinkList={setLinkList}
        ></FileControl>
      </div>
      <div className="repl">
        <HistoryBox history={history}></HistoryBox>
        <hr></hr>
        <InputBox
          server={server}
          fileList={fileList}
          linkList={linkList}
          setHistory={setHistory}
        ></InputBox>
      </div>
    </div>
  )
}

export default App
