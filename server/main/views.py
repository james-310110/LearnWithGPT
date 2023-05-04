from collections import defaultdict
from django.shortcuts import render
from django.http import HttpResponse, HttpRequest, JsonResponse
from main.services import DocumentLoader
from langchain.chains import load_chain
from langchain import OpenAI
from langchain.llms import OpenAIChat
from langchain.agents import Tool, initialize_agent
from langchain.chains.conversation.memory import ConversationBufferMemory

from llama_index import GPTListIndex
from llama_index.langchain_helpers.memory_wrapper import GPTIndexChatMemory
from main.utils import *
import json
import os
import json

# loading openai api key from json file beforeAll
with open("keys_and_tokens.json", "r") as f:
    data = json.load(f)
    openai_api_key = data.get("openai-api-key")
    if openai_api_key:
        os.environ["OPENAI_API_KEY"] = openai_api_key
    else:
        print("openai_api_key not found in JSON file")

doc_loader = DocumentLoader()

# TODO should be stored and loaded from db
collections = defaultdict(object)

# memory_index = GPTIndexChatMemory(
#     index=GPTListIndex([]),
#     memory_key="chat_history",
#     query_kwargs={"response_mode": "compact"},
#     return_source=True,
#     return_messages=True,
# )
# agent_chain = initialize_agent(
#     tools=[],
#     llm=OpenAIChat(temperature=0),
#     agent="conversational-react-description",
#     memory=memory_index,
# )

agent_chain = get_chain_from_documents([])


def get_data(request: HttpRequest):
    query_str = request.GET.get("data")
    if query_str is None:
        return JsonResponse(
            {"result": "error_bad_request", "data": "missing field [data]"}
        )
    print(query_str)
    query_dict = json.loads(query_str)
    # TODO swap with session_id or user_id later
    by_whom = "test_session_key"
    # by_whom = request.session.session_key
    file_list = query_dict["fileList"]
    web_list = query_dict["linkList"]
    answer_format = query_dict["format"]
    question = ""
    if answer_format != "summary":
        question = query_dict["prompt"]
    print(web_list)
    
    doc_ids = []
    # check if each file matches nodes from db
    for file_item in file_list:
        file_name = file_item["name"]
        at_when = str(file_item["time"])
        doc_id = get_document_id(file_name, by_whom, at_when)
        if not has_index(doc_id):
            print("file not exist")
            continue
        doc_ids.append(doc_id)
    # check if each url matches nodes from db
    for web_item in web_list:
        web_url = web_item["name"]
        at_when = str(web_item["time"])
        doc_id = get_document_id(web_url, by_whom, at_when)
        if not has_index(doc_id):
            doc_loader.load_web(web_url, by_whom, at_when)
        doc_ids.append(doc_id)
    colxn_id = get_collection_id(doc_ids)
    # setting/getting agent_chain to query 
    if colxn_id in collections.keys():
        print("collection already exists")
        agent_chain = collections.get(colxn_id)
    else:
        print("collection not exists")
        agent_chain = get_chain_from_documents(doc_ids)
        collections[colxn_id] = agent_chain
    if (
        answer_format == "summary"
        and len(web_list) == 1
        and "youtube" in web_list[0]["name"]
    ):
        question = """summarize this video with timestamp and make it more concise,generate a json-formatted,json format is {"id": "youtubeid","timeline": [{"time": "00:10","text": "balabala"},{"time": "00:20","text": "balabala"}]}"""
    if answer_format == "paragraph":
        question = "generate a markdown-formatted answer for this question: " + question
        print(question)
        
    # querying answer from agent_chain
    answer = agent_chain.run(input=question)
    # answer = index.query(question, mode="default")
    print(f"question: {question}, answer: {answer}")
    response = {}
    response["result"] = "success"
    response["data"] = {}
    
    if (
        answer_format == "summary"
        and len(web_list) == 1
        and "youtube" in web_list[0]["name"]
    ):
        print("answer.response:", answer)
        response["data"] = json.loads(answer.replace("\n", ""))
    else:
        response["data"]["markdown"] = answer
    print(response)

    return JsonResponse(response)


def post_data(request: HttpRequest):
    input_file = request.FILES.get("file")
    # TODO swap with session_id or user_id later
    by_whom = (
        "test_session_key"
        if request.session.session_key is None
        else request.session.session_key
    )
    # by_whom = request.session.session_key
    at_when = request.GET.get("upload_time")
    if input_file is None:
        return JsonResponse({"result": "error_bad_request", "data": "missing file"})
    doc_loader.load_file(input_file, by_whom, at_when)
    return JsonResponse({"result": "success"})
