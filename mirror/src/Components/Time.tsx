import * as React from "react"
import {useEffect, useState} from "react";

const Time: React.FC = () => {

  const [time, setTime] = useState(0);

  useEffect(() => {
    setInterval(() => setTime(Date.now), 1000);
  },[])

  return (
    <div className={"time-container"}>
      {new Date(time).toLocaleTimeString()}
    </div>
  )
}

export default Time;
