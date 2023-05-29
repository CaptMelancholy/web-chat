import React, { useEffect, useRef } from "react";
import socket from "../socket";
import Image from "../image";

export default function Chat({
  users,
  messages,
  roomID,
  userName,
  onAddMessage,
}) {
  const [messageValue, setMessageValue] = React.useState("");
  const [fileValue, setFile] = React.useState("");
  const messagesRef = useRef(null);

  const onKeyDownHandler = (e) => {
    if (e.code === "Enter" && !e.shiftKey) {
      onSendMessage();
    }
  };

  function getTime() {
    var today = new Date();
    let date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    let time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let dateTime = date + " " + time;
    return dateTime;
  }

  const onSendMessage = () => {
    if (fileValue) {
      const messageObject = {
        roomID,
        userName,
        text: fileValue,
        time: getTime(),
        type: "file",
        mineType: fileValue.type,
        fileName: fileValue.name,
      };
      setMessageValue("");
    setFile();
      socket.emit("ROOM:NEW_MESSAGE", messageObject);
      onAddMessage({
        userName,
        text: fileValue,
        time: getTime(),
        type: "file", 
        mineType: fileValue.type,
        fileName: fileValue.name,
      });
    } 
    else {
      const messageObject = {
        roomID,
        userName,
        text: messageValue,
        time: getTime(),
        type: "text",
      };
      setMessageValue("");
      socket.emit("ROOM:NEW_MESSAGE", messageObject);
      onAddMessage({
        userName,
        text: messageValue,
        time: getTime(),
        type: "text",
      });
    }
    
  };

  const onSelect = (e) => {
    if (e.target.files[0].size > 1048576)
    {
      alert("File is too big. It's need to be less then 1 MB");
      e.target.value = "";
      return;
    }
    setMessageValue(e.target.files[0].name);
    setFile(e.target.files[0]);
  };

  useEffect(() => {
    messagesRef.current.scrollTo(0, 99999);
  }, [messages]);

  function renderMessages(message, index) {
    if (message.type === "file") {
      const blob = new Blob([message.text], { type: message.type });
      return (
        <div className="message">
          <p>
            <Image fileName={message.fileName} blob={blob} />
          </p>
          <div>
            <span>
              {message.userName} - {message.time}
            </span>
          </div>
        </div>
      );
    }

    return (
      <div className="message">
        <p> {message.text}</p>
        <div>
          <span>
            {message.userName} - {message.time}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="chat">
      <div className="chat-users">
        Room: <b>{roomID}</b>
        <hr />
        Online: <b>({users.length})</b>
        <ul>
          {users.map((name, index) => (
            <li key={name + index}>{name}</li>
          ))}
        </ul>
      </div>
      <div className="chat-messages">
        <div ref={messagesRef} className="messages">
          {messages.map(renderMessages)}
        </div>
        <form>
          <textarea
            className="form-control"
            rows="3"
            placeholder="Write a message..."
            onChange={(e) => setMessageValue(e.target.value)}
            value={messageValue}
            onKeyDown={onKeyDownHandler}
          ></textarea>
          <input onChange={onSelect} type="file" id="input-file"/>
          <label for="input-file">CHOOSE A FILE</label>
          <button onClick={onSendMessage} type="button" className="button">
            SEND
          </button>
        </form>
      </div>
    </div>
  );
}
