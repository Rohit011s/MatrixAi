import './App.css'
import { useState } from 'react'
import ChatWindow from "./ChatWindow"
import Chat from './Chat'
import Sidebar from './Sidebar'
import {v1 as uuidv1} from "uuid"
import { MyContext } from './MyContext'
function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [newChat,setNewChat ] = useState(true);
  const [prevChats,setPrevChats]=useState([]);
  const [allThreads,setAllThreads]=useState([]);
  const [currThreadId,setCurrThreadId]=useState(uuidv1());
  const [lastReply, setLastReply] = useState(null);
const providerValues={
  prompt,setPrompt,
  reply,setReply,
  currThreadId,setCurrThreadId,
lastReply, setLastReply,
  prevChats,setPrevChats,
  newChat,setNewChat,
  allThreads,setAllThreads
}
  return (
   <MyContext.Provider value={providerValues}>
    <div className='app'>
    <Sidebar/>
    <ChatWindow/>
    </div>
    </MyContext.Provider>
  )
}

export default App
