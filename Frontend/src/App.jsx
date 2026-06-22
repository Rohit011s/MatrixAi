import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import {v1 as uuidv1} from "uuid"
import { MyContext } from './context/MyContext'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import {Toaster} from 'react-hot-toast' 
function App() {
  const [files, setFiles] = useState(null);
  const [prompt, setPrompt] = useState("");
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [reply, setReply] = useState(null);
    const [user,setUser]=useState(null);
    const [newChat,setNewChat ] = useState(true);
    const [prevChats,setPrevChats]=useState([]);
    const [allThreads,setAllThreads]=useState([]);
    const [currThreadId,setCurrThreadId]=useState(uuidv1());
   const [lastReply, setLastReply] = useState(null);
  const providerValues={
    prompt,setPrompt,
    reply,setReply,files, setFiles,
    currThreadId,setCurrThreadId,
  lastReply, setLastReply,
    prevChats,setPrevChats,
    newChat,setNewChat,
    allThreads,setAllThreads,
    user,setUser,
    selectedFiles, setSelectedFiles
  };
  
  return (
       <MyContext.Provider value={providerValues}>
<Toaster></Toaster>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
       </MyContext.Provider>
  )
}

export default App;