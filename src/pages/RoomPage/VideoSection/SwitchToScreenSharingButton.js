import React, { useState } from 'react';

import SwitchImg from "../../../assets/images/switchToScreenSharing.svg";
import LocalScreenSharingPreview from './LocalScreenSharingPreview';
import * as webRTCHandler from "../../../utils/WebRTCHandler";

const constraints = {
  audio: false,
  video: true,
}

const SwitchToScreenSharingButton = () => {
    const [isScreenSharingActive, setIsScreenSharingActive] = useState(false);
    const [screenSharingStream, setScreenSharingStream] = useState(null);

    const handleScreenShareToggle = async () => {
      if (!isScreenSharingActive) {
        let stream = null;
        try {
          stream = await navigator.mediaDevices.getDisplayMedia(constraints);
        } catch(e) {
          console.log("error occurred while trying to screen sharing");
        }
        if(stream){
          setScreenSharingStream(stream);

          webRTCHandler.toggleScreenShare(isScreenSharingActive, stream);
          setIsScreenSharingActive(true);
          // execute the functionto switch the video we are sending to other users
        }
      } else {
        webRTCHandler.toggleScreenShare(isScreenSharingActive);
        // switch for videoTrack from camera
        setIsScreenSharingActive(false);

        // stop screen share stream
        screenSharingStream.getTracks().forEach((t) => t.stop());
        setScreenSharingStream(null);
      }

      // setIsScreenSharingActive(!isScreenSharingActive);
    }

  return (
    <>
      <div className='video_button_container'>
          <img
              alt="screen share"
              src={SwitchImg}
              onClick={handleScreenShareToggle}
              className='video_button_image'
          />
      </div>
      {isScreenSharingActive && (
        <LocalScreenSharingPreview stream = {screenSharingStream} />
      )}
    </>
  )
}

export default SwitchToScreenSharingButton
