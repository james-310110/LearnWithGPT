# import os
# from multiprocessing import Lock
# from multiprocessing.managers import BaseManager
# import sys
# import json
# from pathlib import Path
# from llama_index import download_loader, GPTSimpleVectorIndex


# # loading openai api key from json file beforeAll
# with open("../keys_and_tokens.json", "r") as f:
#     data = json.load(f)
#     openai_api_key = data.get("openai-api-key")
#     if openai_api_key:
#         os.environ["OPENAI_API_KEY"] = openai_api_key
#     else:
#         print("openai_api_key not found in JSON file")

# index = None
# lock = Lock()


# def initialize_index():
#     global index
#     with lock:
#         if os.path.exists(index_name):
#             index = GPTSimpleVectorIndex.load_from_disk(index_name)
#         else:
#             documents = SimpleDirectoryReader("./documents").load_data()
#             index = GPTSimpleVectorIndex.from_documents(documents)
#             index.save_to_disk(index_name)


# if __name__ == "__main__":
#     # init the global index
#     initialize_index()

#     # setup server
#     manager = BaseManager(("localhost", 5000), b"password")
#     manager.register("query", query_index)
#     server = manager.get_server()
#     print("starting server...")
#     server.serve_forever()
