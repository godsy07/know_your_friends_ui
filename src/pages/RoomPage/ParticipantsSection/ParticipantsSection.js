import React from 'react';

import ParticipantsLabel from './ParticipantsLabel'
import Participants from './Participants'

const ParticipantsSection = () => {
  return (
    <div className='paticipants_section_container'>
      <ParticipantsLabel />
      <Participants />
    </div>
  )
}

export default ParticipantsSection
