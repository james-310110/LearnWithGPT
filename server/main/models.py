import json
from django.db import models
from llama_index import GPTSimpleVectorIndex
from llama_index.data_structs import Node


class DocumentModel(models.Model):
    uid = models.CharField(primary_key=True, max_length=256)
    # not sure to use JSONField or TextField for json string
    nodes = models.JSONField()

    @classmethod
    def set_nodes(cls, uid, nodes):
        # TODO assumes new document created each time, need to add update scenario
        document = cls(uid=uid, nodes=json.dumps([node.to_dict() for node in nodes]))
        document.save()

    @classmethod
    def get_nodes(cls, uid):
        document = cls.objects.get(uid=uid)
        nodes = []
        for node_dict in document.nodes:
            nodes.append(Node.from_dict(node_dict))
        return nodes

    @classmethod
    def has_nodes(cls, uid):
        return cls.objects.filter(uid=uid).exists()


class IndexModel(models.Model):
    uid = models.CharField(primary_key=True, max_length=256)
    # not sure to use JSONField or TextField for json string
    index = models.JSONField()
    # memory =

    @classmethod
    def set_index(cls, uid, nodes):
        # TODO assumes new document created each time, need to add update scenario
        # save_to_string() returns a JSON string
        index = cls(uid, GPTSimpleVectorIndex(nodes).save_to_string())
        index.save()

    @classmethod
    def get_index(cls, uid):
        index = cls.objects.get(uid=uid)
        return index

    @classmethod
    def has_index(cls, uid):
        return cls.objects.filter(uid=uid).exists()


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
