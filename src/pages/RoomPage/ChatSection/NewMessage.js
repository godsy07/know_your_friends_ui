import React, { useState } from 'react';
import SendMessageButton from "../../../assets/images/sendMessageButton.svg";
// import * as webRTCHandler from "../../../utils/WebRTCHandler";
import * as wss from "../../../utils/wss";
import { connect } from 'react-redux';

const NewMessage = ({ identity, roomId }) => {
    const [message, setMessage] = useState('');

    const hanldeTextChange = (e) => {
        setMessage(e.target.value);
    }

    const hanldeKeyPressed = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();

            // send message to other users
            sendMessage();
        }
    }

    const sendMessage = (e) => {
        if (message.length > 0) {
            // webRTCHandler.sendMessageUsingDataChannel(message);
            wss.sendMessage(identity,roomId,message);
            setMessage("");
        }
    }

  return (
    <div className='new_message_container'>
      <input
        className='new_message_input'
        value={message}
        onChange={hanldeTextChange}
        placeholder='Type your message ...'
        onKeyDown={hanldeKeyPressed}
      />
      <img
        className='new_message_button'
        src={SendMessageButton}
        alt="send message button"
        onClick={sendMessage}
      />
    </div>
  )
}

const mapStoreToStateProps = (state) => {
    return {
        ...state
    }
}

export default connect(mapStoreToStateProps)(NewMessage);
