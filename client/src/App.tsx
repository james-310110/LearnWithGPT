import React, { useState, useEffect } from "react";
import FileControl from "./components/FileControl";
import HistoryBox from "./components/HistoryBox";
import InputBox from "./components/InputBox";
import "./style/App.css";

function App() {
  // const [fileList, setFileList] = useState<Array<UploadFile<T>>>([]);
  const [fileList, setFileList] = useState<Array<string>>([]);
  const [linkList, setLinkList] = useState<Array<string>>([]);

  return (
    <div className="App">
      <div className="upload-area">
        <br></br>
        <FileControl
          fileList={fileList}
          setFileList={setFileList}
          linkList={linkList}
          setLinkList={setLinkList}
        ></FileControl>
      </div>
      <div className="repl">
        <HistoryBox></HistoryBox>
        <InputBox fileList={fileList} linkList={linkList}></InputBox>
      </div>
    </div>
  );
}

export default App;
