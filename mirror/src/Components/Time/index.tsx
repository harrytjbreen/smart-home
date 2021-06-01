import * as React from "react"
import {useEffect, useState} from "react";

const Time: React.FC = () => {

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const updateTime = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(updateTime);
  },[])

  return (
    <div className={"time"}>
      {time.toLocaleTimeString()}
    </div>
  )
}

export default Time;
