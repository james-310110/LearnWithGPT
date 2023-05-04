New Updates:

1. how to use

   1. run `python manage.py migrate --run-syncdb` and `python manage.py makemigrations && python manage.py migrate` to adapt to new models
   2. use `answer = agent_chain.run(input=question)` to get answer

2. design updates
   1. abandoned DocumentModel and CollectionModel and migrated to IndexModel
   2. incorporated langchain and llamaindex:
      1. each document is now stored as an instance of IndexModel, and later retrieved and used to build tools for chain_agent from langchain to use
      2. langchain will select which tool (hence which document) to use instead of traversing an index that's built on top of all documents, thereby decreasing the noise from irrelevant documents and decreasing the total token usage from openai
      3. langchain will use llamaindex to store chat history as memory, thereby overcoming the limitation on token limit and allowing infinite memory
      4.
3. things to bear in mind:

   1. the concept of collection is still used, but it's now maps colxn_id and agent_chain
   2. checkout [this link](https://python.langchain.com/en/latest/modules/chains/generic/serialization.html) for how to store and retrieve agent_chain in CollectionModel
   3. checkout [prompt templates](https://python.langchain.com/en/latest/modules/prompts/prompt_templates/getting_started.html) and [summarization chains](https://python.langchain.com/en/latest/modules/chains/index_examples/summarize.html) for how to summarize with custom summary prompts

4. `conda env create -f environment.yml`
5. `pip install "unstructured[local-inference]"`
6. `brew install libxml2`
7. `brew install libxslt`
8. `brew install libmagic-dev`
9. `brew install poppler-qt5`
10. `brew install tesseract-ocr`
11. `brew install libreoffice`
12. `brew install pandocs`
13. `pip install "detectron2@git+https://github.com/facebookresearch/detectron2.git@e2ce8dc#egg=detectron2"`
14. `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`
15. `conda activate learn-with-gpt`
16. Run the server `python manage.py runserver`
17. go to http://127.0.0.1:8000/{endpoint}
18. try something like `http://127.0.0.1:8000/getdata?data={%22filelist%22:%20[%22fa%22,%20%22fb%22],%20%22linklist%22:%20[%22.com%22,%20%22.edu%22],%20%22query%22:%20%22qqq%22,%20%22format%22:%20%22html%22}`
19. For testing, `python manage.py test --verbosity=1`
20. `main/testdata`: files for testing; `main/urls.py`: define endpoint; `main/views.py`: define endpoint handlers; `main/tests.py`: testing endpoints
21. each time model changed `python manage.py makemigrations && python manage.py migrate` (try delete `/migrate` and run `python manage.py migrate --run-syncdb` instead when just first building the env)
