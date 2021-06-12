import * as React from "react";
import {useEffect, useState} from "react";
import axios from "axios";
import {Button, Col, ProgressBar, Row} from "react-bootstrap";

interface Tokens {
  access: string;
  refresh: string;
  expires?: string;
}

interface State {
  progress: number;
  duration: number;
  songName: string;
  image: string;
  artists: string[];
  time: Date;
  isPlaying: boolean;
}

const URL = "http://192.168.1.100:5000";

const Spotify: React.FC = () => {

  const [tokens, setTokens] = useState({} as Tokens);
  const [state, setState] = useState<State>({
    isPlaying: false,
    artists: [],
    duration: 0,
    image: "",
    progress: 0,
    songName: "",
    time: new Date(0)
  });
  const [settingsPage, setSettingsPage] = useState(false);

  const parseParams = (querystring: string): Tokens => {
    const params = new URLSearchParams(querystring);
    const obj: any = {};
    for (const key of params.keys()) {
      if (params.getAll(key).length > 1) {
        obj[key] = params.getAll(key);
      } else {
        obj[key] = params.get(key);
      }
    }
    return obj;
  };

  const saveTokens = ({access, refresh}: Tokens): void => {
    localStorage.setItem("spotifyAccess", access)
    localStorage.setItem("spotifyRefresh", refresh)
  };

  const loadTokens = (token?: Tokens): void => {
    const access = token?.access ?? localStorage.getItem('spotifyAccess') ?? "";
    const refresh = token?.refresh ?? localStorage.getItem('spotifyRefresh') ?? "";
    setTokens({access, refresh});
  };

  const millisToMinutesAndSeconds = (millis: number): string => {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000);
    return `${minutes}:${seconds.toFixed(0).padStart(2,"0")}`;
  }

  const getState = async (): Promise<void> => {
    if(!tokens.access) {
      setSettingsPage(true);
      return;
    }

    try {
      let res = await axios.get("https://api.spotify.com/v1/me/player", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": ` Bearer ${tokens.access}`
        }
      });
      if(res.data.is_playing)
      setState(p => ({
        duration: res.data?.item?.duration_ms,
        image: res.data?.item?.album.images[1].url,
        progress: res.data?.progress_ms,
        songName: res.data?.item?.name,
        artists: res.data?.item?.artists.map((item: any) => item.name),
        time: res.data?.is_playing ? new Date() : p.time,
        isPlaying: res.data?.is_playing,
      })); else {
        if(Date.now() - state.time.getTime() > 3000 && state.songName !== "N/A") {
          setState({
            artists: ["N/A"],
            duration: 0,
            image: "",
            isPlaying: false,
            progress: 0,
            songName: "N/A",
            time: new Date(0),
          })
        }
        const stateInterval = setTimeout(getState, 1000);
      }
    } catch (err) {
      try {
        const res = await axios.post(`${URL}/refresh?refresh=${tokens.refresh}`)
        if (res.status === 401) return;
        saveTokens({access: res.data.access, refresh: res.data.refresh})
        setTokens({access: res.data.access, refresh: res.data.refresh})
      }
      catch (err) {
        const stateInterval = setTimeout(getState, 250);
      }
    }
  }

  useEffect(() => {
    const {access, refresh} = parseParams(window.location.search);
    if(access && refresh) {
      saveTokens({access, refresh});
    }
    loadTokens({access, refresh});
  },[]);

  useEffect(() => {
    const stateInterval = setTimeout(getState, 250);

    return () => {
      clearTimeout(stateInterval);
    }
  });

  return !settingsPage ?
      <div onDoubleClick={() => setSettingsPage(true)} className={"spotify"}>
        {state.image && <img draggable={false} src={state.image} alt={"Song Graphic"}/>}
        <div className={"track"}>
          <h1>{(state.songName.length < 25 ? state.songName : state.songName.substring(0,23) + "...")}</h1>
          {state.artists.join(", ").length < 35 ? state.artists.join(", ") : state.artists.join(", ").substring(0,35) + "..."}<br/>
        </div>
        <div className={"bar"}>
          <Row>
            <Col md={"auto"}>
              {millisToMinutesAndSeconds(state.progress)}
            </Col>
            <Col>
              <ProgressBar variant={"dark"}>
                <ProgressBar variant={"success"} max={1} min={0} now={state.duration !== 0 ? (state.progress/state.duration) : 1}/>
              </ProgressBar>
            </Col>
            <Col md={"auto"}>
            {millisToMinutesAndSeconds(state.duration)}
            </Col>
          </Row>
        </div>
      </div>
    :
    <div className={"settings"} onDoubleClick={() => setSettingsPage(false)}>
      <a href={`${URL}/login`}><Button variant={"outline-success"}>Login to Spotify</Button></a>
    </div>
}

export default Spotify;
