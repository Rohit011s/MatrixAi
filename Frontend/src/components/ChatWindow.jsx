import "../styles/components/ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "../context/MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import { DNA } from "react-loader-spinner";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Filemenu from "./Filemenu.jsx";
import toast from "react-hot-toast";
import { sendMessage } from "../../services/chatApi.js";
import { deleteAc, logout as logoutUser } from "../../services/authApi.js";
import handleError from "../utils/handleError.js";
function ChatWindow() {
  const {
    prompt,
    setPrompt,
    reply,
    setNewChat,
    setReply,
    currThreadId,
    setPrevChats,
    user,
    files,
    setUser,
    setAllThreads,
    selectedFiles,showSidebar,setShowSidebar
  } = useContext(MyContext);
  const [menu, setMenu] = useState(false);
  const [fileBtn, setFileBtn] = useState(false);
  const [loader, setLoader] = useState(false);
  const [withRag, setWithRag] = useState(false);
  const navigate = useNavigate();
  // Toggle user dropdown menu
  const togglrMenu = () => {
    setMenu(!menu);
  };
  // Toggle user dropdown menu
  const toggleRag = () => {
    if (!user) {
      toast.error("Sign in required");
      return;
    }
    if (!files || files.length === 0) {
      toast.error("Upload a file first");
      return;
    }

    setWithRag((prev) => !prev);
  };
const toggleBar=()=>{
  setShowSidebar(!showSidebar);
}
  const dltac=async()=>{
    const res=await deleteAc();
        
      toast.success("account deleted successfuly");
      setUser(null);
      setAllThreads([]);
      setPrevChats([]);
      setReply(null);
      window.location.reload();
  }
// Logout user and clear all client-side state
const logout = async () => {
    try {
      await logoutUser();
      toast.success("Logout successfuly");
      setUser(null);
      setAllThreads([]);
      setPrevChats([]);
      setReply(null);
      window.location.reload();
    } catch (err) {
      handleError(err);
    }
  };
// Send user prompt to backend and receive assistant response
const getReply = async () => {
  setFileBtn(false);
  setMenu(false);
// Prevent duplicate requests while current request is processing
if (loader) return;
    if (!prompt.trim()) return;
  // RAG mode requires at least one selected file
if (withRag && !selectedFiles.length) {
      toast.error("select file");
      return;
    }
    setNewChat(false);
    setLoader(true);

    try {
      if (!user) {
        navigate("/signin");
        return;
      }
      const res = await sendMessage(
        prompt,
        currThreadId,
        withRag,
        selectedFiles,
      );
      setReply(res.reply);
    } catch (err) {
      handleError(err);
    } finally {
      setLoader(false);
    }
  };
// Save latest user message and assistant response to chat history
useEffect(() => {
    if (prompt && reply) {
      setPrevChats((prevChats) => [
        ...prevChats,
        {
          role: "user",
          content: prompt,
        },
        {
          role: "assistant",
          content: reply,
        },
      ]);
    }

    setPrompt("");
  }, [reply]);
  // Disable RAG automatically when all files are removed
useEffect(() => {
  if (!files?.length) {
    setWithRag(false);
  }
}, [files]);
  return (
    <div className="chatwindow">
      <div className="navbar">
        <span onClick={toggleBar}>
        {showSidebar ?<i className="fa-solid fa-xmark"></i>:<i className="fa-solid fa-bars"></i>}  &nbsp; Matrix Ai 
        </span>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ margin: "5px" }}>Rag</span>
          <label className="switch">
            <input type="checkbox" onChange={toggleRag} checked={withRag} />
            <span className="slider round"></span>
          </label>
        </div>
        <div className="userIconDiv" onClick={togglrMenu}>
          <span>
            <i className="fa-solid fa-user"></i>
          </span>
          {menu && (
            <div className="menu">
              <div className="menuList">
                {user ? (
                  <>
                    <p className="userName">
                      <i className="fa-solid fa-user"></i>
                      &nbsp;&nbsp; {user.username}
                      <br />
                      <span className="email-info">{user.email}</span>
                    </p>
                    <div className="menu-li" onClick={logout}>
                      <span>
                        <i className="fa-solid fa-right-from-bracket"></i>
                      </span>{" "}
                      &nbsp;&nbsp; log out
                    </div>
                    <div className="menu-li">
                    <button className="dltbtn" onClick={dltac}>Dlt AC</button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="menu-li">
                      <Link to="/signup">
                        <span>
                          <i className="fa-solid fa-user-plus"></i>
                        </span>{" "}
                        &nbsp;&nbsp; sign up
                      </Link>
                    </div>
                    <div className="menu-li">
                      <Link to="/signin" className="nav-link">
                        <span>
                          <i className="fa-solid fa-arrow-right-to-bracket"></i>
                        </span>{" "}
                        &nbsp;&nbsp; sign in
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
{/* Main chat messages area */}
<Chat />

      <div>
    {/* Loading animation while waiting for assistant response */}
<DNA
          visible={loader}
          height={300}
          width={300}
          ariaLabel="dna-loading"
          wrapperClass="dna-wrapper"
        />
      </div>
      <div className="chatInput">
        <div className="inputBox">
       {/* File upload and selection menu */}
<div className="files">
            <i
              className="fa-regular fa-folder-open"
              onClick={() => {
                setFileBtn(!fileBtn);
              }}
            ></i>
            {fileBtn && <Filemenu></Filemenu>}
          </div>
   {/* User prompt input */}
<input
            name="promt"
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") getReply();
            }}
          />

          <div id="submit" onClick={getReply}>
            <i className="fa-solid fa-paper-plane"></i>
          </div>
        </div>

        <p className="info">
          MatrixAi can make mistakes. Check important info.
        </p>
      </div>
    </div>
  );
}

export default ChatWindow;
