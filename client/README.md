# cs32 Map Frontend

#### Desciprtion

- The web application interface work with MapBox, using the backend to filter the GeoJson, and provide some helpful interaction.
- Here is the [repo](https://github.com/cs0320-s2023/sprint-5-mke2-ylu168/tree/master/map-frontend "Go").

## How to run

- Use the `npm run dev` to run the React server.
- Use `npm test` to test the testcases which used for the script and dom.
- Make sure the backend is up or some function is not working.

## Design

- HTML & CSS

  - Based on gear up echo to redesign, use [bootstrap V5](https://getbootstrap.com/docs/5.2/getting-started/introduction/ "Go") to make the page pretty and user-friendly.

- TypeScript & React

  - Use the React to return the function as component.
  - Import `MapBox` to use the map as main function.
  - Use `useState` and `useEffect` to track the attribute and rerender the page.
  - Since it is return the `.tsx` function, we can just write the function with html element which is making it simple.

- Accessibility

  - Provide the aria-lable to make the screen reader to identify the content.
  - Use `%` to make the element fit the screent.

- Improvement

  - Provide Pin remove function for user.
  - Using Pop up window to alert the error.
  - Autofill the latitude and longitude by mouse clicking for user.

## Error

When run the test, since there is a bug the react hook refer each other to make heap out of memory, you may need to comment out the `handleSubmit()` and `handleConfirm()` before run test, or your machine will stuck there.

## Test

- main
  - Becasue the MapBox is not avalibale for testing, we only test the input and output element to make sure it works.
- Mocked
  - Since at the very begining the web is using the GeoJson data to display, it is not need to mocked.

---

Thanks for reading! 😂
