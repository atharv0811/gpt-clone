import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const ChatContext = createContext(undefined)

const STORAGE_KEY = 'chats';
const CURRENT_CHAT_KEY = 'current_chat';

function loadChatsFromStorage() {
    const storedChats = localStorage.getItem(STORAGE_KEY);
    if (storedChats) {
        const chats = JSON.parse(storedChats);
        return chats.map((chat) => ({
            ...chat,
            messages: chat.messages.map((msg) => ({
                ...msg,
            })),
        }));
    }
    return [
        {
            id: '1',
            title: 'New chat',
            messages: [
                {
                    id: (Date.now() + 1).toString(),
                    content: "Hi! How can I help you?",
                    isUser: false,
                }
            ],
        },
    ];
}

function loadCurrentChatFromStorage() {
    return localStorage.getItem(CURRENT_CHAT_KEY) || '1';
}

const ChatProvider = ({ children }) => {
    const [chats, setChats] = useState(loadChatsFromStorage);
    const [currentChatId, setCurrentChatId] = useState(loadCurrentChatFromStorage);
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
    }, [chats]);

    useEffect(() => {
        localStorage.setItem(CURRENT_CHAT_KEY, currentChatId);
    }, [currentChatId]);

    const createNewChat = () => {
        const newChat = {
            id: Date.now().toString(),
            title: 'New chat',
            messages: [],
        };
        setChats((prev) => [...prev, newChat]);
        setCurrentChatId(newChat.id);

        setIsTyping(true);

        setTimeout(() => {
            setChats((prev) =>
                prev.map((chat) =>
                    chat.id === newChat.id
                        ? {
                            ...chat,
                            messages: [
                                ...chat.messages,
                                {
                                    id: (Date.now() + 1).toString(),
                                    content: "Hi! How can I help you?",
                                    isUser: false,
                                },
                            ],
                        }
                        : chat
                )
            );
            setIsTyping(false);
        }, 2000);
    };

    const deleteChat = (chatId) => {
        setChats((prev) => prev.filter((chat) => chat.id !== chatId));
        if (currentChatId === chatId) {
            const remainingChats = chats.filter((chat) => chat.id !== chatId);
            if (remainingChats.length > 0) {
                setCurrentChatId(remainingChats[0].id);
            } else {
                createNewChat();
            }
        }
    };

    const sendMessage = async (content) => {
        const userMessage = {
            id: Date.now().toString(),
            content,
            isUser: true,
        };

        setChats((prev) =>
            prev.map((chat) => {
                if (chat.id === currentChatId) {
                    const isFirstMessage = chat.messages.length === 1;
                    return {
                        ...chat,
                        title: isFirstMessage ? content.slice(0, 17) + "..." : chat.title,
                        messages: [...chat.messages, userMessage],
                    };
                }
                return chat;
            })
        );

        try {
            setIsTyping(true)

            const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
                {
                    contents: [
                        {
                            parts: [
                                {
                                    text: content
                                }
                            ]
                        }
                    ]
                }
            );

            const aiMessage = {
                id: (Date.now() + 1).toString(),
                content: response.data.candidates[0].content.parts[0].text,
                isUser: false,
            };

            setChats((prev) =>
                prev.map((chat) =>
                    chat.id === currentChatId
                        ? { ...chat, messages: [...chat.messages, aiMessage] }
                        : chat
                )
            );
        } catch (error) {
            console.error("Error fetching the response:", error);
            setChats((prev) =>
                prev.map((chat) =>
                    chat.id === currentChatId
                        ? {
                            ...chat, messages: [...chat.messages, {
                                id: (Date.now() + 1).toString(),
                                content: "Sorry, I couldn't get a response right now.",
                                isUser: false,
                            }]
                        }
                        : chat
                )
            );
        } finally {
            setIsTyping(false)
        }
    }

    return (
        <ChatContext.Provider
            value={{
                chats,
                currentChatId,
                isTyping,
                createNewChat,
                deleteChat,
                sendMessage,
                setCurrentChatId,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
}

export default ChatProvider

export function useChatContext() {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error('useChatContext must be used within a ChatProvider');
    }
    return context;
}