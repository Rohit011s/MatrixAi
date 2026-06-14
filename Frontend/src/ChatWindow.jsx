import "./ChatWindow.css";
import Chat from "./Chat";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import { DNA } from "react-loader-spinner";

function ChatWindow() {
  const {
    prompt,
    setPrompt,
    reply,
    setNewChat,
    setReply,
    currThreadId,
    setPrevChats,
  } = useContext(MyContext);

  const [loader, setLoader] = useState(false);

  const getReply = async () => {
    if (!prompt.trim()) return;

    setNewChat(false);
    setLoader(true);

    try {
      const response = await fetch("http://localhost:8080/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: prompt,
          threadId: currThreadId,
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

        <div className="userIconDiv">
          <span>
            <i className="fa-solid fa-user"></i>
          </span>
        </div>
      </div>

      <Chat />

      <DNA
        visible={loader}
        height="80"
        width="80"
        ariaLabel="dna-loading"
        wrapperClass="dna-wrapper"
      />

      <div className="chatInput">
        <div className="inputBox">
          <input
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