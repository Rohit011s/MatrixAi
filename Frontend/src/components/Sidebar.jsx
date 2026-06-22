import { useContext, useEffect } from "react";
import "../styles/components/Sidebar.css";
import { MyContext } from "../context/MyContext";
import { v1 as uuidv1 } from "uuid";
import { getThreadMsg, getThreads } from "../../services/chatApi";
import handleError from "../utils/handleError";
import { deleteThread as deleteThreadApi } from "../../services/chatApi";
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
    setPrompt,
    user,
    setUser,
  } = useContext(MyContext);
  // Create a new chat session
  const createNewChat = () => {
    setNewChat(true);
    setCurrThreadId(uuidv1());
    setPrompt("");
    setReply(null);
    setPrevChats([]);
  };
  // Fetch all user threads for sidebar history
  const threads = async () => {
    try {
      const data = await getThreads();
      setAllThreads(data);
    } catch (err) {
      setAllThreads([]);
      handleError(err);
    }
  };
  // Load messages when user switches to another thread
  const changeThread = async (id) => {
    setCurrThreadId(id);

    try {
      const res = await getThreadMsg(id);
      setReply(null);
      setLastReply(null);
      setNewChat(false);
      setPrevChats(res);
    } catch (err) {
      handleError(err);
    }
  };

  // Delete thread without opening it
  const deleteThread = async (id) => {
    try {
      await deleteThreadApi(id);

      setAllThreads(allThreads.filter((thread) => thread.threadId !== id));

      if (currThreadId === id) {
        createNewChat();
      }
    } catch (err) {
      handleError(err);
    }
  };
  // Refresh thread list when user logs in,
  // changes thread, or sends a new message
  useEffect(() => {
    // Skip API call when user is not authenticated
    if (!user) return;
    if (!user) return;

    threads();
  }, [user, currThreadId, prevChats]);

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

      {/* Chat history section */}
      <div className="historyTitle">
        <p>History</p>
      </div>

      {/* List of user chat threads */}
      <ul className="history scrollbar">
        {allThreads?.map((thread, idx) => (
          <li
            key={idx}
            //  Highlight currently selected thread
            className={thread.threadId === currThreadId ? "highlight" : ""}
            onClick={() => changeThread(thread.threadId)}
          >
            {thread.title}
            {/* Prevent delete click from opening the thread and detele thread*/}
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
