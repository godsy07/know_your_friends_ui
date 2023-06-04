import React from 'react';
import { connect } from 'react-redux';

// const dummyParticipants = [
//     {
//         identity: "Jake",
//     },
//     {
//         identity: "Anna",
//     },
//     {
//         identity: "Godsy",
//     },
//     {
//         identity: "Dany",
//     },
// ];

const SingleParticipant = (props) => {
    const { identity, lastitem, participant } = props;

    return (
        <>
            <p className='participants_paragraph'>{identity}</p>
            {!lastitem && <span className='participants_separator_line'></span>}
        </>
    )
}

const Participants = ({ participants }) => {
  return (
    <div className='participants_container'>
      {participants.map((participant,index) => {
        return (
            <SingleParticipant
                key={index}
                identity={participant.identity}
                participant={participant}
                lastitem={participants.length - 1 === index}
            />
        )
      })}
    </div>
  )
}

const mapStoreStateToProps = (state) => {
    return {
        ...state
    }
}

export default connect(mapStoreStateToProps)(Participants);
