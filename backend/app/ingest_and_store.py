from ingest import load_documents
from splitter import chunk_text
from embeddings import embed_text
from db import collection

def ingest_documents(UPLOADED_FILENAME_FILE_PATH, chunkSize):
    docs = load_documents("data/docs",UPLOADED_FILENAME_FILE_PATH)
    overlap = 0
    min_chunk_size = 0
    if chunkSize == '500':
        chunkSize=500
        overlap = 80
        min_chunk_size = 200
    elif chunkSize == '150':
        chunkSize = 150
        overlap = 25
        min_chunk_size = 50
    elif chunkSize == '1000':
        chunkSize = 1000
        overlap = 150
        min_chunk_size = 400
        
    
    for fileName, doc in docs:
        chunks = chunk_text(doc, chunk_size=chunkSize, overlap=overlap, min_chunk_size=min_chunk_size)
        embeddings = embed_text(chunks)
        
        ids = [f"{fileName}_{i}" for i in range(len(chunks))]
        
        collection.add(
            documents=chunks,
            embeddings=embeddings,
            ids=ids
        )
        print(collection.count())
    print(f"Ingested {len(docs)} documents into vector DB.")
