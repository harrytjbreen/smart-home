import * as React from "react"
import {useEffect, useState} from "react";

const Time: React.FC = () => {

  const [time, setTime] = useState(Date.now);

  useEffect(() => {
    const updateTime = setInterval(() => setTime(Date.now), 1000);
    return () => clearInterval(updateTime);
  },[])

  return (
    <div className={"time"}>
      {new Date(time).toLocaleTimeString()}
    </div>
  )
}

export default Time;
