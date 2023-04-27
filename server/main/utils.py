import hashlib

from llama_index import GPTSimpleVectorIndex

from main.models import DocumentModel, CollectionModel


def get_document_id(str1="", str2="", str3=""):
    # str1: file_name / url
    # str2: session_id
    # str3: upload_time
    concatenated_str = str1 + str2 + str3
    encoded_str = concatenated_str.encode("utf-8")
    hash_obj = hashlib.sha256()
    hash_obj.update(encoded_str)
    return hash_obj.hexdigest()


def get_collection_id(strs):
    concatenated_str = "".join(strs)
    encoded_str = concatenated_str.encode("utf-8")
    hash_obj = hashlib.sha256()
    hash_obj.update(encoded_str)
    return hash_obj.hexdigest()


def has_nodes(uid):
    return DocumentModel.has_nodes(uid)


def get_nodes(uid):
    return DocumentModel.get_nodes(uid)


def set_index(uid, nodes):
    CollectionModel.set_index(uid, nodes)


def has_index(uid):
    return CollectionModel.has_index(uid)


def get_index(uid):
    return CollectionModel.get_index(uid)
