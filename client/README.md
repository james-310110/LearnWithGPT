# Learn With GPT Frontend

#### Desciprtion

- The web application interface used for LearnWithGPT to provide upload, query and access for the server.
- Here is the [repo](https://github.com/scli-James/LearnWithGPT/tree/main/client 'Go').

## How to run

- Use the `npm install` then `npm run dev` to run the React server.
- Use `npm test` to test the testcases which used for the script and dom.
- Make sure the backend is up or some function is not working.

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

- If the file is not upload success, the list of files still appear file in the upload list, user need to remove it manually.
- The message box show on would be delay, and the first time response maybe will not be shown!

## Test

- main
  - Becasue the function is not very complicated, we just test the button and some display element.
- Mocked
  - We use the `Mock Server Worker` to mock the server to simulate. And since it is only two api, which is easy to implement.

---

Thanks for reading! 😂
