import React from 'react';
import { connect } from 'react-redux';

// const messages = [
//     {
//         content: "Hi",
//         identity: "Godson",
//         messageCreatedByMe: true,
//     },
//     {
//         content: "How are you all?",
//         identity: "Godson",
//         messageCreatedByMe: true,
//     },
//     {
//         content: "Hello",
//         identity: "Daniel",
//         messageCreatedByMe: false,
//     },
//     {
//         content: "Hello there",
//         identity: "Rahul",
//         messageCreatedByMe: false,
//     },
// ];

const Message = ({ author, content, sameAuthor, messageCreatedByMe }) => {
    const alignClass = messageCreatedByMe ? 'message_align_right' : 'message_align_left';

    const authorText = messageCreatedByMe ? 'You' : author;

    const contentAdditionalStyles = messageCreatedByMe ? 'message_right_styles' : 'message_left_styles';
    return (
        <div className={`message_container ${alignClass}`}>
            {!sameAuthor && <p className='message_title'>{authorText}</p>}
            <p className={`message_content ${contentAdditionalStyles}`}>{content}</p>
        </div>
    )
}

const Messages = ({ messages, identity }) => {
  return (
    <div className='messages_container'>
      {messages.map((message,index) => {
        const sameAuthor = index > 0 && message.identity === messages[index - 1].identity;

        const messageCreatedByMe = message.identity === identity ? true: false;

        return (
            <Message 
                key={`${message.content}${index}`}
                author={message.identity}
                content={message.content}
                sameAuthor={sameAuthor}
                messageCreatedByMe={messageCreatedByMe}
            />
        )
      })}
    </div>
  )
}

const mapStoreStateToProps = (state) => {
    return {
        ...state
    }
}

export default connect(mapStoreStateToProps)(Messages);
