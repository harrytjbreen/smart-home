import React from 'react';
import Time from "./Components/Time";
import "./scss/main.scss"
import Dragable from "./Components/Dragable";

const App = () => {
  return (
    <div>
      <Dragable initialPosition={[0,0]}/>
    </div>
  );
};

export default App;
