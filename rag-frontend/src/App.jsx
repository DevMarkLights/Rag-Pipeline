import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [question,setQuestion] = useState("")
  const [answer,setAnswer] = useState("")
  const [filesSaved,setFilesSaved] = useState([])
  const [filesInDB,setFilesInDb] = useState([])

  async function sendFilesToBackend(files){
     const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append("documents", files[i]); 
    }

    const response = await fetch("https://marks-pi.com/apiRag/upload", {
      method: "POST",
      body: formData,
    });
    var res = await response.json()
    setFilesSaved(res.files)
    setFilesInDb(await getFilesInDb())
    document.getElementById("fileDrop").value = "";

  }

  async function query(){
     const response = await fetch("https://marks-pi.com/apiRag/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({"question":question}), 
    });
    var res = await response.json()
    setAnswer(res.answer)
  }

  async function deleteDocuments(){
    try{  
      const response = await fetch("https://marks-pi.com/apiRag/deleteDocuments", {method: "GET"});
      var body = await response.json()
    }catch{
      return []
    }
    setFilesInDb(await getFilesInDb())
  }

  async function getFilesInDb(){
    try{  
      const response = await fetch("https://marks-pi.com/apiRag/filesInDB", {method: "GET"});
      var body = await response.json()
      return body.files
    }catch{
      return []
    }
  }

  function clearAnswer(){
    setAnswer("")
  }

  useEffect(() =>{
    async function files(){
      if(filesInDB.length == 0){
        files = await getFilesInDb()
        if (files.length !== 0){
          setFilesInDb(files)
        }else{
          var temp = []
          temp.push("No Files in DB add some")
          setFilesInDb(temp)
        }
        
      }
    }

    files()
    
  })

  return (
    <div className='body'>
      <div className='leftSide'>
        <button onClick={() => deleteDocuments()}>Delete Documents</button>
        <p >Files Saved To DB:</p>
        <ul>
        {filesInDB.map((item,index) => {
          return(
            <li> {item}</li>
          )
        })}
        </ul>
      </div>
      <div className='rightSide'>
        <h1>RAG Pipeline</h1>
        <p> Add files to query</p>
        <div className='fileDropDiv'>
          <input
              id='fileDrop'
              type="file"
              multiple
              onChange={e => sendFilesToBackend([...e.target.files])}
            />
          <p>files saved:</p>
          <p>{filesSaved}</p>
        </div>

        <div className='query'>
          <p>Ask question about any of the documents you uploaded</p>
          <input id='question' placeholder='type question' 
            onKeyUp={(e) => {if (e.key === 'Enter'){query()}}} 
            onChange={(e) => setQuestion(e.target.value)}/>
          <button onClick={() => query()}>Query</button>
        </div>
        
        <div className='answer'>
          <p style={{fontWeight: 700}}>Answer:</p>
          <p>{answer}</p>
        </div>
      </div>
      
      

    </div>
  )
}

export default App
