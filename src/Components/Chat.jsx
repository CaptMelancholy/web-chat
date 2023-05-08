import React, { useEffect, useRef } from "react";
import socket from "../socket";

export default function Chat({ users, messages, roomID, userName, onAddMessage }) {
  const [messageValue, setMessageValue] = React.useState("");

  const messagesRef = useRef(null);

  const onKeyDownHandler = e => {
    if(e.code === 'Enter' && !e.shiftKey)
    {
      onSendMessage();
    }
  }

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
    socket.emit("ROOM:NEW_MESSAGE", {
      roomID,
      userName,
      text: messageValue,
      time: getTime(),
    });
    onAddMessage({
      userName,
      text: messageValue,
      time: getTime(),
    });
    setMessageValue('');
  };


  useEffect(() => {
    messagesRef.current.scrollTo(0, 99999);
  }, [messages]);

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
          {messages.map((message) => (
            <div className="message">
              <p> {message.text}</p>
              <div>
                <span>
                  {message.userName} - {message.time}
                </span>
              </div>
            </div>
          ))}
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
          <button onClick={onSendMessage} type="button" className="button">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
