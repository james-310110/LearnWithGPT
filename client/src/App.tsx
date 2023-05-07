import { AlertTwoTone, DeleteTwoTone, QuestionCircleOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'
import React, { useState, useEffect, useMemo } from 'react'
import FileControl from './components/FileControl'
import HistoryBox from './components/HistoryBox'
import InputBox from './components/InputBox'
import { DataWrap, findElementToDo } from './interface/DataWrap'
import './style/App.css'
import useLocalStorage from 'use-local-storage'
import Pair from './interface/Pair'
import { GoogleLogin } from '@leecheuk/react-google-login'

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

  const responseGoogle = (response: any) => {
    console.log(response)
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

  useEffect(() => {
    findElementToDo('repl-history', (div: { scrollTop: any; scrollHeight: any }) => {
      div.scrollTop = div.scrollHeight
    })
  }, [history])

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
        title={`
        Upload the files and links, then use the summarize to auto sum up contents for you, or use your prompt to query.
        Default format would be .markdown, and summarize could have timeline format if only sumbit youtube links. Tips:
        Only one file or link would make it more clear, GPT is not reliable for now.
        Enjoy💖`}
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
        <GoogleLogin
          className="googlelogin"
          clientId="658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com"
          buttonText="Google Login"
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          cookiePolicy={'single_host_origin'}
          isSignedIn={true}
        />
        <FileControl
          server={server}
          fileList={fileList}
          setFileList={setFileList}
          linkList={linkList}
          setLinkList={setLinkList}
        ></FileControl>
      </div>
      <div className="repl">
        <HistoryBox history={history} setHistory={setHistory}></HistoryBox>
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
