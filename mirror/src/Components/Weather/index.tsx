import * as React from "react"
import {useEffect, useState} from "react";
import axios from "axios";
import Toggle from "react-toggle";

interface WeatherData {
  location: string
  condition: {
    code: number;
    icon: string;
    text: string;
  },
  feelsLikeC: number
  feelsLikeF: number
  lastUpdated: number
  windKPH: number
  windMPH: number
}

const API = 'http://192.168.1.100:5002'

const Weather: React.FC = () => {

  const [data, setData] = useState({} as WeatherData)
  const [isCelsius, setIsCelsius] = useState(true);
  const [showForecast, setShowForecast] = useState(true);
  const [openSettings, setOpenSettings] = useState(false);

  const loadData = async (): Promise<void> => {
    //TODO find current Location
    try {
      const res = await axios.get(`${API}/current?q=Stroud`);
      const data = res.data
      setData(data);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    loadData();
    setInterval(loadData, 1.8e+6)
  },[])

  return !openSettings ? (
    <div className={"weather"} onDoubleClick={() => setOpenSettings(true)}>
      <div id={"location"}>{data.location}</div>
      <div id={"temp"}>{isCelsius ? data.feelsLikeC : data.feelsLikeF}°</div>
    </div>
  ) : (
    <div className={"weather"} style={{fontWeight: "normal"}} onDoubleClick={() => setOpenSettings(false)}>
      <div className={"weather-settings"}>
        Degree Units:
        <Toggle className={"Toggle"}
                defaultChecked={isCelsius}
                icons={{checked: <DegreeIcon char={"C"}/>, unchecked: <DegreeIcon char={"F"}/>}}
                onChange={() => setIsCelsius(p => !p)}/>
      </div>
      <div className={"weather-settings"}>
        Show Forecast:
        <Toggle className={"Toggle"}
                defaultChecked={showForecast}
                icons={false}
                onChange={() => setShowForecast(p => !p)}/>
      </div>
    </div>
  )
}

const DegreeIcon = ({char}: {char: string}) => (
  <div style={{paddingTop: 4}}>
    {char}
  </div>
)

export default Weather;
