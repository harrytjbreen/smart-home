import * as React from "react";
import {useEffect, useState} from "react";
import axios from "axios";
import {Col, ProgressBar, Row} from "react-bootstrap";

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

const SPOTIFY_URL = "http://192.168.1.100:5000";

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
    if(!tokens.access){
      loadTokens();
      return;
    }

    try {
      let res = await axios.get("https://api.spotify.com/v1/me/player", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": ` Bearer ${tokens.access}`
        }
      });
      setState({
        duration: res.data?.item?.duration_ms,
        image: res.data?.item?.album.images[1].url,
        progress: res.data?.progress_ms,
        songName: res.data?.item?.name,
        artists: res.data?.item?.artists.map((item: any) => item.name),
        time: new Date(),
        isPlaying: res.data?.is_playing
      })
    } catch (err) {
      try {
        const res = await axios.post(`${SPOTIFY_URL}/refresh?refresh=${tokens.refresh}`)
        if (res.status === 401) return;
        saveTokens({access: res.data.access, refresh: res.data.refresh})
        setTokens({access: res.data.access, refresh: res.data.refresh})
      }
      catch (err) {
        setTimeout(getState, 1000);
      }
    }
  }

  useEffect(() => {
    const {access, refresh} = parseParams(window.location.search);
    if(access && refresh) {
      saveTokens({access, refresh});
      setTokens({access, refresh});
    }
  },[]);

  useEffect(() => {
    const stateInterval = setTimeout(getState, 100);

    return () => {
      clearTimeout(stateInterval);
    }
  });

  return Date.now() - state.time.getTime() < 3000
    && state.artists
    && state.isPlaying
      ? (
      <div className={"spotify"}>
        <img draggable={false} src={state.image} alt={"Song Graphic"}/>
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
                <ProgressBar variant={"success"} max={1} min={0} now={(state.progress/state.duration)}/>
              </ProgressBar>
            </Col>
            <Col md={"auto"}>
            {millisToMinutesAndSeconds(state.duration)}
            </Col>
          </Row>
        </div>
      </div>
    ) : null
}

export default Spotify;
