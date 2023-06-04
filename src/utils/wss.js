import io from "socket.io-client";

import store from "../store/store";
import { setMessages, setParticipants, setRoomId } from "../store/actions";
import * as webRTCHandler from "./WebRTCHandler";

const SERVER = "http://localhost:5002";

let socket = null;

export const connectWithSocketIOServer = () => {
    socket = io(SERVER);

    socket.on("connect", () => {
        console.log("successfully connected with socket io server");
        console.log(socket.id);
    });

    socket.on('room-id', (data) => {
        const { roomId } = data;
        
        store.dispatch(setRoomId(roomId));
    });

    socket.on('room-update', (data) => {
        const { connectedUsers } = data;
        console.log(connectedUsers);
        store.dispatch(setParticipants(connectedUsers));
    });
    
    socket.on('conn-prepare', (data) => {
        const { connUserSocketId } = data;
        
        webRTCHandler.prepareNewPeerConnection(connUserSocketId, false);
        
        // inform the user which just join the room that we have prepared the incoming connection
        socket.emit("conn-init", { connUserSocketId: connUserSocketId });
    });
    
    socket.on('get-all-messages', (data) => {
        const { messages } = data;
        store.dispatch(setMessages(messages));
    });

    socket.on('conn-signal', (data) => {
        webRTCHandler.handleSignalingData(data);
    });
    
    socket.on('conn-init', (data) => {
        const { connUserSocketId } = data;
        webRTCHandler.prepareNewPeerConnection(connUserSocketId, true);
    });

    socket.on('user-disconnected', (data) => {
        webRTCHandler.removePeerConnection(data);
    });
}

export const createNewRoom = (identity, onlyAudio) => {
    // emit an event to server that we like to create new room
    const data = {
        identity,
        onlyAudio
    }

    socket.emit('create-new-room', data);
}

export const joinRoom = (identity, roomId, onlyAudio) => {
    // emit an event to server that we like to join a room
    const data = {
        identity,
        roomId,
        onlyAudio
    }
    
    socket.emit('join-room', data);
}

export const sendMessage = (identity, roomId, message) => {
    const data = {
        identity,
        roomId,
        message
    }

    socket.emit('send-message', data);
}

export const signalPeerData = (data) => {
    socket.emit('conn-signal', data);
}
