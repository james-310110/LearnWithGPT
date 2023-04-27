from django.test import TestCase, Client
from django.contrib.sessions.backends.db import SessionStore
from main.models import DocumentModel, CollectionModel
from main.utils import *

import json


# Create your tests here.


class API_tests(TestCase):
    def setUp(self):
        self.client = Client()

    # def test_get(self):
    #     query = {
    #         "filelist": ["fa", "fb"],
    #         "linklist": [".com", ".edu"],
    #         "query": "What is the Tapestry paper about?",
    #         "format": "html",
    #     }
    #     query_jsonstr = json.dumps(query)
    #     response = self.client.get(f"/getdata?data={query_jsonstr}")
    #     self.assertEqual(response.status_code, 200)
    #     print("GET test response {}".format(response.json()))

    # def test_post_pdf(self):
    #     # setting parameters
    #     file_path = "main/testdata/"
    #     file_name = "tapestry.pdf"
    #     upload_time = "2020-01-01 00:00:00"
    #     session_key = "test_session_key"  # set it later
    #     uid = get_document_id(file_name, session_key, upload_time)
    #     self.assertFalse(has_nodes(uid))
    #     # sending post request
    #     with open(file_path + file_name, "rb") as f:
    #         response = self.client.post(
    #             "/postdata", {"file": f, "upload_time": upload_time}
    #         )
    #     self.assertEqual(response.status_code, 200)
    #     self.assertTrue(has_nodes(uid))

    def test_post_then_get(self):
        # setting parameters
        file_path = "main/testdata/"
        file_name = "test.txt"
        upload_time = "2020-01-01 00:00:00"
        session_key = "test_session_key"  # set it later
        doc_id = get_document_id(file_name, session_key, upload_time)
        index_id = get_collection_id([doc_id])
        self.assertFalse(has_nodes(doc_id))
        self.assertFalse(has_index(index_id))
        # sending post request
        with open(file_path + file_name, "rb") as f:
            post_response = self.client.post(
                "/postdata", {"file": f, "upload_time": upload_time}
            )
        query = {
            "file_list": [[file_name, upload_time]],
            "web_list": [],
            "question": "What is this document about?",
        }
        query_jsonstr = json.dumps(query)
        get_response = self.client.get(f"/getdata?data={query_jsonstr}")
        self.assertEqual(post_response.status_code, 200)
        self.assertEqual(get_response.status_code, 200)
        self.assertTrue(has_nodes(doc_id))
        self.assertTrue(has_index(index_id))

        response_data = json.loads(get_response.content)
        self.assertEqual(response_data["result"], "success")
        self.assertEqual(response_data["question"], query["question"])
        self.assertIn("answer", response_data)
        # print(json.loads(get_response))

    # def test_post_txt(self):
    #     with open("main/testdata/test.txt", "rb") as f:
    #         response = self.client.post(
    #             "/postdata", {"file": f, "upload_time": "2020-01-01 00:00:00"}
    #         )
    #     self.assertEqual(response.status_code, 200)
    #     doc = DocumentModel.objects.get(id="test.txt")
    #     print("POST txt test saved {} into database".format(doc))

    #     with doc.file.open("rb") as f:
    #         response = self.client.post("/postdata", {"file": f})
    #     docs = list(DocumentModel.objects.all().values())
    #     print("POST txt test's current database {}".format(docs))
    #     print("POST txt test response {}".format(response.json()))

    # def test_post_nofile(self):
    #     response = self.client.post("/postdata", {"file": "f"})
    #     self.assertEqual(response.status_code, 200)
    #     print("POST nofile test response {}".format(response.json()))
