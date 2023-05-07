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

### Back-end ‘Server’ Design Choices

Our backend server's primary function is to process user queries based on a collection of documents, which can include uploaded files of different formats and URLs (including YouTube videos). Our project uses a "chain" of agents with various tools and memory components to generate responses to the queries. The backend is built with Django and can be deployed using either ASGI or WSGI servers, as specified by the entry points in `asgi.py` and `wsgi.py`.

In our most current version:

- We abandoned `DocumentModel` and `CollectionModel` and migrated to `IndexModel` incorporated `langchain` and `llamaindex`.
- Each document is now stored as an instance of `IndexModel`, and later retrieved and used to build tools for `chain_agent` from `langchain` to use.
- `langchain` will select which tool (hence which document) to use instead of traversing an index that's built on top of all documents, thereby decreasing the noise from irrelevant documents and decreasing the total token usage from OpenAI.
- `langchain` will use `llamaindex` to store chat history as memory, thereby overcoming the limitation on token limit and allowing infinite memory.

***Main Functionality and Components:**

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

***Backend Functionality and Components:**

- configuration files and settings for the Django application. Asgi.py and Wsgi.py allow the application to be deployed with different types of servers
- Asgi.py: entry point for the Asynchronous Server Gateway Interface server.
- Settings.py: settings & configs for Django
- Urls.py: defines URL patterns for the Django application. Includes main.urls module for handling routes, and sets up the Django admin site at /admin path
- Wsgi.py: the entry point for Web Server Gateway Interface server. 




