import React from 'react';
import Time from "./Components/Time";
import "./scss/main.scss"
import Draggable from "./Components/Draggable";
import Spotify from "./Components/Spotify";

const App = () => {

  return (
    <div>
      <Draggable initialPosition={[0,700]}>
        <Time/>
      </Draggable>
      <Draggable initialPosition={[50,300]}>
        <Spotify/>
      </Draggable>
    </div>
  );
};

export default App;
