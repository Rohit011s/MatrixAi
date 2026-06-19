import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "../context/MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import { DNA } from "react-loader-spinner";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Filemenu from "./Filemenu.jsx";
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
    setUser,
    setAllThreads,
    selectedFiles,
  } = useContext(MyContext);
  const [menu, setMenu] = useState(false);
  const [fileBtn, setFileBtn] = useState(false);
  const [loader, setLoader] = useState(false);
  const [withRag, setWithRag] = useState(false);
  const navigate = useNavigate();
  const togglrMenu = () => {
    setMenu(!menu);
  };
  const toggleRag = () => {
    setWithRag(!withRag);
    console.log(withRag);
  };
  const logout = async () => {
    const response = await fetch("http://localhost:8080/api/logout", {
      method: "POST",
      credentials: "include",
    });

    if (response.ok) {
      console.log("logout clicked");
      setUser(null);
      setAllThreads([]);
      setPrevChats([]);
      setReply(null);

      window.location.reload();
    }
  };
  const getReply = async () => {
    if (!prompt.trim()) return;
    setNewChat(false);
    setLoader(true);

    try {
      console.log(user);
      if (!user) {
        navigate("/signin");
        return;
      }
      const response = await fetch("http://localhost:8080/api/chat", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: prompt,
          threadId: currThreadId,
          rag: withRag,
          selectedfiles: selectedFiles,
        }),
      });

      const res = await response.json();
      setReply(res.reply);
    } catch (err) {
      console.log(err);
    } finally {
      setLoader(false);
    }
  };

  // Add the latest user message and AI reply to chat history
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

  return (
    <div className="chatwindow">
      <div className="navbar">
        <span>
          Matrix Ai <i className="fa-solid fa-sort-down"></i>
        </span>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ margin: "5px" }}>Rag</span>
          <label className="switch">
            <input type="checkbox" onChange={toggleRag} />
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

      <Chat />

      <div>
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
          <div className="files">
            <i
              className="fa-regular fa-folder-open"
              onClick={() => {
                setFileBtn(!fileBtn);
              }}
            ></i>
            {fileBtn && <Filemenu></Filemenu>}
          </div>
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
