import  request  from "./api";
// api to send and get response of assistant
export const sendMessage = (message, threadId,rag,selectedfiles) =>
  request("/api/chat", {
    method: "POST",
    body: JSON.stringify({
      message,
      threadId,
      rag,
      selectedfiles
    }),
  });
//get all threads of user
export const getThreads = () =>
  request("/api/thread");
//delete particular thread from threads of user
export const deleteThread = (id) =>
  request(`/api/thread/${id}`, {
    method: "DELETE",
  });
//get all msg of thread
 export const getThreadMsg = (id) =>
  request(`/api/thread/${id}`);