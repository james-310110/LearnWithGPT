from django.shortcuts import render
from django.http import HttpResponse, HttpRequest, JsonResponse
from main.models import DocumentModel
from main.services import DocumentLoader
from main.utils import *
from datetime import datetime
from llama_index import Document, GPTSimpleVectorIndex
import json
import os

# loading openai api key from json file beforeAll
with open("keys_and_tokens.json", "r") as f:
    data = json.load(f)
    openai_api_key = data.get("openai-api-key")
    if openai_api_key:
        os.environ["OPENAI_API_KEY"] = openai_api_key
    else:
        print("openai_api_key not found in JSON file")

doc_loader = DocumentLoader()


def get_data(request: HttpRequest):
    question_str = request.GET.get("question")
    if question_str is None:
        return JsonResponse(
            {"result": "error_bad_request", "data": "missing field [data]"}
        )
    # TODO swap with user_id later
    by_whom = request.session.session_key
    file_list = request.GET.get("file_list")
    url_list = request.GET.get("url_list")
    uids = []
    # check if each file matches nodes from db
    for file_name, at_when in file_list:
        uid = get_document_id(file_name, by_whom, at_when)
        if not has_nodes(uid):
            print("file not exist")
            continue
        uids.append(uid)
    # check if each url matches nodes from db
    for url, at_when in url_list:
        uid = get_document_id(url, by_whom, at_when)
        if not has_nodes(uid):
            doc_loader.load_web(url, by_whom, at_when)
        uids.append(uid)
    index_id = get_collection_id(uids)
    # check if collection matching all nodes from request exists in db
    if not has_index(index_id):
        nodes = [node for uid in uids for node in get_nodes(uid)]
        set_index(index_id, nodes)
    index = get_index(uid)
    answer = index.query(question_str, mode="default")

    response = {}
    response["request"] = json.loads(question_str)
    response["session_id"] = request.session.session_key
    response["result"] = "success"
    response["answer"] = answer
    print(response)
    return JsonResponse(response)


def post_data(request: HttpRequest):
    print("post received")
    input_file = request.FILES.get("file")
    # TODO swap with user_id later
    # by_whom = request.session.session_key
    by_whom = "test_session_key"
    at_when = request.POST.get("upload_time")
    if input_file is None:
        return JsonResponse({"result": "error_bad_request", "data": "missing file"})
    print("loading file")
    doc_loader.load_file(input_file, by_whom, at_when)
    print("file loaded")
    # # For testing, read the file in the post data and write to the disk
    # output_name = "output_" + input_file.name
    # with open(f"main/testdata/{output_name}", "wb+") as destination:
    #     print(
    #         "POST request detail: session_id: {}, file_type: {}, file_name:{}, file_size:{}".format(
    #             request.session.session_key,
    #             input_file.content_type,
    #             input_file.name,
    #             input_file.size,
    #         )
    #     )
    #     for chunk in request.FILES["file"].chunks():
    #         destination.write(chunk)
    return JsonResponse({"result": "success"})
