import { setMessages, setShowoverlay } from "../store/actions";
import store from "../store/store";
import * as wss from "../utils/wss";
import Peer from 'simple-peer';

const defaultConstraints = {
    audio: true,
    video: {
        width: "480",
        height: "360",
    },
};

const onlyAudioConstraints = {
    audio: true,
    video: false,
}

let localStream;

export const getLocalPreviewAndInitRoomConnection = async (
    isRoomHost,
    identity,
    roomId = null,
    onlyAudio,
) => {
    const constraints = onlyAudio ? onlyAudioConstraints: defaultConstraints;

    navigator.mediaDevices.getUserMedia(constraints).then(stream => {
        console.log("success recieved video stream")
        localStream = stream;
        showLocalVideoPreview(localStream);
        // dispatch an action to hide the overlay
        store.dispatch(setShowoverlay(false));
        isRoomHost ? wss.createNewRoom(identity, onlyAudio) : wss.joinRoom(identity,roomId, onlyAudio);
    }).catch(err => {
        console.log("Error occurred when trying to access local stream");
        console.log(err);
    })
}

let peers = {};
let streams = [];

const getConfiguration = () => {
    return {
        iceServers: [
            {
                urls: "stun:stun.l.google.com:19302"
            }
        ]
    }
};

const messagerChannel = "messager";

export const prepareNewPeerConnection = (connUserSocketId, isInitiater) => {
    const configuration = getConfiguration();

    peers[connUserSocketId] = new Peer({
        initiator: isInitiater,
        config: configuration,
        stream: localStream,
        channelName: messagerChannel
    });

    peers[connUserSocketId].on('signal',(data) => {

        // webRTC offer, webRTC Answer (SOP information), ice candidates

        const signalData = {
            signal: data,
            connUserSocketId: connUserSocketId,
        };

        wss.signalPeerData(signalData);
    });

    peers[connUserSocketId].on('stream',(stream) => {
        console.log("new stream came");

        addStream(stream, connUserSocketId);
        streams = [ ...streams, stream ]; 
    });

    peers[connUserSocketId].on('data', (data) => {
        const messageData = JSON.parse(data);
        appendNewMessage(messageData);
    });
}

export const handleSignalingData = (data) => {
    // add signaling data to peer connection
    peers[data.connUserSocketId].signal(data.signal);
}

export const removePeerConnection = (data) => {
    const { socketId } = data;
    const videoContainer = document.getElementById(socketId);
    const videoElement = document.getElementById(`${socketId}-video`);

    if (videoContainer && videoElement) {
        const tracks = videoElement.srcObject.getTracks();

        tracks.forEach(track => track.stop());

        videoElement.srcObject =  null;
        videoContainer.removeChild(videoElement);

        videoContainer.parentNode.removeChild(videoContainer);

        if (peers[socketId]) {
            // peers[socketId].destroy();
            delete peers[socketId];
        }
    }
}

const showLocalVideoPreview = (stream) => {
    // show local video preview
    console.log("show local preiview called....")
    const videosContainer = document.getElementById("videos_portal");
    videosContainer.classList.add("videos_portal_styles");
    const newVideoContainer = document.createElement('div');
    newVideoContainer.classList.add("video_track_container");
    const videoElement = document.createElement('video');
    videoElement.autoplay = true;
    videoElement.muted = true;
    videoElement.srcObject = stream;
    videoElement.onloadedmetadata = () => {
        videoElement.play();
    }

    newVideoContainer.appendChild(videoElement);

    if (store.getState().connectOnlyWithAudio) {
        newVideoContainer.appendChild(getOnlyAudioLabel(store.getState().identity));
    } else {
        newVideoContainer.style.position = "static";
    }

    videosContainer.appendChild(newVideoContainer);
}

const addStream = (stream, connUserSocketId) => {
    // display incoming stream
    const videosContainer = document.getElementById("videos_portal");
    const newVideoContainer = document.createElement('div');
    newVideoContainer.id = connUserSocketId;
    newVideoContainer.classList.add("video_track_container");
    const videoElement = document.createElement('video');
    videoElement.autoplay = true;
    videoElement.srcObject = stream;
    videoElement.id = `${connUserSocketId}-video`;
    videoElement.onloadedmetadata = () => {
        videoElement.play();
    }

    videoElement.addEventListener('click', () => {
        if (videoElement.classList.contains('full_screen')) {
            videoElement.classList.remove("full_screen");
        } else {
            videoElement.classList.add("full_screen");
        }
    });
    
    newVideoContainer.appendChild(videoElement);

    // check if others user have connected with only audio
    const participants = store.getState().participants;
    const participant = participants.find(p => p.socketId === connUserSocketId);

    if (participant?.onlyAudio) {
        newVideoContainer.appendChild(getOnlyAudioLabel(participant.identity));
    } else {
        newVideoContainer.style.position = "static";
    }

    videosContainer.appendChild(newVideoContainer);
}

const getOnlyAudioLabel = (identity) => {
    const labelContainer = document.createElement('div');
    labelContainer.classList.add('label_only_audio_container');

    // const label = document.createElement('p');
    // label.classList.add('label_audio_only_text');
    // label.innerHTML = "Only audio";
    const nameChar = identity.charAt(0).toUpperCase();
    const labelDiv = document.createElement('div');
    labelDiv.style.width = "100px";
    labelDiv.style.height = "100px";
    labelDiv.style.display = "flex";
    labelDiv.style.flexDirection = "column";
    labelDiv.style.justifyContent = "center";
    labelDiv.style.alignItems = "center";
    labelDiv.style.textAlign = "center";
    labelDiv.style.borderRadius = "50%";
    labelDiv.style.backgroundColor = "orange";
    const label = document.createElement('span');
    label.style.fontSize = "3em";
    label.innerHTML = nameChar;

    const userName = document.createElement('span');
    userName.innerHTML = identity;

    labelDiv.appendChild(label);
    labelContainer.appendChild(labelDiv);
    labelContainer.appendChild(userName);
    // labelContainer.appendChild(label);
    return labelContainer;
}

// Buttons Logic

export const toggleMic = (isMuted) => {
    localStream.getAudioTracks()[0].enabled = isMuted ? true :  false;
}

export const toggleCamera = (isDisabled) => {
    localStream.getVideoTracks()[0].enabled = isDisabled ? true :  false;
}

export const toggleScreenShare = (isScreenSharingActive, screenSharingStream = null) => {
    if (isScreenSharingActive) {
        switchVideoTracks(localStream);
    } else {
        switchVideoTracks(screenSharingStream);
    }
}

const switchVideoTracks = (stream) => {
    for (let socket_id in peers) {
        for (let index in peers[socket_id].streams[0].getTracks()) {
            for (let index2 in stream.getTracks()) {
                if (peers[socket_id].streams[0].getTracks()[index].kind === stream.getTracks()[index2.kind]) {
                    peers[socket_id].replaceTrack(peers[socket_id].streams[0].getTracks()[index], stream.getTracks()[index2], peers[socket_id].streams[0]);
                    break;
                }
            }
        }
    }
}

////////////// Messages ///////////////////
const appendNewMessage = (messageData) => {
    const messages = store.getState().messages;
    store.dispatch(setMessages([...messages, messageData]));
}

export const sendMessageUsingDataChannel = (messageContent) => {
    // append this message locally
    const identity = store.getState().identity;

    const localMessageData = {
        content: messageContent,
        identity,
        messageCreatedByMe: true,
    }
    
    appendNewMessage(localMessageData);
    
    const messageData = {
        content: messageContent,
        identity,
    }
    const stringifiedMessageData = JSON.stringify(messageData);
    for (let socketId in peers) {
        peers[socketId].send(stringifiedMessageData);
    }
}

