import "../styles/pages/Home.css";
import { useState, useEffect, useContext } from "react";
import ChatWindow from "../components/ChatWindow";
import Chat from "../components/Chat";
import Sidebar from "../components/Sidebar";
import { MyContext } from "../context/MyContext";
import { getMe } from "../../services/authApi";
import handleError from "../utils/handleError";

function Home() {
  const { setUser } = useContext(MyContext);
  // Load authenticated user when application starts
  useEffect(() => {
    // Fetch current logged-in user
    const getCurrentUser = async () => {
      try {
        // Request user session information from backend
        const data = await getMe();
        // Store authenticated user in global state
        setUser(data.user);
      } catch (err) {
        handleError(err);
        // Clear user state when session is not valid
        if (err.status === 401) {
          setUser(null);
          return;
        }

        toast.error(err.message);
      }
    };

    // Execute user authentication check on component mount
    getCurrentUser();
  }, []);
  return (
    <div className="Home">
      <Sidebar />
      <ChatWindow />
    </div>
  );
}

export default Home;
