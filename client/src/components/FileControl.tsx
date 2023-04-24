import React, { useState } from "react";
import { DeleteOutlined, InboxOutlined, LinkOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd";
import { message, Upload } from "antd";
import validator from "validator";
import { T } from "vitest/dist/types-94cfe4b4";

const { Dragger } = Upload;

interface FileControlProps {
  linkList: string[];
  fileList: string[];
  // setFileList: (
  //   d: UploadFile<T>[] | ((q: UploadFile<T>[]) => UploadFile<T>[])
  // ) => void;
  setFileList: (d: string[] | ((q: string[]) => string[])) => void;
  setLinkList: (d: string[] | ((q: string[]) => string[])) => void;
}

const FileControl = (param: FileControlProps) => {
  const [link, setLink] = useState<string>("");

  const props: UploadProps = {
    name: "file",
    multiple: true,
    action: "http://localhost:8000/postdata",
    beforeUpload: (file) => {
      const isPDF = file.type === "application/pdf";
      const istxt = file.type === "text/plain";
      const oversize = file.size <= 10 * 1024 * 1024;
      const exist = param.fileList.includes(file.name);
      if (exist) {
        message.error(`${file.name} is exist, please remove first`);
      }
      if (!oversize) {
        message.error(`${file.name} is too big`);
      }
      if (!istxt && !isPDF) {
        message.error(`${file.name} is not a correct file`);
      }
      return (isPDF || istxt) && oversize && !exist;
    },
    onChange(info) {
      const { status } = info.file;
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
      console.log(info);
      if (info.file.name != undefined) {
        if (info.file.status === "removed") {
          param.setFileList((list) =>
            list.filter((link) => link !== info.file.name)
          );
        } else {
          param.setFileList([...param.fileList, info.file.name]);
        }
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
      //
    },
    maxCount: 5,
  };

  function handleAddLink() {
    if (validator.isURL(link)) {
      message.success(`Link uploaded successfully.`);
      param.setLinkList([...param.linkList, link]);
      setLink("");
    } else {
      message.error("Link format incorrect");
    }
  }

  function handleDelLink(remove: string) {
    param.setLinkList((list) => list.filter((link) => link !== remove));
    setLink("");
    message.success(`Link removed successfully.`);
  }

  return (
    <div className="fileloader">
      <div className="linkArea">
        <input
          aria-label={"Note input box"}
          placeholder="Input link here"
          type="text"
          className="form-control"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          onKeyUp={(e) => {
            if (e.key == "Enter") handleAddLink();
          }}
        ></input>
        <button
          aria-label={"Submit button"}
          className="btn btn-success mt-2 mb-2"
          onClick={() => handleAddLink()}
        >
          Add Link
        </button>
        <div className="linkListArea">
          {param.linkList.map((item, i) => {
            return (
              <p key={i} aria-label={item}>
                <LinkOutlined style={{ float: "left" }} className="pt-1" />
                <span>{item}</span>
                <DeleteOutlined
                  onClick={() => handleDelLink(item)}
                  style={{ float: "right" }}
                  className="pt-1"
                />
              </p>
            );
          })}
        </div>
      </div>

      <div>
        <Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
          <p className="ant-upload-hint">Only PDF and TXT support</p>
        </Dragger>
      </div>
    </div>
  );
};

export default FileControl;
