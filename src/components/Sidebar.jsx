import { MessageSquare, Plus, Trash, X } from "lucide-react";
import { useChatContext } from "../context/ChatContext";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
    const { chats, currentChatId, createNewChat, deleteChat, setCurrentChatId } = useChatContext();

    return (
        <div className={`sidebar ${isSidebarOpen ? "show" : ""}`}>
            <div className="w-100 d-flex align-items-center justify-content-between px-3 py-2 mb-2 rounded-3 sidebar-top">
                <div className="d-flex align-items-center gap-2">
                    <img src="/chatgpt.svg" alt="logo" className="logo" />
                    <div className="fs-5 text-white">Chatbot</div>
                </div>
                <X className="text-white x" onClick={() => setIsSidebarOpen(false)} />
            </div>

            <div className="w-100 p-3 rounded-3 sidebar-main">
                <div className="chats no-scrollbar">
                    {chats.map((chat) => (
                        <div
                            key={chat.id}
                            className={`w-100 d-flex align-items-center justify-content-between rounded-1 py-2 px-3 mb-2 text-white chat ${currentChatId === chat.id ? 'active' : ''}`}
                            onClick={() => setCurrentChatId(chat.id)}
                        >
                            <div className="d-flex align-items-center gap-2">
                                <MessageSquare size={20} className="mt-1" />
                                <div>{chat.title}</div>
                            </div>
                            <Trash
                                size={20}
                                className="trash"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteChat(chat.id);
                                }}
                            />
                        </div>
                    ))}
                </div>
                <button className="w-100 border-0 d-flex align-items-center justify-content-between rounded-1 py-2 ps-3 pe-2 new-chat-btn" onClick={createNewChat}>
                    <div>New Chat</div>
                    <div className="bg-white rounded-1 p-1 d-flex">
                        <Plus size={20} />
                    </div>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
