import { useParams } from "react-router";
import { IoMdSend } from "react-icons/io";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { createSocketConnection } from "../utils/socket";
import Cookies from 'js-cookie'
import { BASE_URL } from "../utils/constants";
import axios from "axios";

const Chat = () => {
    const params = useParams();
    const receiverId = params?.userId;

    const user = useSelector(store => store.user);
    const connections = useSelector(store => store.connections);

    const targetUser = connections?.filter((user) => user._id === params.userId)[0];

    const [chats, setChats] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [newMsgAlert, setNewMsgAlert] = useState(false);


    const token = Cookies.get('token');


    const handleSendMessage = () => {
        const socket = createSocketConnection();

        if (!user || !receiverId) return;
        // emit event syntax : socket.emit("eventName",{key:value (what ever data we want to pass)},()=>{})
        socket.emit("sendMessage", {
            message: newMessage,
            senderId: user?._id,
            receiverId,
            senderName: `${user?.firstName} ${user?.lastName}`,
            token,
        });
        setNewMessage("");
    }


    useEffect(() => {

        if (!user?._id || !receiverId) return;
        const fetchChats = async () => {
            const res = await axios.get(`${BASE_URL}/chats/${receiverId}`, { withCredentials: true })
            setChats(res.data.messages);
            setNewMsgAlert(false);
        }
        fetchChats();
        const { _id, firstName, lastName } = user;
        const socket = createSocketConnection();
        socket.emit("joinChat", {
            senderId: _id,
            receiverId,
            token,
            senderName: `${firstName} ${lastName}`,
        });

        socket.on("messageReceived", ({ senderId, senderName, message }) => {
            setChats((prev) => [...prev, { senderName, message, senderId }]);
            if (senderId != user._id) {
                setNewMsgAlert(true);
                setTimeout(()=>{
                    setNewMsgAlert(false);
                },3000)
            }
        })

        return (() => {
            socket.disconnect();
        })
    }, [user, receiverId])


    return (
        <div className=" w-9/10 sm:w-1/2 flex flex-col h-96 mx-auto my-8 bg-base-300 px-2 py-8 rounded-2xl">
            {/*  chat heading */}
            <div className="mx-auto ">
                <h1 className="mx-auto text-3xl font-semibold">Chat {targetUser?.firstName ? `with ${targetUser?.firstName}` : ""}</h1>
            </div>

            {/*  chats section */}
            <div className="flex-1 flex flex-col overflow-y-auto">

                {chats.map((chat) => {
                    return (
                        <div key={chat._id}
                            className={chat?.senderId?._id === user?._id || chat?.senderId === user?._id
                                ? "chat chat-end  " : "chat chat-start  "}>
                            <div className="chat-header"> {chat.senderName} </div>
                            <div className="chat-bubble chat-bubble-primary">{chat?.text?.trim() || chat?.message?.trim()}</div>
                        </div>)

                })}

            </div>

            {newMsgAlert && (
                <div className="text-center">
                    <span className="badge badge-primary">
                        New message
                    </span>
                </div>
            )}

            <div className="bg-base-200 rounded-2xl p-2 flex mt-2">
                <input type="text"
                    placeholder="enter text" className="p-1 flex-1"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button className="text-2xl "
                    onClick={handleSendMessage}
                >
                    <IoMdSend />
                </button>
            </div>
        </div>
    )
}
export default Chat;