import { use, useEffect, useState } from 'react'
import './App.css'
import { LuPanelLeftOpen } from "react-icons/lu";
import { LuPanelRightOpen } from "react-icons/lu";

function App() {
  const [question,setQuestion] = useState("")
  const [answer,setAnswer] = useState("")
  const [filesSaved,setFilesSaved] = useState([])
  const [filesInDB,setFilesInDb] = useState([])
  const [isUploading,setIsUploading] = useState(false)
  const [isLeftSideOpen,setLeftSideOpened] = useState(false)
  const [chunkSize,setChunkSize] = useState(500)
  const [chunkSizes,setChunkSizes] = useState([])
  const [filesToBeUploaded,setfilesToBeUploaded] = useState([])

  async function addFiles(files){

    var temp = filesToBeUploaded
    temp.push(files[0])
    setfilesToBeUploaded(temp)

    temp = chunkSizes
    temp.push(chunkSize)
    setChunkSizes(temp)
  }

  async function upload(){
    setIsUploading(true)

    try{
      const formData = new FormData();
      filesToBeUploaded.forEach((item,index) => {
        formData.append("chunkSize", chunkSizes[index])
        formData.append("documents", item)
      })

      const response = await fetch("https://marks-pi.com/apiRag/upload", {
        method: "POST",
        body: formData,
      });

      var res = await response.json()
      setFilesSaved(res.files.join().replaceAll(',',', '))
      setFilesInDb(await getFilesInDb())
      document.getElementById("fileDrop").value = "";
      
      setIsUploading(false)
      setfilesToBeUploaded([])
      setChunkSizes([])

    } catch(error){
      setIsUploading(false)
    }
    
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

  function handleCheckbox(id){
    switch (id){
      case 'sCheckbox':
        document.getElementById('pCheckbox').checked = false
        document.getElementById('lpCheckbox').checked = false
        setChunkSize(150)
        break;
      case 'pCheckbox':
        document.getElementById('sCheckbox').checked = false
        document.getElementById('lpCheckbox').checked = false
        setChunkSize(500)
        break;
      case 'lpCheckbox':
        document.getElementById('sCheckbox').checked = false
        document.getElementById('pCheckbox').checked = false
        setChunkSize(1000)
        break;
    }
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
      <>
        <div className='body'>
          {!isLeftSideOpen ?
            <div>
              <LuPanelLeftOpen className='openIcon' style={{width: '20px', height: '20px', margin: '0 2px'}} onClick={() => setLeftSideOpened(true)}/>
              <p style={{margin: '0 4px'}}>D</p>
              <p style={{margin: '0 4px'}}>O</p>
              <p style={{margin: '0 4px'}}>C</p>
              <p style={{margin: '0 4px'}}>U</p>
              <p style={{margin: '0 4px'}}>M</p>
              <p style={{margin: '0 4px'}}>E</p>
              <p style={{margin: '0 4px'}}>N</p>
              <p style={{margin: '0 4px'}}>T</p>
              <p style={{margin: '0 4px'}}>S</p>
            </div>
          :
            <div className='leftSide'>
              <LuPanelRightOpen className='openIcon' onClick={() => setLeftSideOpened(false)} style={{width: '20px', height: '20px', margin: '5px 0 0 auto'}}/>
              <button onClick={() => deleteDocuments()}>Delete Documents</button>
              <p >Files Saved To DB:</p>
              <ul>
              {filesInDB.map((item,index) => {
                return(
                  <li style={{fontSize: '11px'}}> {item}</li>
                )
              })}
              </ul>
            </div>
          }
          
          <div className='rightSide'>
            <h1>RAG Pipeline</h1>
            <p> Add files to query</p>
            <p style={{margin:'0'}}>What is your file context style?</p>
            <p style={{margin:'0', color:'red'}}>*default is Paragraph*</p>
            <div style={{display:'flex', flexDirection:'row', flexWrap: 'true', justifyContent: 'space-between', minWidth:'100px', margin: '20px 0'}}>
              <div style={{display:'flex', flexDirection:'row'}}>
                <input id='sCheckbox' type='checkbox' onChange={() => {handleCheckbox('sCheckbox')}} />
                <p style={{margin: '0'}}>Sentence</p>
              </div>
              <div style={{display:'flex', flexDirection:'row'}}>
                <input id='pCheckbox' type='checkbox' onChange={(e) => {handleCheckbox('pCheckbox')}}/>
                <p style={{margin: '0'}}>Paragraph</p>
              </div>
              <div style={{display:'flex', flexDirection:'row'}}>              
                <input id='lpCheckbox' type='checkbox' onChange={(e) => {handleCheckbox('lpCheckbox')}} />
                <p style={{margin: '0'}}>Larger than Paragraph</p>
              </div>
            </div>
            <div className='fileDropDiv'>
              <input
                  id='fileDrop'
                  type="file"
                  single='true'
                  onChange={e => addFiles([...e.target.files])}
                />
              <p>files saved:</p>
              <p>{filesSaved}</p>
              <button style={{margin: '20px 0'}} onClick={() => upload()}>Upload</button>
            </div>

            <div className='query' style={{display: 'flex', flexDirection: 'column', justifyItems:'center', alignItems: 'center'}}>
              <p>Ask question about any of the documents you uploaded</p>
              <input id='question' placeholder='type question' 
                onKeyUp={(e) => {if (e.key === 'Enter'){query()}}} 
                onChange={(e) => setQuestion(e.target.value)}/>
              <button style={{ maxWidth: '100px', minWidth: '100px', margin: '10px 0'}} onClick={() => query()}>Query</button>
              <button style={{ maxWidth: '100px', minWidth: '100px'}} onClick={() => clearAnswer()}>Clear</button>
            </div>
            
            <div className='answer'>
              <p style={{fontWeight: 700}}>Answer:</p>
              <p>{answer}</p>
            </div>
          </div>
        </div>
      {isUploading &&
        <div className='loadingContainer'>
          <div className='loader'></div>
        </div>
      }
    </>
    
  )
}

export default App
