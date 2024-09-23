import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import ChatInterface from "./Interface";
import { v4 as uuidv4 } from "uuid";
import { formatDate, getDocument } from "@/utils/helpers";
import { auth } from "@/lib/firebase";

const Chat = () => {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null); 
      }
    });
    return () => unsubscribe();
  }, []);

  const handleNewChat = () => {
    const newChat = {
      id: uuidv4(),
      messages: [],
      date: formatDate(new Date()),
      sessionId: "",
      title: "New chat",
    };
    setChats([...chats, newChat]);
    setActiveChatId(newChat.id);
  };

  const handleSelectChat = (chatId) => {
    setActiveChatId(chatId);
  };

  const handleDeleteChat = (id) => {
    let temp = chats.filter((c) => c.id !== id);
    setActiveChatId(temp[0].id);
    setChats(temp);
  };

  useEffect(() => {
    const defaultChat = {
      id: uuidv4(),
      messages: [],
      date: formatDate(new Date()),
      sessionId: "",
      title: "New chat",
    };
    const getHistory = async () => {
      const res = await getDocument("chat_history", user?.uid);
      if (res && res?.data?.chatHistory.length > 0) {
        setChats([defaultChat, ...res?.data?.chatHistory]);
        setActiveChatId(defaultChat.id);
      } else {
        setChats([defaultChat]);
        setActiveChatId(defaultChat.id);
      }
    };

    if (user) {
      getHistory();
    } else {
      setChats([defaultChat]);
      setActiveChatId(defaultChat.id);
    }
  }, [user]);

  return (
    <div className="flex">
      <Sidebar handleNewChat={handleNewChat} chats={chats} activeChatId={activeChatId} onSelectChat={handleSelectChat} handleDeleteChat={handleDeleteChat} />
      {chats.length > 0 && <ChatInterface chat={chats.find((chat) => chat.id === activeChatId)} setChats={setChats} chats={chats} />}
    </div>
  );
};

export default Chat;
