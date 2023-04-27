import {
  AlertTwoTone,
  DeleteFilled,
  DeleteTwoTone,
  QuestionCircleOutlined,
} from '@ant-design/icons'
import { Tooltip } from 'antd'
import React, { useState, useEffect, useMemo } from 'react'
import FileControl from './components/FileControl'
import HistoryBox from './components/HistoryBox'
import InputBox from './components/InputBox'
import { DataWrap } from './interface/DataWrap'
import './style/App.css'
import useLocalStorage from 'use-local-storage'
import Pair from './interface/Pair'

function App() {
  const defaultDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const [theme, setTheme] = useLocalStorage('theme', defaultDark ? 'dark' : 'light')
  // const [fileList, setFileList] = useState<Array<UploadFile<T>>>([]);
  const [fileList, setFileList] = useState<Array<Pair>>([])
  const [linkList, setLinkList] = useState<Array<Pair>>([])
  const [history, setHistory] = useState<Array<DataWrap>>([])
  // Choose to run depend on which server!
  const server = 'http://localhost:8000/'
  // const server = 'http://mock/'

  const switchTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
  }

  const delHistory = () => {
    setHistory([])
  }

  useEffect(() => {
    const fl = window.sessionStorage.getItem('filelist')
    if (fl != 'undefined') {
      if (fl != null) {
        setFileList(() => JSON.parse(fl))
      }
    }
    const ll = window.sessionStorage.getItem('linklist')
    if (ll != 'undefined') {
      if (ll != null) {
        setLinkList(() => JSON.parse(ll))
      }
    }
    const his = window.sessionStorage.getItem('history')
    if (his != 'undefined') {
      if (his != null) {
        setHistory(() => JSON.parse(his))
      }
    }
  }, [])

  useEffect(() => {
    window.sessionStorage.setItem('filelist', JSON.stringify(fileList))
    window.sessionStorage.setItem('linklist', JSON.stringify(linkList))
    window.sessionStorage.setItem('history', JSON.stringify(history))
  }, [fileList, linkList, history])

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
          height={'10em'}
          width={'10em'}
        />
      </Tooltip>
      <Tooltip
        placement="right"
        title={`Change to drak/light mode`}
        arrow={true}
        color={'grey'}
      >
        <AlertTwoTone
          onClick={switchTheme}
          style={{
            position: 'absolute',
            top: '35px',
            right: '10px',
            zIndex: '99999',
          }}
          twoToneColor={theme == 'dark' ? 'white' : 'black'}
        />
      </Tooltip>
      <Tooltip
        placement="right"
        title={`Remove query history`}
        arrow={true}
        color={'grey'}
      >
        <DeleteTwoTone
          onClick={delHistory}
          style={{
            position: 'absolute',
            top: '60px',
            right: '10px',
            zIndex: '99999',
          }}
          twoToneColor={'red'}
        />
      </Tooltip>

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
