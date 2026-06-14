import "./Chat.css";
import { MyContext } from "./MyContext.jsx";
import { useContext, useEffect, useState } from "react";
import rehypeHighlight from "rehype-highlight";
import Markdown from "react-markdown";
import "highlight.js/styles/github-dark.css";

function Chat() {
  const { prevChats, newChat, reply,lastReply, setLastReply } = useContext(MyContext);

  

  useEffect(() => {
    if (!prevChats?.length || !reply) return;

    const content = reply.split(" ");
    let idx = 0;

    const interval = setInterval(() => {
      setLastReply(content.slice(0, idx + 1).join(" "));
      idx++;

      if (idx >= content.length) {
        clearInterval(interval);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [prevChats, reply]);

  return (
    <>
      {newChat && <h1>Let start new chat !!</h1>}

      <div className="chats scrollbar">
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

        {prevChats.length > 0 && lastReply !== null && (
          <div className="gptDiv">
            <Markdown rehypePlugins={[rehypeHighlight]}>
              {lastReply}
            </Markdown>
          </div>
        )}

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