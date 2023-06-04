import React from 'react'

const ConnectingButton = ({
    createRoomButtton = false,
    buttonText,
    onClickHandler,
}) => {
    const buttonClass = createRoomButtton? "create_room_button" : "join_room_button";

  return (
    <button className={buttonClass} onClick={onClickHandler}>
      {buttonText}
    </button>
  )
}

export default ConnectingButton
