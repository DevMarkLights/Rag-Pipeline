import { useState } from 'react'
import './App.css'
import Dropzone from 'react-dropzone'

function App() {
  const [question,setQuestion] = useState("")
  const [answer,setAnswer] = useState("")
  const [filesSaved,setFilesSaved] = useState([])
  async function sendFilesToBackend(files){
     const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append("documents", files[i]); // MUST match FastAPI param name
    }

    const response = await fetch("https://marks-pi.com/apiRag/upload", {
      method: "POST",
      body: formData, // DO NOT set Content-Type manually
    });
    var res = await response.json()
    // console.log(await response.json())
    setFilesSaved(res.files)
  }

  async function query(){
     const response = await fetch("https://marks-pi.com/apiRag/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({"question":question}), // DO NOT set Content-Type manually
    });
    var res = await response.json()
    setAnswer(res.answer)
  }

  return (
    <>
      <h1>RAG</h1>
      <div>
        <p> Add files to query</p>
      </div>
      <div className='dropzone'>
        {/* <Dropzone onDrop={acceptedFiles => sendFilesToBackend(acceptedFiles)}>
          {({ getRootProps, getInputProps }) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <p>Drag files here</p>
            </div>
          )}
        </Dropzone> */}
        <input
            type="file"
            multiple
            onChange={e => sendFilesToBackend([...e.target.files])}
            // style={styles.fileInput}
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
      
      <div>
        <p>Answer:</p>
        <p>{answer}</p>
      </div>
    </>
  )
}

export default App
