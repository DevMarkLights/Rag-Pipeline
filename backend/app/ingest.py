import os
from PyPDF2 import PdfReader
from docx import Document

def load_documents(folder_path="data/docs",UPLOADED_FILENAME_FILE_PATH=""):
    documents=[]
    filenames = []
    for filename in os.listdir(folder_path):
        path = os.path.join(folder_path,filename)
        filenames.append(filename)
        
        if filename.endswith(".pdf"):
            reader = PdfReader(path)
            text = ""
            for page in reader.pages:
                text += page.extract_text() + "\n"
            documents.append([filename,text])

        elif filename.endswith(".txt"):
            text=""
            with open(path, "r", encoding="utf-8") as f:
                test = f.read()
            documents.append([filename,text])
                
        elif filename.endswith(".docx"):
            doc = Document(path)
            text = "\n".join([para.text for para in doc.paragraphs])
            documents.append([filename,text])

    with open(UPLOADED_FILENAME_FILE_PATH, "a") as file:
        for f in filenames:
            file.write(f'{f}\n')
    
    return documents
            