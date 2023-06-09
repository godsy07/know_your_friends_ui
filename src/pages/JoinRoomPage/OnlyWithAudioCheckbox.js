import React from 'react';

import CheckImg from "../../assets/images/check.png";

const OnlyWithAudioCheckbox = (props) => {

    const { connectOnlyWithAudio, setConnectOnlyWithAudio } = props;

    const handleConnectionTypeChange = () => {
        // change info in our store about connection type
        setConnectOnlyWithAudio(!connectOnlyWithAudio);
    }

    return (
        <div className='checkbox_container'>
            <div className='checkbox_connection' onClick={handleConnectionTypeChange}>
                {connectOnlyWithAudio && <img className='checkbox_image' src={CheckImg} alt='check' />}
            </div>
            <p className="checkbox_container_paragraph">Only audio</p>
        </div>
    )
}

export default OnlyWithAudioCheckbox
