import * as React from "react"
import {useState} from "react";
import axios from "axios";

interface WeatherData {
  temp: number;
  icon: string;
}

const Weather: React.FC = () => {

  const [data, setData] = useState({} as WeatherData)

  const loadData = async (): Promise<void> => {

  }

  return (
    <div>
      {/*<Icons x={250} y={800} width={360} height={360}/>*/}
    </div>
  )
}

export default Weather;
