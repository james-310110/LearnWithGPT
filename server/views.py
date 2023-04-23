from django.shortcuts import render
from django.http import HttpResponse, HttpRequest, JsonResponse
import json

def get_data(request: HttpRequest):
    query_str = request.GET.get("data")
    if query_str is None:
        return JsonResponse({"result": "error_bad_request", "data": "missing field [data]"})
    # TODO: [clarify] how to get format, prompt, fileNames and linkUrls
    # TODO: pseudocode -> python
    # check if prompt is valid or not empty
    # if not, propogate to front end and request correct prompt
    # if so, continue
    # check if files and urls are valid
    # if not, propogate to front end and request correct files and urls
    # if so, continue
    # check if files and urls have corresponding embedding
    # if not, build the embedding and index and continue
    # if so, query the index with the correct prompt and return the result
    response = {}
    response["request"] = json.loads(query_str)
    response["session_id"] = request.session.session_key
    response["result"] = "success"
    return JsonResponse(response)

def post_data(request: HttpRequest):
    # TODO: [clarify] how to get multiple files and links
    # TODO: [clarify] what response to send to front end when files or links are successfully processed
    # TODO: pseudocode -> python
    # check if files and links are valid
    # catch any errors and propogate to front end
    # if no errors/exceptions, store the files and links in memory to be fetched in get_data()
    if request.method == 'POST':
        file = request.FILES.get('file')          
        if file is None:
            return JsonResponse({"result": "error_bad_request", "data": "missing file"})
        # For testing, read the file in the post data and write to the disk
        output_name = "output_" + file.name
        with open(f'main/testdata/{output_name}', 'wb+') as destination:
            print(
                'POST request detail: session_id: {}, file_type: {}, file_name:{}, file_size:{}'.format(request.session.session_key, file.content_type, file.name, file.size))
            for chunk in request.FILES['file'].chunks():
                destination.write(chunk)
    return JsonResponse({"result": "success"})