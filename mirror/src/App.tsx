import React from 'react';
import Time from "./Components/Time";
import "./scss/main.scss"
import Draggable from "./Components/Draggable";
import Spotify from "./Components/Spotify";
import Weather from "./Components/Weather";

const App = () => {

  return (
    <div>
      <Draggable initialPosition={[150,900]}>
        <Spotify/>
      </Draggable>
      <Draggable initialPosition={[0,1080]}>
        <Time/>
      </Draggable>
      <Draggable initialPosition={[100,100]}>
        <Weather/>
      </Draggable>
    </div>
  );
};

export default App;
