import React from "react";
import { useSession } from "../Context/SessionContext";
import AddConnection from "./AddConnection";
import { useSocket } from "../Context/SocketContext";

export default function Contacts(props) {
  const {
    user,
    // setUser,
    // conversation,
    setConversation,
    contactsList,
    currConversation,
    setCurrConversation,
  } = useSession();
  const { socket } = useSocket();

  const openConversation = async (contact) => {
    if (currConversation.username !== contact.username) {
      const roomId = (await contact.isLive)
        ? contact.roomId
        : `${contact.username}${user.username}`;
      const userData = {
        userId: user._id,
        recipientId: contact._id,
        isLive: true,
        roomId: roomId,
      };
      socket.emit("join room", userData);
      setCurrConversation(() => {
        return { ...contact, roomId: userData.roomId };
      });
      // console.log(roomId);
      socket.on("chat history", (messages) => {
        console.log(messages);
        setConversation(messages);
      });
    }

    // fetch(process.env.REACT_APP_PORT_SERVER + "/messages/" + contact._id, {
    //   method: "GET",
    //   credentials: "include",
    //   // "Access-Control-Allow-Origin": "http://port.contact/",
    // })
    //   .then((res) => res.json())
    //   .then((res) => {
    //     setConversation(res);
    //     // console.log(res);
    //   })
    //   .catch((err) => console.log(err));
  };

  // const deleteConnection = (contact) => {
  //   fetch(`${process.env.REACT_APP_PORT_SERVER}/connections/`, {
  //     method: "DELETE",
  //     headers: { "Content-Type": "application/json" },
  //     credentials: "include",
  //     body: JSON.stringify(contact),
  //   })
  //     .then((res) => res.json())
  //     .then((res) => {
  //       if (res.success === true) {
  //         console.log(res.updatedContact);
  //         setUser((prevUser) => {
  //           return { ...prevUser, connections: res.updatedContacts };
  //         });
  //       } else {
  //         console.log(res.message);
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error: ", error);
  //     });
  //   // console.log(c);
  //   // const index = usersList.indexOf(user);
  //   // setUsersList((prev) => prev.slice(index, 1));
  // };

  const contactClass = (contact) => {
    if (contact.isLive) {
      return "live-contact";
    } else if (contact.isOnline) {
      return "online-contact";
    } else {
      return "";
    }
  };

  return (
    <div className="connections">
      {/* <button onClick={() => console.log(socket.id, contactsList)}>
        Log list
      </button> */}
      <AddConnection />
      {contactsList &&
        contactsList.map((contact, index) => (
          <div key={index} className="contact">
            <span
              onClick={() => openConversation(contact)}
              className={contactClass(contact)}
            >
              {contact.username}
            </span>
            {/* <button
              className="delete-user-button"
              onClick={() => deleteConnection(contact)}
            >
              x
            </button> */}
          </div>
        ))}
    </div>
  );
}
