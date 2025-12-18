from fastapi import FastAPI, File, UploadFile, Body
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from rag import answer_question
# from generate_answer import generator
from ingest_and_store import ingest_documents
import os
import shutil
from pathlib import Path
from db import collection

upload_dir = Path("data/docs")
upload_dir.mkdir(parents=True, exist_ok=True)

app = FastAPI()

    
upload_dir = "data/docs"
allowed_extensions = {".pdf", ".txt", ".docx"}

@app.post("/ask")
async def ask_question(query: dict = Body(...)):
    result = answer_question(query['question'])
    # result = generator(result, query.question) # for LLM but Pi 5 is not strong enough
    return {"answer": result}

@app.get("/documentCount")
async def countDocuments():
    return {'count': collection.count()}

@app.get("/deleteDocuments")
async def deleteDocuments():
    ids = collection.get()["ids"]

    if ids:
        collection.delete(ids=ids)
    
    with open("filesUploaded.txt","w") as file: # clear file names
        file.write("")
    
    return {'status':'documents deleted'}

@app.post("/upload")
async def upload_docs(documents: list[UploadFile] = File(...)):
    saved_files = []
    for doc in documents:
        # save documents to folder
        ext = Path(doc.filename).suffix.lower()
        if ext not in allowed_extensions:
            return {"error",f'{ext} file type not allowed'}
        
        file_path = os.path.join(upload_dir, doc.filename)
        
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(doc.file, buffer)
        
        saved_files.append(doc.filename)
    
    ingest_documents()
    
    # remove files from folder
    for item in Path(upload_dir).iterdir():
        if item.is_file():
            item.unlink()
    
    return {
        "status": "success", 
        "files": saved_files
    }
    
@app.get("filesInDB")
def getFileNamesInDb():
    fileNames = []
    with open("filesUploaded.txt", "r") as file:
        for fn in file:
            fileNames.append(fn)

    return {"files":fileNames}    

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8082,
        log_level="debug",
    )