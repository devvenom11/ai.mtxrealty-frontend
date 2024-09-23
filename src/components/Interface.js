import { PlusIcon, SubmitArrow } from "@/icons/Icons";
import { auth } from "@/lib/firebase";
import { updateDocument } from "@/utils/helpers";
import { useState, useEffect } from "react";

const ChatInterface = ({ chat, setChats, chats }) => {
  const [input, setInput] = useState("");
  const [height, setHeight] = useState(0);
  const user = auth.currentUser;

  useEffect(() => {
    const updateHeight = () => {
      setHeight(window.innerHeight - 70);
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim()) {
      const userMessage = input;
      setInput("");

      const updatedMessages = [
        ...chat.messages,
        { text: userMessage, sender: "user" },
      ];
      updateChatMessages(updatedMessages, true, "", chat.id);

      try {
        const response = await fetch("/api/query", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: userMessage,
            session_id: chat.sessionId || "",
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const botResponse = data.answer || "I don't have an answer for that.";
          simulateBotTyping(
            botResponse,
            updatedMessages,
            data.session_id,
            chat.id
          );
        } else {
          console.error("API call failed with status:", response.status);
          simulateBotTyping(
            "Something went wrong. Please try again later.",
            updatedMessages,
            chat.sessionId,
            chat.id
          );
        }
      } catch (error) {
        console.error("Error:", error);
        simulateBotTyping(
          "Error connecting to the server. Please try again.",
          updatedMessages,
          chat.sessionId,
          chat.id
        );
      }
    }
  };

  const simulateBotTyping = (text, chats, sessionId, chatId) => {
    let currentMessage = "";
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        currentMessage += text.charAt(index);
        updateChatMessages(chats, true, currentMessage, chatId, sessionId);
        index++;
      } else {
        clearInterval(interval);
        const updatedMessages = [...chats, { text, sender: "bot" }];
        updateChatMessages(updatedMessages, false, "", chatId, sessionId);
      }
    }, 50);
  };

  const getTitle = (text) => {
    function containsGreeting(text) {
      const greetings =
        /\b(hello|hi|hey|greetings|good\s*morning|good\s*afternoon|good\s*evening)\b/i;
      return greetings.test(text);
    }
    if (containsGreeting(text)) {
      return "Greetings from user";
    } else {
      return text.length > 26 ? text.slice(0, 26) + "..." : text;
    }
  };

  const updateChatMessages = (
    updatedMessages,
    isTyping,
    botMessage,
    chatId,
    sessionId
  ) => {
    const updatedChats = chats.map((c) =>
      c.id === chatId
        ? {
            ...c,
            messages: updatedMessages,
            isTyping: isTyping,
            botMessage: botMessage,
            title: getTitle(updatedMessages[0].text),
            sessionId,
          }
        : c
    );
    setChats(updatedChats);
    if (user) {
      const payload = {
        chatHistory: updatedChats,
      };
      updateDocument("chat_history", user?.uid, payload);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        e.preventDefault();
        setInput((prevInput) => prevInput + "\n");
      } else {
        e.preventDefault();
        handleSendMessage(e);
      }
    }
  };

  return (
    <div
      style={{ height: `${height}px` }}
      className="flex flex-col w-full max-w-2xl mx-auto"
    >
      <div className="flex-1 p-4 pt-6 overflow-y-auto">
        {chat?.messages?.map((message, index) =>
          message.sender === "user" ? (
            <div key={index} className="mb-4 flex">
              <div className="bg-background flex size-[25px] shrink-0 select-none items-center justify-center rounded-md border shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  className="size-4"
                >
                  <path d="M230.92 212c-15.23-26.33-38.7-45.21-66.09-54.16a72 72 0 1 0-73.66 0c-27.39 8.94-50.86 27.82-66.09 54.16a8 8 0 1 0 13.85 8c18.84-32.56 52.14-52 89.07-52s70.23 19.44 89.07 52a8 8 0 1 0 13.85-8ZM72 96a56 56 0 1 1 56 56 56.06 56.06 0 0 1-56-56Z" />
                </svg>
              </div>
              <div className="ml-4 flex-1 space-y-2 overflow-hidden pl-1 title">
                {message.text}
              </div>
            </div>
          ) : (
            <div key={index} className="mb-4 flex">
              <div className="bg-primary text-primary-foreground flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border shadow-sm">
                <svg
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-4"
                >
                  <title>Bot icon</title>
                  <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
                </svg>
              </div>
              <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
                <p className="prose prose-p:leading-relaxed prose-pre:p-0 break-words">
                  {message.text}
                </p>
              </div>
            </div>
          )
        )}
        {chat?.isTyping && (
          <div className="mb-4 flex justify-start">
            <div className="bg-primary text-primary-foreground flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border shadow-sm">
              <svg
                fill="currentColor"
                viewBox="0 0 24 24"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                className="size-4"
              >
                <title>Bot typing</title>
                <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
              </svg>
            </div>
            <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
              <p className="prose prose-p:leading-relaxed prose-pre:p-0 break-words">
                {chat.botMessage}
                <span className="animate-blink">|</span>
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="bg-background space-y-4 border-t px-4 mx-4 sm:mx-0 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4">
        <form onSubmit={handleSendMessage}>
          <div className="bg-background relative flex max-h-60 w-full grow flex-col overflow-hidden px-8 sm:rounded-md sm:border sm:px-12">
            <button
              className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input shadow-sm hover:bg-accent hover:text-accent-foreground h-9 w-9 bg-background absolute left-0 top-[13px] size-8 rounded-full p-0 sm:left-4"
              data-state="closed"
            >
              <PlusIcon />
              <span className="sr-only">New Chat</span>
            </button>
            <textarea
              tabIndex={0}
              placeholder="Send a message."
              className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm overflow-hidden"
              spellCheck="false"
              autoComplete="off"
              autoCorrect="off"
              name="message"
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <div className="absolute right-0 top-[13px] sm:right-4">
              <button
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-gray-900 text-white shadow hover:bg-gray-700 h-9 w-9"
                type="submit"
                disabled={input.length < 2}
              >
                <SubmitArrow />
                <span className="sr-only">Send message</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
export default ChatInterface;
