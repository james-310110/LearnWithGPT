import { useState } from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import InputBox from "../src/components/InputBox";
import MessageBox from "../src/components/MessageBox";
import userEvent from "@testing-library/user-event";
import { Note } from "../src/utils/note";

describe("Element load test", () => {
  test("loads and displays input"),
    async () => {
      const [overlay, setOverlay] = useState<
        GeoJSON.FeatureCollection | undefined
      >(undefined);
      const [message, setMessage] = useState<string>("");
      const [notes, setNotes] = useState<[Note] | []>([]);
      render(
        <InputBox
          setOverlay={setOverlay}
          setMessage={setMessage}
          setNotes={setNotes}
        />
      );
      expect(
        document.getElementsByClassName("inputBox").item(0)
      ).toBeInTheDocument();
      expect(
        screen.getByRole("numberbox", { name: "Min Latitude input box" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("numberbox", { name: "Max Latitude input box" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("numberbox", { name: "Min Longitude input box" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("numberbox", { name: "Max Longitude input box" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Reset button" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Submit button" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("textbox", { name: "Note input box" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("textbox", { name: "Title input box" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Confrim button" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("numberbox", { name: "Longitude input box" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("numberbox", { name: "Latitude input box" })
      ).toBeInTheDocument();
    };

  test("loads and displays message", async () => {
    async () => {
      render(<MessageBox message={"message"} />);
      expect(
        document.getElementsByClassName("messageBox").item(0)
      ).toBeInTheDocument();
    };
  });
});

describe("Element use test", () => {
  test("displays message", async () => {
    async () => {
      const [message, setMessage] = useState<string>("");
      render(<MessageBox message={message} />);
      setMessage("Hello World!");
      expect(screen.getByText(/Hello World!/i)).toBeInTheDocument();
    };
  });

  test("displays reset", async () => {
    async () => {
      const [overlay, setOverlay] = useState<
        GeoJSON.FeatureCollection | undefined
      >(undefined);
      const [message, setMessage] = useState<string>("");
      const [notes, setNotes] = useState<[Note] | []>([]);
      render(
        <div>
          <InputBox
            setOverlay={setOverlay}
            setMessage={setMessage}
            setNotes={setNotes}
          />
          <MessageBox message={message}></MessageBox>
        </div>
      );
      const long = screen.getByRole("numberbox", {
        name: "Max Longitude input box",
      });
      const submit = screen.getByRole("button", { name: "Submit button" });
      const reset = screen.getByRole("button", { name: "Reset button" });
      userEvent.type(long, "asdqwas");
      reset.click();
      expect(long.textContent).toBe("");
      userEvent.type(long, "300"); // exceed range
      submit.click();
      expect(
        screen.getByText(/Please check if your lat or lon input is valid./i)
      ).toNotBeInTheDocument();
    };
  });

  test("displays confirm", async () => {
    async () => {
      const [overlay, setOverlay] = useState<
        GeoJSON.FeatureCollection | undefined
      >(undefined);
      const [message, setMessage] = useState<string>("");
      const [notes, setNotes] = useState<[Note] | []>([]);
      render(
        <div>
          <InputBox
            setOverlay={setOverlay}
            setMessage={setMessage}
            setNotes={setNotes}
          />
          <MessageBox message={message}></MessageBox>
        </div>
      );
      const long = screen.getByRole("numberbox", {
        name: "Longitude input box",
      });
      const confirm = screen.getByRole("button", { name: "Confirm button" });
      userEvent.type(long, "300"); // exceed range
      confirm.click();
      expect(
        screen.getByText(/Please check if your lat or lon input is valid./i)
      ).toNotBeInTheDocument();
    };
  });

  test("displays message add", async () => {
    async () => {
      const [overlay, setOverlay] = useState<
        GeoJSON.FeatureCollection | undefined
      >(undefined);
      const [message, setMessage] = useState<string>("");
      const [notes, setNotes] = useState<[Note] | []>([]);
      render(
        <div>
          <InputBox
            setOverlay={setOverlay}
            setMessage={setMessage}
            setNotes={setNotes}
          />
          <MessageBox message={message}></MessageBox>
        </div>
      );
      const long = screen.getByRole("numberbox", {
        name: "Max Longitude input box",
      });
      const reset = screen.getByRole("button", { name: "Reset button" });
      const submit = screen.getByRole("button", { name: "Submit button" });
      const keyword = screen.getByRole("textbox", {
        name: "Keyword input box",
      });
      const confirm = screen.getByRole("button", { name: "Confrim button" });

      userEvent.type(long, "hello");
      userEvent.click(reset);
      long.innerText = "";
      submit.click();
      userEvent.type(keyword, "world");
      confirm.click();
      expect(screen.getByText(/Hello World!/i)).toNotBeInTheDocument();
    };
  });
});
