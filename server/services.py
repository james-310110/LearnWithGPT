from typing import Dict, List
import requests
from collections import deque
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from llama_index import Document, download_loader


class DocumentParser:
    """Document parser.

    Can read files or web urls into separate documents,
    or concatenates them into one document text.

    """

    def __init__(self):
        """Initialize extractors for files and web urls"""
        self.file_extractors: Dict[str, str] = {
            ".pdf": "CJKPDFReader",
            ".docx": "DocxReader",
            ".pptx": "PptxReader",
            ".jpg": "ImageReader",
            ".png": "ImageReader",
            ".jpeg": "ImageReader",
            ".mp3": "AudioTranscriber",
            ".mp4": "AudioTranscriber",
            ".csv": "PandasCSVReader",
            ".xlsx": "PandasExcelReader",
            ".epub": "EpubReader",
            ".md": "MarkdownReader",
            ".mbox": "MboxReader",
            ".eml": "UnstructuredReader",
            ".html": "UnstructuredReader",
            ".json": "JSONReader",
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

    def load_file(self, input_file) -> List[Document]:
        """Load file from memory.

        Args:
            input_file (FileStorage): a file object read from memory

        Returns:
            List[Document]: A list of documents.
        """
        documents = []
        # TODO: verify if input_file has a "name" attribute
        file_name = input_file.name
        file_type = file_name.split(".")[-1]
        file_extractor = self.file_extractors.get(
            file_type, self.default_file_extractor
        )
        file_reader = download_loader(file_extractor)
        # TODO: get upload_time and store it as metadata for each file read
        return file_reader.load_data(file=input_file)

    def load_web(self, input_url, is_knowledge_base=False) -> List[Document]:
        """Load web urls from memory.

        Args:
            input_url (str): a web url string read from memory
            is_knowledge_base (bool): whether to treat input url as knowledge base and craw all internal links
                If set to True, all endpoints will be crawled from the input basepoint.
                False by default.

        Returns:
            List[Document]: A list of documents.
        """
        documents = []
        parsed_url = urlparse(input_url)
        basepoint = parsed_url.netloc
        web_extractor = self.web_extractors.get(basepoint, self.simple_web_extractor)
        web_reader = download_loader(web_extractor)
        if web_extractor is "docs.google.com":
            gdoc_ids = [parsed_url.path.split("/")[3]]
            return web_reader.load_data(document_ids=gdoc_ids)
        if web_extractor is "drive.google.com":
            gfolder_id = parsed_url.path.split("/")[3]
            return web_reader.load_data(folder_id=gfolder_id)
        if is_knowledge_base:
            endpoints = self._scrape_knowledge_base(basepoint)
            return web_reader.load_data(urls=endpoints)
        else:
            return web_reader.load_data(urls=[input_url])

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
