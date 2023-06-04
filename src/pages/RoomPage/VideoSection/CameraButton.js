import React, { useState } from 'react';

import CameraButtonImg from "../../../assets/images/camera.svg";
import CameraButtonImgOff from "../../../assets/images/cameraOff.svg";
import * as webRTCHandler from "../../../utils/WebRTCHandler";

const CameraButton = () => {
    const [isLocalVideoDisabled, setIsLocalVideoDisabled] = useState(false);

    const handleCameraButtonPress = () => {
      webRTCHandler.toggleCamera(isLocalVideoDisabled);

      setIsLocalVideoDisabled(!isLocalVideoDisabled);
    }

  return (
    <div className='video_button_container'>
        <img
            alt="camera"
            src={isLocalVideoDisabled?CameraButtonImgOff:CameraButtonImg}
            onClick={handleCameraButtonPress}
            className='video_button_image'
        />
    </div>
  )
}

export default CameraButton
