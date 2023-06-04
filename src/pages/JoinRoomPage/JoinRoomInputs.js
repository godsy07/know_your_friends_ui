import React from 'react'

const Input = ({ placeholder, value, changeHandler }) => {
    return (
        <input
            value={value}
            onChange={changeHandler}
            className='join_room_input'
            placeholder={placeholder}
        />
    );
}

const JoinRoomInputs = (props) => {
    const { roomIdValue, setRoomIdValue, nameValue, setNameValue, isRoomHost } = props;

    const handleRoomIdValueChange = (e) => {
        setRoomIdValue(e.target.value)
    }

    const handleNameValueChange = (e) => {
        setNameValue(e.target.value)
    }

  return (
    <div className='join_room_inputs_container'>
      {!isRoomHost && (<Input
        value={roomIdValue}
        changeHandler={handleRoomIdValueChange}
        placeholder="Enter meeting ID"
      />)}
      <Input
        value={nameValue}
        changeHandler={handleNameValueChange}
        placeholder="Enter your name"
      />
    </div>
  )
}

export default JoinRoomInputs
