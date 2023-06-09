import json
import re
import os

from main.services import DocumentLoader
from main.utils import get_document_id, has_index, get_collection_id, get_chain_from_documents
from main.models import IndexModel, DocumentModel



def is_youtube_video(url):
    youtube_regex = re.compile(
        r'(https?://)?(www\.)?(youtube|youtu|youtube-nocookie)\.(com|be)/(watch\?v=|embed/|v/|.+\?v=)?([^&=%\?]{11})'
    )
    match = youtube_regex.match(url)
    return bool(match)

# calls DocumentLoader() from Services.py
doc_loader = DocumentLoader()

# asks chat questions with data
def _ask_gpt(question,web_list,file_list,collections,by_whom):
    doc_ids = []
    for web_item in web_list:
        web_url = web_item["name"]
        at_when = str(web_item["time"])
        # at_when = "0"
        doc_id = get_document_id(web_url, by_whom, at_when)
        if not has_index(doc_id):
            # exception handling when llamaindex fails to parse link (sometimes there's issue to get transcripts)
            try:
                doc_loader.load_web(web_url, by_whom, at_when)
            except:
                raise ValueError("parse link error:"+web_url)
            # id from database
            doc_id = get_document_id(web_url, by_whom, at_when)
        doc_ids.append(doc_id)
    for file_item in file_list:
        file_name = file_item["name"]
        # time when file is uploaded
        at_when = str(file_item["time"])
        # at_when = "0"
        doc_id = get_document_id(file_name, by_whom, at_when)
        if not has_index(doc_id):
            print("file not exist:",file_name)
            raise ValueError("file not exist:"+file_name)
        doc_ids.append(doc_id)
    # id for chat gpt
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

# returns responses in markdown format when it's not json format
def _build_markdown_result(title,data):
    return {"type": "markdown", "title": title, "data": {"markdown":data}}

# error handling: when json format cannot be obtained, response will be converted to markdown format
def _build_json_result(title,str_data):
    try:
        data = json.loads(str_data.strip().replace("\n", ""))
        data["id"] = title.split("=")[1]
        # data contains returned json response for front-end video player and timestamp format
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
    names = [file["name"] for file in file_list]
    question = "Based on everything you learned, analyze files: " + ' '.join(names) + "， compare themes, identify top 3 ideas, pose 3 questions. Generate markdown-formatted answer within 600 words."
    title = "file_list_summary"
    web_list = []
    data = _ask_gpt(question,web_list,file_list,collections,by_whom)
    return _build_markdown_result(title,data)

def summary_youtube_links(web_list,collections,by_whom):
    abouts = []
    for web_item in web_list:
        web_url = web_item["name"]
        at_when = str(web_item["time"])
        doc_id = get_document_id(web_url, by_whom, at_when)
        if not has_index(doc_id):
            doc_loader.load_web(web_url, by_whom, at_when)
        index = IndexModel.get_index(doc_id)
        about_q = "generate a name that unambiguously communicates what the document does, together with the type of the document"
        about = str(index.query(about_q))
        abouts.append(about)
    question = "Based on everything you learned, analyze video transcripts: " + ' '.join(abouts) + "， compare themes, identify top 3 ideas, pose 3 questions. Generate markdown-formatted answer within 150 words."
    title = "web_link_summary"
    file_list = []
    data = _ask_gpt(question, web_list, file_list, collections, by_whom)
    return _build_markdown_result(title,data)

# {"name":"https://www.youtube.com/watch?v=gd5spdd0Y1s","time":1683209667233,"uid":"none"}

# uses Llamaindex to get video transcript data
# sends chat a question via llangchain in services.py, and chat returns a response
def summary_youtube_link(web_item,collections,by_whom):
    web_url = web_item["name"]
    at_when = str(web_item["time"])
    doc_id = get_document_id(web_url, by_whom, at_when)
    if not has_index(doc_id):
        doc_loader.load_web(web_url, by_whom, at_when)
    index = IndexModel.get_index(doc_id)
    about_q = "generate a name that unambiguously communicates what the document does, together with the type of the document"
    about = str(index.query(about_q))
    print(f'url: {web_url}, about: {about}')

    question = """Generate a pure json result for the video  """ + about + """ in this sample format: {"id": "youtubeid","timeline": [{"time": "important timestamp in the format MM:SS","text": "what the video is doing at the timestamp"}]}, which gives the timeline of the entire youtube video into several important timestamps and summarize what the video is doing at the corresponding timestamp and make it more concise. Return only the json, no other words. Start response with "{", end with "}" """
    file_list = []
    web_list = [web_item]
    data = _ask_gpt(question, web_list, file_list, collections, by_whom)
    return _build_json_result(web_url, data)

# {"name":"proj3 (1).pdf","time":1683211747954,"uid":"rc-upload-1683209876401-2","status":"done","percent":100}
def summary_file(file_item,collections,by_whom,file_list):
    title = file_item["name"]
    question = "summarize the content of the file " + title + " and generate markdown-formatted answer within 150 words and propose 2 follow-up questions."
    # file_list = [file_item]
    web_list = []
    data = _ask_gpt(question, web_list, file_list, collections, by_whom)
    return _build_markdown_result(title, data)

# wraps all responses in front-end required format: data: .... result: ...
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
    # when there's only 1 youtube url
    if (
        len(file_list) == 0
        and len(web_list) == 1
        and "youtube" in web_list[0]["name"]
    ):
        # gets the url
        web_item = web_list[0]
        #
        result = summary_youtube_link(web_item,collections,by_whom)
        print("summary_youtube_link result:",result)
        return _build_success_json_response([result,])

    if (
        len(file_list) == 1
        and len(web_list) == 0
    ):
        response = {}
        file_item = file_list[0]
        result = summary_file(file_item,collections,by_whom, file_list)
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
            summary =  summary_file(file_item, collections, by_whom, file_list)
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
        summary = summary_file(file_item, collections, by_whom, file_list)
        # data[summary["title"]] = summary
        data.append(summary)
    return _build_success_json_response(data)
