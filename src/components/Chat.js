import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import ChatInterface from "./Interface";
import { v4 as uuidv4 } from "uuid";
import { formatDate } from "@/utils/helpers";

const Chat = () => {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState("");

  const handleNewChat = () => {
    const newChat = { id: uuidv4(), messages: [], date: formatDate(new Date()), sessionId: "", title: "New chat" };
    setChats([...chats,newChat]);
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
    const defaultChat = { id: uuidv4(), messages: [], date: formatDate(new Date()), sessionId: "", title: "New chat" };
    setChats([defaultChat]);
    setActiveChatId(defaultChat.id);
  }, []);

  return (
    <div className="flex">
      <Sidebar handleNewChat={handleNewChat} chats={chats} activeChatId={activeChatId} onSelectChat={handleSelectChat} handleDeleteChat={handleDeleteChat} />
      {chats.length > 0 && <ChatInterface chat={chats.find((chat) => chat.id === activeChatId)} setChats={setChats} />}
    </div>
  );
};

export default Chat;
