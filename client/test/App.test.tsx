import { useState } from 'react'
import { act, render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import InputBox from '../src/components/InputBox'
import userEvent from '@testing-library/user-event'
import FileControl from '../src/components/FileControl'
import { DataWrap } from '../src/interface/DataWrap'
import HistoryBox from '../src/components/HistoryBox'
import App from '../src/App'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import Pair from '../src/interface/Pair'

describe('Element load test', () => {
  test('display the file control'),
    async () => {
      const [fileList, setFileList] = useState<Array<Pair>>([])
      const [linkList, setLinkList] = useState<Array<Pair>>([])
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
      expect(
        screen.getByText(/Click or drag file to this area to upload/i)
      ).toBeInTheDocument()
    }

  test('display the repl', async () => {
    ;async () => {
      const [fileList, setFileList] = useState<Array<Pair>>([])
      const [linkList, setLinkList] = useState<Array<Pair>>([])
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
      const [fileList, setFileList] = useState<Array<Pair>>([])
      const [linkList, setLinkList] = useState<Array<Pair>>([])
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
      var del = document.getElementById('dellink-1')
      del?.click()
      // delete link
      expect(screen.getByText(/b.com/i)).toNotBeInTheDocument()
    }
  })

  test('displays prompt', async () => {
    ;async () => {
      const [fileList, setFileList] = useState<Array<Pair>>([])
      const [linkList, setLinkList] = useState<Array<Pair>>([])
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
      const prompt = screen.getByRole('textbox', { name: 'Prompt input box' })
      const btn = screen.getByRole('button', { name: 'Prompt button' })
      userEvent.type(prompt, 'asdqwas')
      btn.click()
      // submit no response
      expect(screen.getByText(/asdqwas/i)).toNotBeInTheDocument()
      userEvent.type(prompt, 'a.com')
      btn.click()
      // submit loading
      expect(screen.getByText(/loading/i)).toBeInTheDocument()
    }
  })
})

describe('Mock server upload', () => {
  const server = setupServer(
    rest.post('http://mock/postdata', async (req: any, res: any, ctx: any) => {
      const { file } = await req.json()
      return res(ctx.json({ result: 'success', data: 'File Upload!' }))
    })
  )

  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  test('success response upload', async () => {
    ;async () => {
      const [fileList, setFileList] = useState<Array<Pair>>([])
      const [linkList, setLinkList] = useState<Array<Pair>>([])
      render(
        <FileControl
          server={''}
          fileList={fileList}
          setFileList={setFileList}
          linkList={linkList}
          setLinkList={setLinkList}
        ></FileControl>
      )
      const fakeFile = new File(['hello'], 'hello.png', { type: 'image/png' })
      const uploadbox = document.getElementById('inputFile')
      if (uploadbox !== null) {
        await act(async () => {
          await waitFor(() => {
            userEvent.upload(uploadbox, fakeFile)
            userEvent.upload(uploadbox, fakeFile)
            userEvent.upload(uploadbox, fakeFile)
          })
        })
      }
      // add correct file
      expect(screen.getByText(/hello.png/i)).toBeInTheDocument()
      expect(screen.getByText(/h.png/i)).toNotBeInTheDocument()
    }
  })
})

describe('Mock server prompt', () => {
  const server = setupServer(
    rest.get('http://mock/getdata', async (req: any, res: any, ctx: any) => {
      const { filelist, linklist, prompt, format } = await req.json()
      return res(ctx.json({ result: 'success', data: 'Hello World' }))
    })
  )

  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  test('success response upload', async () => {
    ;async () => {
      render(<App></App>)
      const linkbox = screen.getByRole('upload', { name: 'Link input box' })
      const btn = screen.getByRole('button', { name: 'Submit button' })
      // add link
      userEvent.type(linkbox, 'a.com')
      btn.click()
      const prompt = screen.getByRole('textbox', { name: 'Prompt input box' })
      const query = screen.getByRole('button', { name: 'Prompt button' })
      userEvent.type(prompt, 'asdqwas')
      query.click()
      expect(screen.getByText(/Hello World/i)).toBeInTheDocument()
      expect(screen.getByText(/Learn With GPT/i)).toBeInTheDocument()
      expect(screen.getByText(/asdqwas/i)).toBeInTheDocument()
    }
  })
})

describe('Mock server prompt fail', () => {
  const server = setupServer(
    rest.get('http://mock/getdata', async (req: any, res: any, ctx: any) => {
      const { filelist, linklist, prompt, format } = await req.json()
      return res(ctx.json({ result: 'error', data: 'check server' }))
    })
  )

  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  test('success response upload', async () => {
    ;async () => {
      render(<App></App>)
      const linkbox = screen.getByRole('upload', { name: 'Link input box' })
      const btn = screen.getByRole('button', { name: 'Submit button' })
      // add link
      userEvent.type(linkbox, 'a.com')
      btn.click()
      const prompt = screen.getByRole('textbox', { name: 'Prompt input box' })
      const query = screen.getByRole('button', { name: 'Prompt button' })
      userEvent.type(prompt, 'asdqwas')
      query.click()
      expect(screen.getByText(/check server/i)).toBeInTheDocument()
      expect(screen.getByText(/Learn With GPT/i)).toBeInTheDocument()
      expect(screen.getByText(/asdqwas/i)).toNotBeInTheDocument()
    }
  })
})
