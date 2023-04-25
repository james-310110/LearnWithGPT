import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import InputBox from '../src/components/InputBox'
import userEvent from '@testing-library/user-event'
import FileControl from '../src/components/FileControl'
import { DataWrap } from '../src/interface/DataWrap'
import HistoryBox from '../src/components/HistoryBox'
import App from '../src/App'

describe('Element load test', () => {
  test('display the file control'),
    async () => {
      const [fileList, setFileList] = useState<Array<string>>([])
      const [linkList, setLinkList] = useState<Array<string>>([])
      render(
        <FileControl
          server={''}
          fileList={fileList}
          setFileList={setFileList}
          linkList={linkList}
          setLinkList={setLinkList}
        ></FileControl>
      )
      expect(document.getElementsByClassName('linkListArea').item(0)).toBeInTheDocument()
      expect(screen.getByRole('textbox', { name: 'Link input box' })).toBeInTheDocument()
      expect(document.getElementsByClassName('btn-success').item(0)).toBeInTheDocument()
      expect(document.getElementsByClassName('fileArea').item(0)).toBeInTheDocument()
    }

  test('display the repl', async () => {
    ;async () => {
      const [fileList, setFileList] = useState<Array<string>>([])
      const [linkList, setLinkList] = useState<Array<string>>([])
      const [history, setHistory] = useState<Array<DataWrap>>([])
      // Choose to run depend on which server!
      const server = 'http://localhost:8000/'
      render(
        <>
          <HistoryBox history={history}></HistoryBox>
          <hr></hr>
          <InputBox
            server={server}
            fileList={fileList}
            linkList={linkList}
            setHistory={setHistory}
          ></InputBox>
        </>
      )
      expect(document.getElementsByClassName('repl-input').item(0)).toBeInTheDocument()
      expect(
        document.getElementsByClassName('repl-command-box').item(0)
      ).toBeInTheDocument()
      expect(document.getElementsByClassName('repl-button').item(0)).toBeInTheDocument()
      expect(document.getElementsByClassName('repl-history').item(0)).toBeInTheDocument()
    }
  })
})

describe('Element use test', () => {
  test('displays link', async () => {
    ;async () => {
      const [fileList, setFileList] = useState<Array<string>>([])
      const [linkList, setLinkList] = useState<Array<string>>([])
      render(
        <FileControl
          server={''}
          fileList={fileList}
          setFileList={setFileList}
          linkList={linkList}
          setLinkList={setLinkList}
        ></FileControl>
      )
      const linkbox = screen.getByRole('textbox', { name: 'Link input box' })
      const btn = screen.getByRole('button', { name: 'Submit button' })
      userEvent.type(linkbox, 'asdqwas')
      btn.click()
      // add incorrect link
      expect(screen.getByText(/asdqwas/i)).toNotBeInTheDocument()
      userEvent.type(linkbox, 'a.com')
      btn.click()
      // add correct link
      expect(screen.getByText(/a.com/i)).toBeInTheDocument()
      userEvent.type(linkbox, 'b.com')
      btn.click()
      // add two link
      expect(screen.getByText(/b.com/i)).toBeInTheDocument()
      var del = document.getElementById('del-1')
      del?.click()
      // delete link
      expect(screen.getByText(/b.com/i)).toNotBeInTheDocument()
    }
  })
})
