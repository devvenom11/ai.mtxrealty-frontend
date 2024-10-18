import { PlusIcon, SubmitArrow } from "@/icons/Icons";
import { auth } from "@/lib/firebase";
import { updateDocument } from "@/utils/helpers";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

const ChatInterface = ({ chat, setChats, chats }) => {
  const [input, setInput] = useState("");
  const [height, setHeight] = useState(0);
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

  useEffect(() => {
    const updateHeight = () => {
      setHeight(window.innerHeight - 170);
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  const extractURLsFromText = (answer) => {
    const urlRegex = /(https?:\/\/[^\s]+|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/[^\s]*)?)/g; // Match URLs with or without protocol
    const url = answer.match(urlRegex); // Extract URL if present

    const clickableUrl = url ? (url[0].startsWith("http") ? url[0] : `https://${url[0]}`) : null;

    const response = answer.replace(urlRegex, `[${clickableUrl}](${clickableUrl})`);

    return response;
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim()) {
      const userMessage = input;
      setInput("");

      const updatedMessages = [...chat.messages, { text: userMessage, sender: "user" }];
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
          const text = extractURLsFromText(data.answer);
          simulateBotTyping(text, updatedMessages, data.session_id, chat.id, data.youtube_url);
        } else {
          console.error("API call failed with status:", response.status);
          simulateBotTyping("Something went wrong. Please try again later.", updatedMessages, chat.sessionId, chat.id);
        }
      } catch (error) {
        console.error("Error:", error);
        simulateBotTyping("Error connecting to the server. Please try again.", updatedMessages, chat.sessionId, chat.id);
      }
    }
  };

  const simulateBotTyping = (text, chats, sessionId, chatId, url) => {
    let currentMessage = "";
    let index = 0;

    const interval = setInterval(() => {
      if (index < text.length && !text.startsWith("<")) {
        currentMessage += text.charAt(index);
        updateChatMessages(chats, true, currentMessage, chatId, sessionId, url);
        index++;
      } else {
        clearInterval(interval);
        const updatedMessages = [...chats, { text, sender: "bot", url }];
        updateChatMessages(updatedMessages, false, "", chatId, sessionId, "");
      }
    }, 20);
  };

  const getTitle = (text) => {
    function containsGreeting(text) {
      const greetings = /\b(hello|hi|hey|greetings|good\s*morning|good\s*afternoon|good\s*evening)\b/i;
      return greetings.test(text);
    }
    if (containsGreeting(text)) {
      return "Greetings from user";
    } else {
      return text.length > 26 ? text.slice(0, 26) + "..." : text;
    }
  };

  const updateChatMessages = (updatedMessages, isTyping, botMessage, chatId, sessionId, url) => {
    const updatedChats = chats.map((c) =>
      c.id === chatId
        ? {
            ...c,
            messages: updatedMessages,
            isTyping: isTyping,
            url,
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
    <div style={{ height: `${height}px` }} className="w-full overflow-y-auto bg-white dark:bg-[#212121] text-gray-900 dark:text-gray-100">
      <div className="flex flex-col w-full max-w-2xl mx-auto relative">
        <div className="flex-1 p-4 pt-6">
          {chat?.messages?.map((message, index) =>
            message.sender === "user" ? (
              <div key={index} className="mb-4 flex">
                <div className="bg-gray-200 dark:bg-[#2f2f2f] flex size-[25px] shrink-0 select-none items-center justify-center rounded-md border shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" className="size-4">
                    <path d="M230.92 212c-15.23-26.33-38.7-45.21-66.09-54.16a72 72 0 1 0-73.66 0c-27.39 8.94-50.86 27.82-66.09 54.16a8 8 0 1 0 13.85 8c18.84-32.56 52.14-52 89.07-52s70.23 19.44 89.07 52a8 8 0 1 0 13.85-8ZM72 96a56 56 0 1 1 56 56 56.06 56.06 0 0 1-56-56Z" />
                  </svg>
                </div>
                <div className="ml-4 flex-1 space-y-2 overflow-hidden pl-1 title">{message.text}</div>
              </div>
            ) : (
              <div key={index} className={`mb-4 pb-4 flex ${index !== chat?.messages?.length - 1 ? "border-b border-gray-300 dark:border-gray-700" : ""}`}>
                <div className="bg-white dark:invert flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border shadow-sm p-0.5">
                  <BotIcon />
                </div>
                <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
                  <div className="answers flex flex-col gap-2">
                    {message.url && (
                      <a className="pb-2" href={message.url} target="_blank" rel="noreferrer">
                        {message.url}
                      </a>
                    )}
                    <ReactMarkdown>{message.text}</ReactMarkdown>
                  </div>
                </div>
              </div>
            )
          )}

          {chat?.isTyping && (
            <div className="mb-4 flex justify-start">
              <div className="bg-white dark:invert flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border shadow-sm p-0.5">
                <BotIcon />
              </div>
              <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
                {chat.botMessage ? (
                  <div className="answers flex flex-col gap-2">
                    {chat.url && (
                      <a className="pb-2" href={chat.url} target="_blank" rel="noreferrer">
                        {chat.url}
                      </a>
                    )}
                    <ReactMarkdown>{chat.botMessage}</ReactMarkdown>
                  </div>
                ) : (
                  <span className="animate-blink">|</span>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="sm:fixed z-50 bottom-3 sm:w-[672px] bg-white dark:bg-[#2f2f2f] dark:border-gray-700 space-y-4 border-t px-4 mx-4 sm:mx-0 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4">
          <form onSubmit={handleSendMessage}>
            <div className="bg-background relative flex max-h-60 w-full grow flex-col overflow-hidden sm:rounded-md sm:border dark:border-gray-700">
              <textarea
                tabIndex={0}
                placeholder="Send a message."
                className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm overflow-hidden text-gray-900 dark:text-gray-100 dark:bg-[#212121]"
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
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-[#212121] dark:bg-[#2f2f2f] text-white shadow hover:bg-[#2f2f2f] dark:hover:bg-gray-600 h-9 w-9"
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
    </div>
  );
};
export default ChatInterface;

const BotIcon = () => {
  return (
    <svg version={1.0} xmlns="http://www.w3.org/2000/svg" width="200.000000pt" height="150.000000pt" viewBox="0 0 200.000000 150.000000" preserveAspectRatio="xMidYMid meet">
      <g transform="translate(0.000000,150.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
        <path
          d="M1747 1376 l-59 -123 47 -93 c25 -51 48 -90 50 -89 1 2 51 100 109
217 l106 212 -98 0 -97 0 -58 -124z"
        />
        <path
          d="M2 978 l3 -383 72 -3 73 -3 2 278 3 278 54 -277 55 -278 67 0 c56 0
69 3 73 18 3 9 25 125 51 257 25 132 49 249 54 260 5 12 9 -92 10 -255 l0
-275 71 -3 70 -3 0 386 0 385 -118 0 -119 0 -44 -234 c-24 -129 -45 -233 -47
-232 -2 2 -21 98 -43 212 -21 115 -41 219 -44 232 -5 21 -9 22 -125 22 l-120
0 2 -382z"
        />
        <path
          d="M740 1265 l0 -95 90 0 90 0 0 -290 0 -290 90 0 90 0 0 290 0 290 90
0 90 0 0 95 0 95 -270 0 -270 0 0 -95z"
        />
        <path
          d="M1330 1355 c0 -3 41 -87 90 -186 l91 -181 -129 -251 -130 -252 -626
-3 -626 -2 0 -45 0 -45 985 0 985 0 0 45 0 45 -258 2 -258 3 84 175 85 174 61
-122 61 -122 98 0 98 0 -33 63 c-19 34 -112 207 -207 385 l-174 322 -99 0
c-54 0 -98 -2 -98 -5z"
        />
        <path
          d="M20 135 c0 -83 4 -135 10 -135 6 0 10 27 10 60 0 33 4 60 9 60 6 0
29 -27 52 -60 23 -33 48 -60 55 -60 20 0 18 7 -22 63 -21 29 -32 53 -26 55 6
2 22 12 36 23 30 24 35 72 10 107 -13 19 -24 22 -75 22 l-59 0 0 -135z m110
91 c6 -8 10 -25 8 -38 -3 -20 -10 -23 -50 -26 l-48 -3 0 40 c0 41 0 41 39 41
21 0 44 -6 51 -14z"
        />
        <path
          d="M400 135 l0 -135 70 0 c56 0 70 3 70 15 0 12 -13 15 -55 15 l-55 0 0
50 0 50 55 0 c42 0 55 3 55 15 0 12 -13 15 -55 15 l-55 0 0 40 0 40 55 0 c42
0 55 3 55 15 0 12 -14 15 -70 15 l-70 0 0 -135z"
        />
        <path
          d="M801 151 c-68 -159 -65 -151 -49 -151 8 0 24 20 36 45 21 44 23 45
71 45 49 0 49 0 68 -45 10 -25 24 -45 31 -45 6 0 12 4 12 8 0 12 -100 246
-109 255 -5 5 -31 -46 -60 -112z m75 13 c18 -43 16 -46 -24 -42 l-30 3 15 38
c8 20 17 37 20 37 2 0 11 -16 19 -36z"
        />
        <path
          d="M1170 135 l0 -135 60 0 c47 0 60 3 60 15 0 11 -12 15 -45 15 l-45 0
0 120 c0 100 -2 120 -15 120 -13 0 -15 -22 -15 -135z"
        />
        <path
          d="M1482 258 c3 -7 17 -14 31 -16 l27 -3 0 -120 c0 -73 4 -119 10 -119
6 0 10 47 10 120 l0 120 25 0 c16 0 25 6 25 15 0 12 -14 15 -66 15 -48 0 -65
-3 -62 -12z"
        />
        <path
          d="M1839 196 c35 -65 41 -83 41 -136 0 -33 4 -60 10 -60 6 0 10 27 10
61 0 53 6 72 41 136 35 63 38 74 23 71 -11 -1 -30 -24 -44 -51 -14 -26 -27
-47 -30 -47 -3 0 -16 21 -30 47 -14 27 -33 50 -44 51 -16 3 -12 -8 23 -72z"
        />
      </g>
    </svg>
  );
};
