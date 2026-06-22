import "../styles/components/Chat.css";
import { MyContext } from "../context/MyContext.jsx";
import { useContext, useEffect, useState } from "react";
import rehypeHighlight from "rehype-highlight";
import Markdown from "react-markdown";
import "highlight.js/styles/github-dark.css";

function Chat() {
  const { prevChats, newChat, reply, lastReply, setLastReply } =
    useContext(MyContext);

  // Typing animation effect for latest AI response
  useEffect(() => {
    if (!prevChats.length || !reply) return;
    // split word by word
    const content = reply.split(" ");
    let idx = 0;

    const interval = setInterval(() => {
      setLastReply(content.slice(0, idx + 1).join(" "));
      // speed
      idx += 3;
      {
        /* Show full latest message when animation is not active */
      }
      if (idx >= content.length) {
        setLastReply(reply);
        clearInterval(interval);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [prevChats, reply]);

  return (
    <>
      {newChat && <h1>Let start new chat !!</h1>}

      <div className="chats scrollbar">
        {/* Render all messages except the latest assistent message */}
        {prevChats?.slice(0, -1).map((chat, idx) => (
          <div
            className={chat.role === "user" ? "userDiv" : "gptDiv"}
            key={idx}
          >
            {chat.role === "user" ? (
              <p className="userMsg">{chat.content}</p>
            ) : (
              <Markdown rehypePlugins={[rehypeHighlight]}>
                {chat.content}
              </Markdown>
            )}
          </div>
        ))}
        {/* Display latest assistant message with typing animation */}
        {prevChats.length > 0 && lastReply !== null && (
          <div className="gptDiv">
            <Markdown rehypePlugins={[rehypeHighlight]}>{lastReply}</Markdown>
          </div>
        )}
        {/* Show full latest message when animation is not active */}
        {prevChats.length > 0 && lastReply === null && (
          <div className="gptDiv">
            <Markdown rehypePlugins={[rehypeHighlight]}>
              {prevChats.slice(-1)[0].content}
            </Markdown>
          </div>
        )}
      </div>
    </>
  );
}

export default Chat;
