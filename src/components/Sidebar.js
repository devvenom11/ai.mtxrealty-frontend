import { CrossIcon, Hamburger, NewChatIcon } from "@/icons/Icons";
import { useState } from "react";



const Sidebar = ({ handleNewChat, chats, activeChatId, onSelectChat, handleDeleteChat }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
  <div className="sm:hidden p-4 absolute z-50 top-[18px]">
    <div onClick={toggleSidebar} className="cursor-pointer">
      {isOpen ? <CrossIcon /> : <Hamburger />}
    </div>
  </div>

  <div
    style={{ zIndex: 10 }}
    className={`w-[260px] h-[calc(100vh-92px)] shadow-md dark:border-r border-gray-700 bg-white dark:bg-[#212121] transition-transform duration-300 ease-in-out ${
      isOpen ? "translate-x-0" : "-translate-x-full"
    } sm:translate-x-0 fixed sm:relative`}
  >
    <div className="flex items-center justify-between mt-[20px] px-4">
      <h3 className="pl-[30px] sm:pl-0 pr-4 py-2 text-lg font-semibold dark:text-gray-100">Chats</h3>
      <div className="icon-xl-heavy cursor-pointer text-gray-800 dark:text-gray-400" onClick={handleNewChat}>
        <NewChatIcon />
      </div>
    </div>

    <div className="mt-4">
      <ul>
        {chats.map((chat) => (
          <li
            key={chat.id}
            className={`relative group px-4 py-2 cursor-pointer rounded-lg ml-[15px] flex justify-between items-center ${
              activeChatId === chat.id
                ? "bg-gray-100 dark:bg-[#2f2f2f]"
                : "hover:bg-gray-100 dark:hover:bg-[#2f2f2f] ease-linear duration-200"
            }`}
            onClick={() => onSelectChat(chat.id)}
          >
            <span className="capitalize dark:text-gray-100">{chat.title}</span>
            {chats.length > 1 && (
              <TrashIcon id={activeChatId} callback={handleDeleteChat} />
            )}
          </li>
        ))}
      </ul>
    </div>
  </div>

  <style jsx>{`
    .dots {
      opacity: 0;
    }
    li:hover .dots {
      opacity: 1;
    }
  `}</style>
</div>

  );
};

export default Sidebar;

const TrashIcon = ({ id, callback }) => {
  return (
    <svg
      onClick={() => callback(id)}
      className="absolute right-2 hidden text-gray-600 dark:text-gray-300 group-hover:block icon icon-tabler icons-tabler-outline icon-tabler-trash"
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M4 7l16 0" />
      <path d="M10 11l0 6" />
      <path d="M14 11l0 6" />
      <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
      <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
    </svg>
  );
};
