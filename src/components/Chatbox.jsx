import { ArrowRight, Bot } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useChatContext } from "../context/ChatContext";
import ChatMessage from "./ChatMessage";

const Chatbox = () => {
    const [input, setInput] = useState("");
    const { sendMessage } = useChatContext();
    const { chats, currentChatId, isTyping } = useChatContext();
    const currentChat = chats.find((chat) => chat.id === currentChatId);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [currentChat?.messages]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        sendMessage(input);
        setInput("");
    };

    return (
        <div className="chatbox">
            <div className="mb-3 mx-auto message-box no-scrollbar">
                {
                    currentChat.messages.map((message) => {
                        return (
                            <ChatMessage key={message.id} message={message} />
                        )
                    })
                }
                {
                    isTyping && (
                        <div className='d-flex'>
                            <Bot className="me-2 mt-3 text-success" size={24} />
                            <div className="d-flex justify-content-start">
                                <img src='/typing.svg' alt="Thinking..." style={{ width: '3rem' }} />
                            </div>
                        </div>
                    )
                }

                <div ref={messagesEndRef} />
            </div>
            <form className="mx-auto position-relative form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    className="w-100 p-2 rounded-2 border-0 input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button
                    type="submit"
                    className="position-absolute d-flex p-1 border-0 rounded-1 submit-btn"
                >
                    <ArrowRight className="text-white" size={20} />
                </button>
            </form>
        </div>
    );
};

export default Chatbox;
