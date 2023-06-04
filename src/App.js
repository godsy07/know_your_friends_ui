import React, { useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import JoinRoomPage from './pages/JoinRoomPage/JoinRoomPage';
import RoomPage from './pages/RoomPage/RoomPage';
import IntroductionPage from './pages/IntroductionPage/IntroductionPage';
import { connectWithSocketIOServer } from './utils/wss';

import './App.css';

const App = () => {

  useEffect(() => {
    connectWithSocketIOServer();
  },[])

  return (
    <BrowserRouter>
      <Switch>
        <Route path='/join-room'>
          <JoinRoomPage />
        </Route>
        <Route path='/room'>
          <RoomPage />
        </Route>
        <Route path='/'>
          <IntroductionPage />
        </Route>

        {/* <Route path='*' element={<PageNotFound />} /> */}
      </Switch>
    </BrowserRouter>
  );
}

export default App;
