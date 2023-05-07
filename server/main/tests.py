from django.test import TestCase, Client
from django.contrib.sessions.backends.db import SessionStore
# from main.models import DocumentModel, CollectionModel
from main.utils import *

import json


# Create your tests here.


class API_tests(TestCase):
    def setUp(self):
        self.client = Client()

    def test_get_error_handling(self):
        query = {
            "fileList": ["fa", "fb"],
            "linkList": [".com", ".edu"],
            "query": "What is the Tapestry paper about?",
            "format": "paragraph",
        }
        query_jsonstr = json.dumps(query)
        response = self.client.get(f"/getdata?data={query_jsonstr}")
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertEqual(response_data["result"], "error_bad_datasource")
        print("GET test response {}".format(response.json()))

    def test_post_then_get(self):
        # setting parameters
        file_path = "main/testdata/"
        file_name = "test.txt"
        upload_time = "2020-01-01 00:00:00"
        session_key = "test_session_key"  # set it later
        doc_id = get_document_id(file_name, session_key, upload_time)
        # sending post request
        with open(file_path + file_name, "rb") as f:
            post_response = self.client.post(
                f"/postdata?upload_time={upload_time}", {"file": f}
            )
        query = {
            "fileList": [{"name": file_name, "time": upload_time}],
            "linkList": [],
            "format": "paragraph",
            "prompt": "What is this document about?",
        }
        query_jsonstr = json.dumps(query)
        get_response = self.client.get(f"/getdata?data={query_jsonstr}")
        self.assertEqual(post_response.status_code, 200)
        self.assertEqual(get_response.status_code, 200)
        # self.assertTrue(has_nodes(doc_id))
        self.assertTrue(has_index(doc_id))
        response_data = json.loads(get_response.content)
        self.assertEqual(response_data["result"], "success")

    #     response_data = json.loads(get_response.content)
    #     self.assertEqual(response_data["result"], "success")
    #     #self.assertEqual(response_data["question"], query["question"])
    #     #self.assertIn("answer", response_data)
    #     # print(json.loads(get_response))

    def test_post_png(self):
        upload_time = "2020-01-01 00:00:00"
        with open("main/testdata/pcake.png", "rb") as f:
            response = self.client.post(
                f"/postdata?upload_time={upload_time}", {"file": f}
            )
        self.assertEqual(response.status_code, 200)

    def test_post_pdf(self):
        upload_time = "2020-01-01 00:00:00"
        with open("main/testdata/pcake.pdf", "rb") as f:
            response = self.client.post(
                f"/postdata?upload_time={upload_time}", {"file": f}
            )
        self.assertEqual(response.status_code, 200)

    def test_post_docx(self):
        upload_time = "2020-01-01 00:00:00"
        with open("main/testdata/smoo.docx", "rb") as f:
            response = self.client.post(
                f"/postdata?upload_time={upload_time}", {"file": f}
            )
        self.assertEqual(response.status_code, 200)

    # def test_post_nofile(self):
    #     response = self.client.post("/postdata", {"file": "f"})
    #     self.assertEqual(response.status_code, 200)
    #     response_data = json.loads(response.content)
    #     self.assertEqual(response_data["result"], "error_bad_request")
