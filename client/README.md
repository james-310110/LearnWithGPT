# Learn With GPT Frontend

#### Desciprtion

- The web application interface used for LearnWithGPT to provide upload, query and access for the server.
- Here is the [repo](https://github.com/scli-James/LearnWithGPT/tree/main/client 'Go').

## How to run

- Use the `npm install` then `npm run dev` to run the React server.
- Use `npm test` to test the testcases which used for the script and dom.
- Make sure the backend is up or some function is not working.

## More format interface

- If you want to add more return format for user, we have provide the interface for you.
- Add your new data format in `interface/DataWrap.tsx/DataElement` and implement proper check function.
- After you add your format style `.tsx` file, add it into the `components/ListItem.tsx` as HTML element to make it work.

## Design

- HTML & CSS

  - Based on REPL to redesign, use [bootstrap V5](https://getbootstrap.com/docs/5.2/getting-started/introduction/ 'Go') and [ant design](https://ant.design/docs/react/introduce) to make the page pretty and user-friendly.

- TypeScript & React

  - Use the React to return the function as component.
  - Import `file` upload to allow user upload the file and link.
  - Use `useState` and `useEffect` to track the attribute and rerender the page.
  - Since it is return the `.tsx` function, we can just write the function with html element which is making it simple.

- Accessibility

  - Provide the aria-lable to make the screen reader to identify the content.
  - Use `%` and `media` to make the element fit the screent.
  - Dark mode support.

- Improvement

  - Use more pretty components to make the frontend user-friendly and beautiful, like the color, shape.
  - Provide more format for user to choose and the response could be interactive.
  - Make the response box for history to be more interesting and structural.

## Error

- The message box show on would be delay, and the first time response maybe will not be shown!
- If the server is not up, the web will not show the response of file upload.

## Test

- main
  - Becasue the function is not very complicated, we just test the button and some display element.
- Mocked
  - We use the `Mock Server Worker` to mock the server to simulate. And since it is only two api, which is easy to implement.

---

Thanks for reading! 😂
