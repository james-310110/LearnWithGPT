from collections import defaultdict
from django.shortcuts import render
from django.http import HttpResponse, HttpRequest, JsonResponse
from main.services import DocumentLoader
from main.summary import summary_helper
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
    # response = {
    #     "result":"success",
    #   "data":
    #     [
    #         {
    #               "title": "web_link_summary",
    #               "data":{
    #                    "markdown": "aaaaaaaaaa"
    #               }
    #          },
    #         {
    #             "type": "video_json",
    #             "title": "https://www.youtube.com/watch?v=FSCVgmLjjQI",
    #             "data": {
    #                 "id": "FSCVgmLjjQI",
    #                 "timeline": [
    #                     {
    #                         "time": "00:00",
    #                         "text": "When you're in the mood for something sweet and you're looking for something on the lighter side, this peanut butter banana smoothie is for you. It's naturally sweetened with fruit and it reminds me of a milkshake, but it's completely dairy-free and it will leave you feeling satisfied for hours."
    #                     },
    #                     {
    #                         "time": "00:30",
    #                         "text": "To make the smoothie, you'll need a 1/2 cup of milk or water, 1 frozen banana, 2 tablespoons of all-natural peanut butter, 1 tablespoon of ground flax seeds, a 1/2 teaspoon of vanilla extract, and a sweetener if desired. Blend everything together and serve right away for the best taste and texture."
    #                     },
    #                     {
    #                         "time": "00:50",
    #                         "text": "This smoothie really tastes like a healthy dessert, so it's a great way to satisfy your sweet tooth. If you have any leftovers, you can pour the smoothie into an ice pop mold and freeze it overnight for a cold treat later."
    #                     }
    #                 ]
    #             }
    #         }
    #     ]
    #
    # }
    # return JsonResponse(response)

    try: 
        query_str = request.GET.get("data")
        if query_str is None:
            return JsonResponse(
                {"result": "error_bad_request", "data": "missing field [data]"}
            )
        print(query_str)
        query_dict = json.loads(query_str)
        # TODO swap with session_id or user_id later
        by_whom = (
            "test_session_key"
            if request.session.session_key is None
            else request.session.session_key
        )
        print(by_whom)
        # by_whom = request.session.session_key
        file_list = query_dict["fileList"]
        web_list = query_dict["linkList"]
        answer_format = query_dict["format"] 
        if answer_format == "summary":
            response = summary_helper(web_list,file_list, collections, by_whom)
            return JsonResponse(response)
        title = ""
        question = query_dict["prompt"]
        doc_ids = []
        # check if each file matches nodes from db
        for file_item in file_list:
            file_name = file_item["name"]
            title += "\n"+file_name
            at_when = str(file_item["time"])
            # at_when = "0"
            doc_id = get_document_id(file_name, by_whom, at_when)
            if not has_index(doc_id):
                print("file not exist: {}".format(doc_id))
                continue
            doc_ids.append(doc_id)
        # check if each url matches nodes from db
        for web_item in web_list:
            web_url = web_item["name"]
            title += "\n"+web_url
            at_when = str(web_item["time"])
            # at_when = "0"
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
        if answer_format == "paragraph":
            question = "generate a markdown-formatted answer for this question: " + question
            print(question)
        print("question:",question)
        # querying answer from agent_chain
        answer = agent_chain.run(input=question)
        # answer = index.query(question, mode="default")
        print(f"question: {question}, answer: {answer}")
        response = {}
        response["result"] = "success"
        response["data"] = [
            {
                "data":{"markdown":answer},
                "title":title
            }
        ]
        print(response)
        return JsonResponse(response)

    except Exception as e:
        response = {}
        response["result"] = "error_bad_datasource"
        response["data"] = e.__str__()
        return JsonResponse(response)



def post_data(request: HttpRequest):
    try: 
        input_file = request.FILES.get("file")
        # TODO swap with session_id or user_id later
        by_whom = (
            "test_session_key"
            if request.session.session_key is None
            else request.session.session_key
        )
        # by_whom = request.session.session_key
        at_when = request.GET.get("upload_time")
        # at_when = "0"
        if input_file is None:
            return HttpResponse(status=500)
            # return JsonResponse({"result": "error_bad_request", "data": "missing file"})
        if input_file.size > 2 * 1024 * 1024:
            return HttpResponse(status=500)
            # return JsonResponse({"result": "error_bad_request", "data": "file size exceed 2MB"})
        doc_loader.load_file(input_file, by_whom, at_when)
        return JsonResponse({"result": "success"})
    except Exception as e:
        # response = {}
        # response["result"] = "error_bad_request"
        # response["data"] = e.__str__()
        return HttpResponse(status=500)
        # return JsonResponse(response)
