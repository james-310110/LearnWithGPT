import { QuestionCircleOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'
import React, { useState, useEffect, useMemo } from 'react'
import FileControl from './components/FileControl'
import HistoryBox from './components/HistoryBox'
import InputBox from './components/InputBox'
import { DataWrap } from './interface/DataWrap'
import './style/App.css'

function App() {
  // const [fileList, setFileList] = useState<Array<UploadFile<T>>>([]);
  const [fileList, setFileList] = useState<Array<string>>([])
  const [linkList, setLinkList] = useState<Array<string>>([])
  const [history, setHistory] = useState<Array<DataWrap>>([])
  // Choose to run depend on which server!
  const server = 'http://localhost:8000/'
  // const server = "http://mock/";

  return (
    <div className="App">
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
