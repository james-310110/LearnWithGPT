import React, { useState } from 'react'
import { DeleteOutlined, InboxOutlined, LinkOutlined } from '@ant-design/icons'
import type { UploadProps } from 'antd'
import { message, Upload } from 'antd'
import validator from 'validator'
import Pair from '../interface/Pair'

const { Dragger } = Upload

interface FileControlProps {
  linkList: Pair[]
  fileList: Pair[]
  setFileList: (d: Pair[] | ((q: Pair[]) => Pair[])) => void
  setLinkList: (d: Pair[] | ((q: Pair[]) => Pair[])) => void
  server: string
}

const FileControl = (param: FileControlProps) => {
  const [link, setLink] = useState<string>('')
  const [time, setTime] = useState<number>(0)

  const props: UploadProps = {
    name: 'file',
    multiple: true,
    action: param.server + 'postdata' + `?upload_time=${time}`,
    showUploadList: true,
    fileList: param.fileList,
    beforeUpload: (file) => {
      setTime(Date.now())
      const oversize = file.size <= 10 * 1024 * 1024
      var exist = false
      param.fileList.forEach((e) => {
        if (e.name === file.name) {
          exist = true
          return
        }
      })
      if (exist) {
        message.error(`${file.name} is exist, please remove first`)
        message.error(`${file.name} is exist, please remove first`)
      }
      if (!oversize) {
        message.error(`${file.name} is too big, please check the size`)
        message.error(`${file.name} is too big, please check the size`)
      }
      return oversize && !exist
    },
    onChange(info) {
      const { status } = info.file
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`)
        message.success(`${info.file.name} file uploaded successfully.`)
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`)
        message.error(`${info.file.name} file upload failed.`)
      }
      if (info.file.name != undefined) {
        console.log(info.file.status)
        if (info.file.status === 'removed') {
          param.setFileList((list) => list.filter((link) => link.name !== info.file.name))
          return
        } else if (info.file.status === undefined) {
          info.file.status = 'error'
          return
        }
        const fl:
          | ((q: Pair[]) => Pair[])
          | {
              name: string
              time: number
              uid: string
              status: string
              percent: number
            }[] = []
        info.fileList.map((item) => {
          if (
            item.name != undefined &&
            item.status != undefined &&
            item.percent != undefined
          ) {
            fl.push({
              name: item.name,
              time: time,
              uid: item.uid,
              status: item.status,
              percent: item.status == 'uploading' ? 80 : 100,
            })
          }
        })
        param.setFileList(fl)
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files)
    },
    maxCount: 5,
  }

  function handleAddLink() {
    if (validator.isURL(link)) {
      var noExist = param.linkList.every((v) => {
        if (v.name === link) {
          return false
        }
        return true
      })
      if (!noExist) {
        message.error(`${link} is exist, please check again`)
        return
      }
      message.success(`Link uploaded successfully.`)
      param.setLinkList([
        ...param.linkList,
        { name: link, time: Date.now(), uid: 'none' },
      ])
      setLink('')
    } else {
      message.error('Link format incorrect')
    }
  }

  function handleDelLink(remove: string) {
    param.setLinkList((list) => list.filter((link) => link.name !== remove))
    setLink('')
    message.success(`Link removed successfully.`)
  }

  return (
    <div className="fileloader">
      <div className="linkArea">
        <input
          aria-label={'Link input box'}
          placeholder="Input link here"
          type="text"
          className="form-control"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          onKeyUp={(e) => {
            if (e.key == 'Enter') handleAddLink()
          }}
        ></input>
        <button
          aria-label={'Add Link'}
          className="btn btn-success mt-2 mb-2"
          onClick={() => handleAddLink()}
        >
          Add Link
        </button>
        <div className="linkListArea">
          {param.linkList.map((item, i) => {
            return (
              <p key={i} aria-label={item.name}>
                <LinkOutlined style={{ float: 'left' }} className="pt-1" />
                <span>{item.name}</span>
                <DeleteOutlined
                  onClick={() => handleDelLink(item.name)}
                  style={{ float: 'right' }}
                  className="pt-1"
                  id={'dellink-' + i}
                />
              </p>
            )
          })}
        </div>
      </div>

      <div className="fileArea">
        <Dragger {...props} id="inputFile">
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">Support all type of file!</p>
        </Dragger>
      </div>
    </div>
  )
}

export default FileControl
