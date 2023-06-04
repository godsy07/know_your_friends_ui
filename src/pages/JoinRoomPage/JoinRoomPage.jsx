import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { connect } from 'react-redux';

import "./JoinRoomPage.css";
import { setIsRoomHost } from '../../store/actions';
import JoinRoomTitle from './JoinRoomTitle';
import JoinRoomContent from './JoinRoomContent';

const JoinRoomPage = (props) => {

  const { setIsRoomHostAction, isRoomHost } = props;

  const location = useLocation();

  useEffect(() => {
    const isRoomHost = new URLSearchParams(location.search).get("host");
    // eslint-disable-next-line eqeqeq
    if(isRoomHost == "true"){
      setIsRoomHostAction(true);
    }
  },[])

  return (
    <div className="join_room_page_container">
      <div className="join_room_page_panel">
        <JoinRoomTitle isRoomHost={isRoomHost} />
        <JoinRoomContent />
      </div>
    </div>
  )
}

const mapStoreStateToProps = (state) => {
  return {
    ...state
  };
};

const mapActionsToProps = (dispatch) => {
  return {
    setIsRoomHostAction: (isRoomHost) => dispatch(setIsRoomHost(isRoomHost))
  };
};

export default connect(mapStoreStateToProps, mapActionsToProps)(JoinRoomPage);
