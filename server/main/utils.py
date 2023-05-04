import hashlib

from llama_index import GPTSimpleVectorIndex
from langchain import OpenAI
from langchain.llms import OpenAIChat
from langchain.agents import Tool, initialize_agent
from langchain.chains.conversation.memory import ConversationBufferMemory

from llama_index import GPTListIndex
from llama_index.langchain_helpers.memory_wrapper import GPTIndexChatMemory


from main.models import IndexModel, DocumentModel


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


def initialize_chain_with_index(index):
    tools = [
        Tool(
            name="GPT Index",
            func=lambda q: str(index.query(q, mode="default")),
            description="useful for answer questions",
            return_direct=True,
        ),
    ]
    memory = GPTIndexChatMemory(
        index=GPTListIndex([]),
        memory_key="chat_history",
        query_kwargs={"response_mode": "compact"},
        return_source=True,
        return_messages=True,
    )
    llm = OpenAI(temperature=0)
    agent_chain = initialize_agent(
        tools, llm, agent="conversational-react-description", memory=memory
    )
    return agent_chain


def get_chain_from_documents(doc_ids):
    tools = []
    # loading each document as a tool
    for doc_id in doc_ids:
        index = get_index(doc_id)
        tool = Tool(
            name="GPT Index",
            func=lambda q: str(index.as_query_engine().query(q)),
            description=str(
                index.query(
                    "summarize the document in 50 words and begin your answer with 'useful for ...'"
                )
            ),
            return_direct=True,
        )
        tools.append(tool)
    # initializing memory index
    memory = GPTIndexChatMemory(
        index=GPTListIndex([]),
        memory_key="chat_history",
        query_kwargs={"response_mode": "compact"},
        return_source=True,
        return_messages=True,
    )
    # setting up llm
    llm = OpenAI(temperature=0, model_name="text-davinci-003")
    # setting up chain
    agent_chain = initialize_agent(
        tools, llm, agent="conversational-react-description", memory=memory
    )
    return agent_chain


def has_nodes(uid):
    return DocumentModel.has_nodes(uid)


def get_nodes(uid):
    return DocumentModel.get_nodes(uid)


def set_index(uid, nodes):
    IndexModel.set_index(uid, nodes)


def has_index(uid):
    return IndexModel.has_index(uid)


def get_index(uid):
    return IndexModel.get_index(uid)


# def set_collection(uid, nodes):
#     CollectionModel.set_collection(uid, nodes)


# def has_collection(uid):
#     return CollectionModel.has_collection(uid)


# def get_collection(uid):
#     return CollectionModel.get_collection(uid)
