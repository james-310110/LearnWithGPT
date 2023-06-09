import json
from django.db import models
from llama_index import GPTSimpleVectorIndex
from llama_index.data_structs import Node
from llama_index import (
    GPTSimpleVectorIndex,
    ServiceContext,
    LLMPredictor,
    PromptHelper,
)
from langchain import OpenAI
import datetime
from django.utils import timezone




# deprecated
class DocumentModel(models.Model):
    uid = models.CharField(primary_key=True, max_length=256)
    # not sure to use JSONField or TextField for json string
    nodes = models.TextField()

    @classmethod
    def set_nodes(cls, uid, nodes):
        # TODO assumes new document created each time, need to add update scenario
        document = cls(uid=uid, nodes=json.dumps([node.to_dict() for node in nodes]))
        document.save()

    @classmethod
    def get_nodes(cls, uid):
        document = cls.objects.get(uid=uid)
        nodes = []
        for node_dict in json.loads(document.nodes):
            nodes.append(Node.from_dict(node_dict))
        return nodes

    @classmethod
    def has_nodes(cls, uid):
        return cls.objects.filter(uid=uid).exists()


class IndexModel(models.Model):
    uid = models.CharField(primary_key=True, max_length=256)
    content = models.TextField()
    exp_date = models.DateTimeField()


    @classmethod
    def set_index(cls, uid, nodes):
        # TODO assumes new document created each time, need to add update scenario
        # save_to_string() returns a JSON string
        llm_predictor = LLMPredictor(
            llm=OpenAI(temperature=0, model_name="text-davinci-003")
        )
        max_input_size = 4096
        num_output = 2048
        max_chunk_overlap = 20
        prompt_helper = PromptHelper(max_input_size, num_output, max_chunk_overlap)
        service_context = ServiceContext.from_defaults(
            llm_predictor=llm_predictor, prompt_helper=prompt_helper
        )
        index = cls(
            uid,
            GPTSimpleVectorIndex(
                nodes, service_context=service_context
            ).save_to_string(),
            timezone.now() + datetime.timedelta(hours=24)
        )
        index.save()

    @classmethod
    def get_index(cls, uid):
        all_idxs = cls.objects.all()
        for idx in all_idxs:
            if timezone.now() > idx.exp_date:
                idx.delete()
        index = cls.objects.get(uid=uid)
        return GPTSimpleVectorIndex.load_from_string(index.content)

    @classmethod
    def has_index(cls, uid):
        return cls.objects.filter(uid=uid).exists()


# deprecated
# class CollectionModel(models.Model):
#     colxn_id = models.CharField(primary_key=True, max_length=256)
#     # not sure to use JSONField or TextField for json string
#     # doc_ids = models.ArrayField(models.CharField(max_length=256))

#     @classmethod
#     def set_collection(cls, colxn_id, doc_ids):
#         collection = cls(
#             colxn_id,
#             doc_ids,
#         )
#         print("generated index")
#         collection.save()
#         print("saved index")

#     # @classmethod
#     # def get_doc_ids(cls, colxn_id):
#     #     print("getting index")
#     #     collection = cls.objects.get(uid=uid)
#     #     print("got index")
#     #     return GPTSimpleVectorIndex.load_from_string(collection.index)

#     @classmethod
#     def has_collection(cls, colxn_id):
#         return cls.objects.filter(colxn_id=colxn_id).exists()


# class CollectionModel(models.Model):
#     uid = models.CharField(primary_key=True, max_length=256)
#     nodes = models.JSONField()

#     @classmethod
#     def set_nodes(cls, uid, nodes):
#         # TODO assumes new document created each time, need to add update scenario
#         document = cls(uid=uid, nodes=[])
#         for node in nodes:
#             document.nodes.append(node.to_dict())
#         document.save()

#     @classmethod
#     def get_nodes(cls, uid):
#         document = cls.objects.get(uid=uid)
#         nodes = []
#         for node_dict in document.nodes:
#             nodes.append(Node.from_dict(node_dict))
#         return nodes

#     @classmethod
#     def has_nodes(cls, uid):
#         return cls.objects.filter(uid=uid).exists()
