from ingest import load_documents
from splitter import chunk_text
from embeddings import embed_text
from db import collection

def ingest_documents(UPLOADED_FILENAME_FILE_PATH):
    docs = load_documents("data/docs",UPLOADED_FILENAME_FILE_PATH)
    
    for fileName, doc in docs:
        chunks = chunk_text(doc)
        embeddings = embed_text(chunks)
        
        ids = [f"{fileName}_{i}" for i in range(len(chunks))]
        
        collection.add(
            documents=chunks,
            embeddings=embeddings,
            ids=ids
        )
        print(collection.count())
    print(f"Ingested {len(docs)} documents into vector DB.")
