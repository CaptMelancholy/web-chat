import React from "react";
import socket from '../socket';


export default function Connection() {
  return (
    <>
      <div className="form__field">
        <input
          type="text"
          className="field__input"
          id="room_ID"
          placeholder="Room ID"
          required
        />
        <label for="room_ID" className="field__label">
          Room ID
        </label>
      </div>
      <div className="form__field">
        <input
          type="text"
          className="field__input"
          id="name"
          placeholder="User Name"
          required
        />
        <label for="name" className="field__label">
          User Name
        </label>
      </div>
      <div className="button__container">
        <button className="button">Connect</button>
      </div>
    </>
  );
}
