import React, { useState } from 'react';

import MicButtonImg from "../../../assets/images/mic.svg";
import MicButtonImgOff from "../../../assets/images/micOff.svg";
import * as webRTCHandler from "../../../utils/WebRTCHandler";

const MicButton = () => {
    const [isMicMuted, setIsMicMuted] = useState(false);

    const handleMicButtonPress = () => {
      webRTCHandler.toggleMic(isMicMuted);

      setIsMicMuted(!isMicMuted);
    }

  return (
    <div className='video_button_container'>
        <img
            alt="microphone"
            src={isMicMuted?MicButtonImgOff:MicButtonImg}
            onClick={handleMicButtonPress}
            className='video_button_image'
        />
    </div>
  )
}

export default MicButton
