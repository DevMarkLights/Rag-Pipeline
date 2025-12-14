from db import collection
from embeddings import embed_text

def answer_question(question: str):
    
    query_vec = embed_text([question])[0]
    
    try:
        results = collection.query(query_embeddings=[query_vec],n_results=1)
        docs = results["documents"][0]
        # context="\n".join(docs)
        context = docs[0].replace('\n','')
        # print(f"Question: {question}\n\nContext:\n{context}")
    except Exception as e:
        print(e)
        context = "No documents in the database yet."
    
    # return f"Question: {question}\n\nAnswer:\n{context}"
    return f"{context}"