# LearnWithGPT README

## Project Name: LearnWithGPT

## Team Members and Division of Labor

- Minghui Ke (mke2): front-end
- James Li (sli64): back-end
- Yiyun Lu (ylu168): back-end + database
- Angela Wang (lwang58): design + back-end

## Tasks/Workload/Timeline

**Total hours:** 200 hrs

**Week 1: Design and Specification, ~52 hrs total**
- User research, 4 hrs
- User stories collection, 2 hrs
- Features collection, 2 hrs
- Wireframing, 4 hrs
- Storyboarding, 3 hrs
- Mockup and Prototyping, 6 hrs
- Front-end component design, 5 hrs
- End-to-end interaction interface, 2 hrs
- Back-end pipeline design, 8 hrs
- API sourcing, 16 hrs

**Week 2+3: Implementation, ~90 hrs total**
- End-to-end interfaces, 4 hrs
- Front-end
  - React component, 12 hrs
  - Rendering and styling, 10 hrs
  - Accessibility, 6 hrs
  - Request packaging, 4 hrs
- Back-end
  - Input parsing APIs, 12 hrs
  - Defensive programming, 4 hrs
  - Multi-threading, 8 hrs
  - Pipeline fine-tuning, 8 hrs
  - Summary & prompt response to JSON & markdown, 8 hrs
  - Prompt engineering, 8 hrs
  - Database management, 8 hrs
  - Response packaging, 4 hrs

**Week 4: Testing and Final Touch, ~40 hrs total**
- Testing Suite
  - Unit Testing, 12 hrs
  - Integration Testing, 12 hrs
  - Mocking, 6 hrs
- Refactoring: organization, denesting, and decoupling, 16 hrs
- Documentation: in-line comment, javadocs, readme, 10 hrs
- Demo Preparation, 4 hrs

## Link to Repository

https://github.com/scli-James/LearnWithGPT.git

## Design Choices

### Back-end:‘Server’ Design Choices

Our backend server's primary function is to process user queries based on a collection of documents, which can include uploaded files of different formats and URLs (including YouTube videos). Our project uses a "chain" of agents with various tools and memory components to generate responses to the queries. The backend is built with Django and can be deployed using either ASGI or WSGI servers, as specified by the entry points in `asgi.py` and `wsgi.py`.

In our most current version:

- We abandoned `DocumentModel` and `CollectionModel` and migrated to `IndexModel` incorporated `langchain` and `llamaindex`.
- Each document is now stored as an instance of `IndexModel`, and later retrieved and used to build tools for `chain_agent` from `langchain` to use.
- `langchain` will select which tool (hence which document) to use instead of traversing an index that's built on top of all documents, thereby decreasing the noise from irrelevant documents and decreasing the total token usage from OpenAI.
- `langchain` will use `llamaindex` to store chat history as memory, thereby overcoming the limitation on token limit and allowing infinite memory.

**Main Functionality and Components:**

- apps.py: defines a Django AppConfig class, `MainConfig`, setting the default configuration for the main app.
- admin.py: imports the Django admin module but not used in the current project.
- exceptions.py: defines a custom FileNotFound exception for handling file not found errors.
- models.py: Django data models, DocumentModel & IndexModel, representing document and index data in the database.
- services.py: includes various services for the project, including DocumentLoader, EmbeddingService, IndexService, and ChainService. DocumentLoader class is responsible for loading and parsing documents, and the other service classes 
- summary.py: contains functions that handle summarization tasks for the “summarize outputs” button. It creates markdown and JSON-formatted results from GPT responses, and builds a specific format of JSON responses so users can view a summary of youtube videos with timestamps while watching the video at the same time on the webpage
- tests.py: contains tests for the API, sets up a Django test class called API_tests that inherit from TestCase. The class tests the post and get functionality of the API.
- urls.py: defines the URL patterns for the main app, with paths for getdata and postdata.
- utils.py: contains utility functions for generating document and collection IDs, initializing a "chain" with an index, getting a "chain" from documents, and interacting with IndexModel and DocumentModel.
- views.py: view functions for the main app, including get_data and post_data which process GET and POST requests, generate responses based on the type of input files and links, and then return the responses
- youtubeWithTime.py: defines a YoutubeTranscriptReader class that inherits from BaseReader, providing functionality for extracting video IDs from YouTube links, loading YouTube transcripts, and returning the transcripts as a list of Document objects.Llama’s youtube reader does not include timestamps, so the class adds timestamps back to the transcript in order for the front-end to display video timestamps to users

**Backend Functionality and Components:**

- configuration files and settings for the Django application. Asgi.py and Wsgi.py allow the application to be deployed with different types of servers
- Asgi.py: entry point for the Asynchronous Server Gateway Interface server.
- Settings.py: settings & configs for Django
- Urls.py: defines URL patterns for the Django application. Includes main.urls module for handling routes, and sets up the Django admin site at /admin path
- Wsgi.py: the entry point for Web Server Gateway Interface server. 

**Things to bear in mind: 

- the concept of collection is still used, but it's now maps colxn_id and agent_chain
- checkout [this link](https://python.langchain.com/en/latest/modules/chains/generic/serialization.html) for how to store and retrieve agent_chain in CollectionModel
- checkout [prompt templates](https://python.langchain.com/en/latest/modules/prompts/prompt_templates/getting_started.html) and [summarization chains](https://python.langchain.com/en/latest/modules/chains/index_examples/summarize.html) for how to summarize with custom summary prompts

### Front-end:‘Client’ Design Choices

- HTML & CSS: 
  - Based on REPL to redesign, use bootstrap V5 and ant design to make the page pretty and user-friendly.
- TypeScript & React: 
  - Use the React to return the function as component.
  - Import file upload to allow user upload the file and link.
  - Use useState and useEffect to track the attribute and rerender the page.
  - Since it is return the .tsx function, we can just write the function with html element which is making it simple.
- Accessibility
  - Provide the aria-lable to make the screen reader to identify the content.
  - Use % and media to make the element fit the screent.
  - Dark mode support.
- Improvement
  - Use more pretty components to make the frontend user-friendly and beautiful, like the color, shape.
  - Provide more format for user to choose and the response could be interactive.
  - Make the response box for history to be more interesting and structural.

### Data structures we used, why we created it, and other high-level explanations
- Python dictionaries for holding file and web content extractors and their corresponding classes. 
- Lists for storing and processing input data and results.
- Deque (from the collections library) for efficiently scraping knowledge base URLs.

**Runtime/ space optimizations we made
- Pipeline engineering to minimize token usage

## Errors/Bugs

### Back-end: 
So far, we don't have any major bugs that prevents the web application from running based on our design. However, we do anticipate discovering more bugs as we expand on testing, improve on existig feature's performance, and account for more edge cases to make our application more user friendly for users. 

### Front-end: 
The message box show on would be delay, and the first time response maybe will not be shown!

## Tests 

### Back-end: 
We currently wrote tests for the main features but we will add more tests before the final demo especially for features later implemented in our project such as the summary button for users to get a summary of their uploads. 

### Front-end: 
- Main: Since the function is not very complicated, we just test the button and some display element.
- Mocked: We use the Mock Server Worker to mock the server to simulate. And since it is only two api, which is easy to implement.

## How to run: 

### Back-end:  

**When it's your first time,follow these: 
1. `conda env create -f environment.yml`
2. `pip install "unstructured[local-inference]"`
3. `brew install libxml2`
4. `brew install libxslt`
5. `brew install libmagic-dev`
6. `brew install poppler-qt5`
7.  `brew install tesseract-ocr`
8.  `brew install libreoffice`
9.  `brew install pandocs`
10. `pip install "detectron2@git+https://github.com/facebookresearch/detectron2.git@e2ce8dc#egg=detectron2"`
11. `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`
12. `conda activate learn-with-gpt`
13. Run the server `python manage.py runserver`
14. go to http://127.0.0.1:8000/{endpoint}
15. try something like `http://127.0.0.1:8000/getdata?data={%22filelist%22:%20[%22fa%22,%20%22fb%22],%20%22linklist%22:%20[%22.com%22,%20%22.edu%22],%20%22query%22:%20%22qqq%22,%20%22format%22:%20%22html%22}`
16. For testing, `python manage.py test --verbosity=1`
17. `main/testdata`: files for testing; `main/urls.py`: define endpoint; `main/views.py`: define endpoint handlers; `main/tests.py`: testing endpoints
18. each time model changed `python manage.py makemigrations && python manage.py migrate` (try delete `/migrate` and run `python manage.py migrate --run-syncdb` instead when just first building the env)

**If it's not your first, follow these to run the program: 
   1. go into the server directory in your project
   2. `conda activate learn-with-gpt`

**If you encounter issues such as "django.db.utils.OperationalError: no such table: main_documentmodel"
   1. `python manage.py migrate --run-syncdb` and `python manage.py makemigrations && python manage.py migrate` to adapt to new models
   2. use `answer = agent_chain.run(input=question)` to get answer

### Front-end: 
1. Use the npm install then npm run dev to run the React server.
2. Use npm test to test the testcases which used for the script and dom.
3. Make sure the backend is up or some function is not working.


### Other Notes: 
1. We plan to implement more security in the future e.g someone uploads a corrupted file 
