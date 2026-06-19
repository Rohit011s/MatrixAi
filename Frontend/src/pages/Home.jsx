import './Home.css'
import { useState ,useEffect, useContext} from 'react'
import ChatWindow from "../components/ChatWindow"
import Chat from '../components/Chat'
import Sidebar from '../components/Sidebar'
import { MyContext } from '../context/MyContext'

function Home() {
  const {setUser}=useContext(MyContext)
  useEffect(() => {
  const getCurrentUser = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/me",
        {
          credentials: "include",
        }
      );
 
      if (!response.ok){ setUser(null); return;}
      const data = await response.json();
      setUser(data.user);
    } catch (err) {

console.log(err.status);

    }
  };

  getCurrentUser();
}, []);
  return (

    <div className='Home'>
    <Sidebar/>
    <ChatWindow/>
    </div>
  
  )
}

export default Home
