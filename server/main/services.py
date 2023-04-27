from typing import Dict, List
import requests
from collections import deque
from bs4 import BeautifulSoup
from main.utils import get_document_id
from main.models import DocumentModel
from urllib.parse import urljoin, urlparse
from llama_index import Document, download_loader
from llama_index.node_parser import SimpleNodeParser
from unstructured.partition.auto import partition


class DocumentLoader:
    """Document parser.

    Can read files or web urls into separate documents,
    or concatenates them into one document text.

    """

    def __init__(self):
        """Initialize extractors for files and web urls"""
        # TODO download all loaders locally or store in db
        self.file_extractors: Dict[str, str] = {
            "pdf": "CJKPDFReader",
            "docx": "DocxReader",
            "pptx": "PptxReader",
            "jpg": "ImageReader",
            "png": "ImageReader",
            "jpeg": "ImageReader",
            "mp3": "AudioTranscriber",
            "mp4": "AudioTranscriber",
            "csv": "PandasCSVReader",
            "xlsx": "PandasExcelReader",
            "epub": "EpubReader",
            "md": "MarkdownReader",
            "mbox": "MboxReader",
            "eml": "UnstructuredReader",
            "html": "UnstructuredReader",
            "json": "JSONReader",
        }
        self.default_file_extractor: str = "UnstructuredReader"
        self.web_extractors: Dict[str, str] = {
            "www.youtube.com": "YoutubeTranscriptReader",  # url
            "www.bilibili.com": "BilibiliTranscriptReader",  # url
            "docs.google.com": "GoogleDocsReader",  # ids
            "drive.google.com": "GoogleDriveReader",  # id
        }
        self.simple_web_extractor: str = "BeautifulSoupWebReader"  # urls
        self.complex_web_extractor: str = "UnstructuredURLLoader"  # urls

    def load_file(self, input_file, by_whom: str, at_when: str):
        """Load file from memory and save nodes to db.

        Args:
            input_file (FileStorage): a file object read from memory
            by_whom (str): the id of the user/session who uploaded the file
            at_when (str): the time when the file was uploaded
        """
        file_name = input_file.name
        file_type = file_name.split(".")[-1]
        # setting the appropriate extractor
        # file_loader = download_loader(
        #     self.file_extractors.get(file_type, self.default_file_extractor)
        # )()
        # documents = file_loader.load_data(file=input_file)
        # loading documents from input file using the extractor
        # TODO !!!!! re-implement load_data locally, passing file instead of path
        elements = partition(file=input_file)
        text_chunks = [" ".join(str(el).split()) for el in elements]
        documents = [Document("\n\n".join(text_chunks), extra_info=None)]
        # generating uid
        uid = get_document_id(file_name, by_whom, at_when)
        # saving documents as nodes to db
        self._save_document_as_nodes_to_db(uid, documents)

    def load_web(
        self,
        input_url: str,
        by_whom: str,
        at_when: str,
        is_knowledge_base: bool = False,
    ):
        """Load web from memory and save nodes to db.

        Args:
            input_file (FileStorage): a file object read from memory
            by_whom (str): the id of the user/session who uploaded the file
            at_when (str): the time when the file was uploaded
            is_knowledge_base (bool): whether the url is a knowledge base,
                if true, will scrape all the urls in the same domain
                else, scrape only the input url
        """
        documents = []
        parsed_url = urlparse(input_url)
        basepoint = parsed_url.netloc
        web_extractor = self.web_extractors.get(basepoint, self.simple_web_extractor)
        web_reader = download_loader(web_extractor)
        if web_extractor == "docs.google.com":
            gdoc_ids = [parsed_url.path.split("/")[3]]
            documents = web_reader.load_data(document_ids=gdoc_ids)
        elif web_extractor == "drive.google.com":
            gfolder_id = parsed_url.path.split("/")[3]
            documents = web_reader.load_data(folder_id=gfolder_id)
        elif is_knowledge_base:
            endpoints = self._scrape_knowledge_base(basepoint)
            documents = web_reader.load_data(urls=endpoints)
        else:
            documents = web_reader.load_data(urls=[input_url])
        uid = get_document_id(input_url, by_whom, at_when)
        self._save_document_as_nodes_to_db(uid, documents)

    def _scrape_knowledge_base(self, basepoint) -> List[str]:
        endpoints = []
        queue = deque([basepoint])
        while queue:
            current_site = queue.popleft()
            response = requests.get(current_site)
            soup = BeautifulSoup(response.text, "html.parser")
            for link in soup.find_all("a"):  # iterate over each link from html
                href = link.get("href")
                if not href:
                    continue
                # convert relative path to absolute path
                if urlparse(href).netloc:
                    absolute_href = href
                else:
                    absolute_href = urljoin(basepoint, href)
                if urlparse(absolute_href).netloc != basepoint:
                    continue
                if absolute_href in endpoints:
                    continue
                queue.append(absolute_href)
                endpoints.append(absolute_href)
        return endpoints

    def _save_document_as_nodes_to_db(self, uid, documents):
        # setting node parser
        parser = SimpleNodeParser()
        # getting nodes from documents
        nodes = parser.get_nodes_from_documents(documents)
        # saving nodes to db
        DocumentModel.set_nodes(uid=uid, nodes=nodes)


class EmbeddingService:
    def check_file_type(self, file):
        # TODO
        return


class IndexService:
    def check_file_type(self, file):
        # TODO
        return


class ChainService:
    def check_file_type(self, file):
        # TODO
        return
