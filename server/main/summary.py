import json
import re
import os

from main.services import DocumentLoader
from main.utils import get_document_id, has_index, get_collection_id, get_chain_from_documents


def is_youtube_video(url):
    youtube_regex = re.compile(
        r'(https?://)?(www\.)?(youtube|youtu|youtube-nocookie)\.(com|be)/(watch\?v=|embed/|v/|.+\?v=)?([^&=%\?]{11})'
    )
    match = youtube_regex.match(url)
    return bool(match)

# # Test the function with sample URLs
# urls = [
#     "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
#     "https://youtu.be/dQw4w9WgXcQ",
#     "https://www.example.com/some-page"
# ]
#
# for url in urls:
#     print(f"{url}: {is_youtube_video(url)}")

doc_loader = DocumentLoader()

def _ask_gpt(question,web_list,file_list,collections,by_whom):
    doc_ids = []
    for web_item in web_list:
        web_url = web_item["name"]
        at_when = str(web_item["time"])
        doc_id = get_document_id(web_url, by_whom, at_when)
        if not has_index(doc_id):
            doc_loader.load_web(web_url, by_whom, at_when)
            doc_id = get_document_id(web_url, by_whom, at_when)
        doc_ids.append(doc_id)
    for file_item in file_list:
        file_name = file_item["name"]
        at_when = str(file_item["time"])
        doc_id = get_document_id(file_name, by_whom, at_when)
        if not has_index(doc_id):
            print("file not exist:",file_name)
            # raise ValueError("file not exist")
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
    answer = agent_chain.run(input=question)
    print(f"question: {question}, answer: {answer}")
    return answer

def _build_markdown_result(title,data):
    return {"type": "markdown", "title": title, "data": {"markdown":data}}

def _build_json_result(title,str_data):
    try:
        data = json.loads(str_data.strip().replace("\n", ""))
        if data["id"] == "youtubeid":
            data["id"] = title.split("=")[1]
        return {"type":"video_json","title":title,"data":data}
    except Exception as e:
        print(e)
        return _build_markdown_result(title,str_data)

# web_list is not empty and file_list is not empty
def summary_youtube_links_and_files(web_list,file_list,collections,by_whom):
    question = "Generate summary of each documents and videos in markdown-formatted. Each paragraph is within 100 words."
    title = "all"
    data = _ask_gpt(question,web_list,file_list,collections,by_whom)
    return _build_markdown_result(title,data)

def summary_files(file_list,collections,by_whom):
    question = "Based on everything you learned, analyze files, compare themes, identify top 3 ideas, pose 3 questions. Generate markdown-formatted answer within 150 words."
    title = "file_list_summary"
    web_list = []
    data = _ask_gpt(question,web_list,file_list,collections,by_whom)
    return _build_markdown_result(title,data)

def summary_youtube_links(web_list,collections,by_whom):
    question = "Based on everything you learned, analyze video transcripts, compare themes, identify top 3 ideas, pose 3 questions. Generate markdown-formatted answer within 150 words."
    title = "web_link_summary"
    file_list = []
    data = _ask_gpt(question, web_list, file_list, collections, by_whom)
    return _build_markdown_result(title,data)

# {"name":"https://www.youtube.com/watch?v=gd5spdd0Y1s","time":1683209667233,"uid":"none"}
def summary_youtube_link(web_item,collections,by_whom):
    question = """summarize this video with timestamp and make it more concise,generate a json-formatted result, and give me only json format result,json format is {"id": "youtubeid","timeline": [{"time": "00:10","text": "balabala"},{"time": "00:20","text": "balabala"}]}, After summarizing, make answer more concise within 300 words."""
    title = web_item["name"]
    file_list = []
    web_list = [web_item]
    data = _ask_gpt(question, web_list, file_list, collections, by_whom)
    return _build_json_result(title, data)

# {"name":"proj3 (1).pdf","time":1683211747954,"uid":"rc-upload-1683209876401-2","status":"done","percent":100}
def summary_file(file_item,collections,by_whom):
    question = "Based on files, summarize content and generate markdown-formatted answer within 150 words and propose 2 follow-up questions."
    title = file_item["name"]
    file_list = [file_item]
    web_list = []
    data = _ask_gpt(question, web_list, file_list, collections, by_whom)
    return _build_markdown_result(title, data)

def _build_success_json_response(data):
    response = {}
    response["data"] = data
    response["result"] = "success"
    return response

# "fileList":[{"name":"proj3 (1).pdf","time":1683211747954,"uid":"rc-upload-1683209876401-2","status":"done","percent":100}],
# linkList":[{"name":"https://www.youtube.com/watch?v=gd5spdd0Y1s","time":1683209667233,"uid":"none"}]
def summary_helper(web_list,file_list,collections,by_whom):
    print("param web_list:",web_list)
    print("param file_list:" , file_list)
    print("param by_whom:" , by_whom)
    if (
        len(file_list) == 0
        and len(web_list) == 1
        and "youtube" in web_list[0]["name"]
    ):
        web_item = web_list[0]
        result = summary_youtube_link(web_item,collections,by_whom)
        print("summary_youtube_link result:",result)
        return _build_success_json_response([result,])

    if (
        len(file_list) == 1
        and len(web_list) == 0
    ):
        response = {}
        file_item = file_list[0]
        result = summary_file(file_item,collections,by_whom)
        print("summary_file result:",result)
        return _build_success_json_response([result,])

    if (
            len(file_list) == 0
            and len(web_list) > 1
    ):
        total_summary = summary_youtube_links(web_list, collections, by_whom)
        # data =  {
        #     total_summary["title"] : total_summary
        # }
        data = [
            total_summary,
        ]
        for web_item in web_list:
            summary = summary_youtube_link(web_item, collections, by_whom)
            # data[ summary["title"] ] = summary
            data.append(summary)

        return _build_success_json_response(data)

    if (
            len(file_list) > 1
            and len(web_list) == 0
    ):
        total_summary = summary_files(file_list, collections, by_whom)
        # data = {
        #     total_summary["title"]: total_summary
        # }
        data = [
            total_summary,
        ]
        for file_item in file_list:
            summary =  summary_file(file_item, collections, by_whom)
            # data[ summary["title"] ] = summary
            data.append(summary)
        return _build_success_json_response(data)

    total_summary = summary_youtube_links_and_files(web_list,file_list, collections, by_whom)
    # data = {
    #     total_summary["title"]: total_summary
    # }
    data = [
         total_summary
    ]
    for web_item in web_list:
        summary = summary_youtube_link(web_item, collections, by_whom)
        # data[summary["title"]] = summary
        data.append(summary)
    for file_item in file_list:
        summary = summary_file(file_item, collections, by_whom)
        # data[summary["title"]] = summary
        data.append(summary)
    return _build_success_json_response(data)
