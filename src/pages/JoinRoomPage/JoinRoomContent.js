import React, { useState } from 'react';
import { connect } from 'react-redux';
import ErrorMessage from './ErrorMessage';
import { useHistory } from 'react-router-dom';

import JoinRoomInputs from './JoinRoomInputs';
import OnlyWithAudioCheckbox from './OnlyWithAudioCheckbox';
import { setConnectOnlyWithAudio, setIdentity, setRoomId } from '../../store/actions';
import JoinRoomButtons from './JoinRoomButtons';
import { getRoomExists } from '../../utils/api';

const JoinRoomContent = (props) => {
    const { isRoomHost, connectOnlyWithAudio, setConnectOnlyWithAudio, setIdentityAction, setRoomIdAction } = props;

    const history = useHistory();
    const [roomIdValue, setRoomIdValue] = useState("");
    const [nameValue, setNameValue] = useState("");
    const [errorMessage, setErrorMessage] = useState(null);

    const handleJoinRoom = async () => {
        setIdentityAction(nameValue);
        if(isRoomHost){
            createRoom();
        }else{
            await joinRoom();
        }
    }
    
    const joinRoom = async() => {
        const responseData = await getRoomExists(roomIdValue);
    
        const { roomExists, full } = responseData;
    
        if(roomExists){
            if(full){
                setErrorMessage("Meeting is full. Please try again later.")
            }else{
                // join the room
                setRoomIdAction(roomIdValue);
                history.push("/room");
            }
        }else{
            setErrorMessage("Room not found. Check your meeting ID")
        }
    }
    
    const createRoom = () => {
        history.push("/room");
    }

  return (
    <>
        <JoinRoomInputs
            roomIdValue={roomIdValue}
            setRoomIdValue={setRoomIdValue}
            nameValue={nameValue}
            setNameValue={setNameValue}
            isRoomHost={isRoomHost}
        />
        <OnlyWithAudioCheckbox
            connectOnlyWithAudio={connectOnlyWithAudio}
            setConnectOnlyWithAudio={setConnectOnlyWithAudio}
        />
        <ErrorMessage errorMessage={errorMessage} />
        <JoinRoomButtons
            handleJoinRoom={handleJoinRoom}
            isRoomHost={isRoomHost}
        />
    </>
  )
}

const mapStoreStateToProps = (state) => {
    return {
        ...state
    };
}

const mapActionToProps = (dispatch) => {
    return {
        setConnectOnlyWithAudio: (onlyWithAudio) => dispatch(setConnectOnlyWithAudio(onlyWithAudio)),
        setIdentityAction: (identity) => dispatch(setIdentity(identity)),
        setRoomIdAction: (roomId) => dispatch(setRoomId(roomId)),
    };
}

export default connect(mapStoreStateToProps, mapActionToProps)(JoinRoomContent);
