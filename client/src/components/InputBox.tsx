import { Select, UploadFile } from "antd";
import { useEffect, useState } from "react";
import { T } from "vitest/dist/types-94cfe4b4";
import { isErrorResponse, isSuccessResponse } from "../interface/Response";

interface InputBoxProps {
  // fileList: UploadFile<T>[];
  fileList: string[];
  linkList: string[];
}

// Choose to run depend on which server!

const server = "http://localhost:8000/";
// const server = "http://mock/";

export default function InputBox(props: InputBoxProps) {
  const [textBox, setTextBox] = useState<string>("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [count, setCount] = useState<number>(0);
  const [format, setFormat] = useState<string>("paragraph");

  /**
   * Handles the submit button being clicked or the enter key being pressed!
   * You may want to make this function more sophisticated to add real
   * command logic, but for now it just adds the text to the history box.
   */
  function handleSubmit() {
    if (textBox.length != 0) {
      const command = textBox;
      setCommandHistory([...commandHistory, command]);
      setCount(commandHistory.length);
      setTextBox("");
      let json = JSON.stringify({
        fileList: props.fileList,
        linkList: props.linkList,
        format: format,
        prompt: textBox,
      });
      const data = getData(json);
    }
  }

  /**
   * Use up arrow to go to last command
   */
  function up(): void {
    if (count < 0) {
      setCount(0);
      return;
    }
    setTextBox(commandHistory[count]);
    setCount((e) => e - 1);
  }

  /**
   * Use down arrow to go to next command
   */
  function down(): void {
    if (count >= commandHistory.length - 1) {
      setCount(commandHistory.length);
      return;
    }

    if (count <= commandHistory.length) setTextBox(commandHistory[count + 1]);
    setCount((e) => e + 1);
  }

  return (
    <div className="repl-input p-3 d-flex align-items-center">
      <input
        aria-label={"Prompt input box"}
        placeholder="Prompt Here!"
        type="text"
        className="repl-command-box p-2"
        onChange={(e) => setTextBox(e.target.value)}
        value={textBox}
        onKeyUp={(e) => {
          if (e.key == "Enter") handleSubmit();
          if (e.keyCode == 38) up();
          if (e.keyCode == 40) down();
        }}
      />
      <div className="d-flex flex-wrap align-content-around ms-4 align-items-start">
        <button
          className="repl-button p-2 m-1 btn btn-primary"
          onClick={() => handleSubmit()}
          aria-label={"Submit button"}
        >
          Submit
        </button>
        <Select
          placeholder="Format"
          style={{ width: 120 }}
          onChange={(e) => setFormat(e)}
          options={[
            { value: "paragraph", label: "Paragraph" },
            { value: "tree", label: "Tree" },
            { value: "time", label: "Timeline" },
          ]}
        />
      </div>
    </div>
  );
}

/**
 * handle to show the table, prepare for backend
 */
async function getData(args: string): Promise<string> {
  const data = await getResponse(`${server}getdata?data=${args}`);
  const json = await data.json();
  console.log(json);
  if (isSuccessResponse(json)) {
    return json.data;
  } else if (isErrorResponse(json)) {
    return json.data;
  } else {
    return "Error: server not response correctly.";
  }
}

/**
 * wrapper for fetch url
 * @param url url to fetch
 * @returns Promise
 */
async function getResponse(url: string): Promise<Response> {
  return await fetch(url).catch(() => {
    return new Response(
      JSON.stringify({
        result: "Serer error",
        msg: "Access server failed.",
        data: [],
      })
    );
  });
}

/**
 * use given classname to loop the element and use given function to do with each element
 *
 * @param className the classname of element
 * @param fun the function that the element need to do
 */
function findElementToDo(className: string, fun: (e: HTMLElement) => any) {
  const elements: HTMLCollectionOf<Element> =
    document.getElementsByClassName(className);
  if (elements == null) return;
  for (var i = 0; i < elements.length; i++) {
    var element = elements.item(i);
    if (element == null) {
      console.log("Couldn't find input element");
    } else if (!(element instanceof HTMLElement)) {
      console.log(`Found element ${element}, but it wasn't a p`);
    } else {
      fun(element);
    }
  }
}
