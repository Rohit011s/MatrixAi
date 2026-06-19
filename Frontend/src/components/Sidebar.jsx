import { useContext, useEffect } from "react";
import "./Sidebar.css";
import { MyContext } from "../context/MyContext";
import { v1 as uuidv1 } from "uuid";

function Sidebar() {
  const {
    allThreads,
    setAllThreads,
    currThreadId,
    prevChats,
    setPrevChats,
    setReply,
    setCurrThreadId,
    setLastReply,
    setNewChat,
    setPrompt,user,setUser
  } = useContext(MyContext);

  const createNewChat = () => {
    setNewChat(true);
    setCurrThreadId(uuidv1());
    setPrompt("");
    setReply(null);
    setPrevChats([]);
  };

  const threads = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/thread",{credentials: "include"});
     const data = await response.json();
console.log(data);

if (response.ok) {
  setAllThreads(data);
} else {
  console.log(data);
  setAllThreads([]);
}
    } catch (error) {
      console.log(error);
    }
  };

  // Load messages when user switches to another thread
  const changeThread = async (id) => {
    setCurrThreadId(id);

    try {
      const response = await fetch(
        `http://localhost:8080/api/thread/${id}`,{credentials: "include"}
      );

      const res = await response.json();

      setReply(null);
    setLastReply(null);
      setNewChat(false);
      setPrevChats(res);
    } catch (error) {
      console.log(error);
    }
  };

  // Prevent delete click from opening the thread
  const deleteThread = async (id) => {
    try {
      await fetch(`http://localhost:8080/api/thread/${id}`, {
        method: "DELETE",
        credentials: "include"
      });

      setAllThreads(
        allThreads.filter((thread) => thread.threadId !== id)
      );

      if (currThreadId === id) {
        createNewChat();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if(!user)return;
    
      threads();

  }, [user,currThreadId,prevChats]);

  return (
    <section className="sidebar">
      <button onClick={createNewChat}>
        <img
          className="logo"
          src="src/assets/matrixAiLogo.png"
          alt="Matrix Logo"
        />
        <span>
          <i className="fa-regular fa-pen-to-square"></i>
        </span>
      </button>

      <div className="historyTitle">
        <p>History</p>
      </div>

      <ul className="history scrollbar">
        {allThreads?.map((thread, idx) => (
          <li
            key={idx}
            className={
              thread.threadId === currThreadId ? "highlight" : ""
            }
            onClick={() => changeThread(thread.threadId)}
          >
            {thread.title}

            <span
              onClick={(e) => {
                e.stopPropagation();
                deleteThread(thread.threadId);
              }}
            >
              <i className="fa-regular fa-trash-can"></i>
            </span>
          </li>
        ))}
      </ul>

      <div className="sign">By Rohit</div>
    </section>
  );
}

export default Sidebar;