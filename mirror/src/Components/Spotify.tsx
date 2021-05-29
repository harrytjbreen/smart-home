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
  show: boolean
}

const Spotify: React.FC = (props) => {

  const [tokens, setTokens] = useState({} as Tokens);
  const [state, setState] = useState<State>({artists: [], duration: 0, image: "", progress: 0, songName: "", show: false});

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
      const res = await axios.get("https://api.spotify.com/v1/me/player", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": ` Bearer ${tokens.access}`
        }
      });
      if(res.status === 401) {
        //TODO refresh token if error
        return;
      }
      setState({
        duration: res.data.item.duration_ms,
        image: res.data.item.album.images[1].url,
        progress: res.data.progress_ms,
        songName: res.data.item.name,
        artists: res.data.item.artists.map((item: any) => item.name),
        show: true
      })
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    const {access, refresh, expires} = parseParams(window.location.search);
    if(access && refresh && expires) {
      saveTokens({access, refresh});
      setTokens({access, refresh});
    }
  },[]);

  useEffect(() => {
    const stateInterval = setTimeout(getState, 100);

    return () => {
      clearTimeout(stateInterval);
    }
  })

  return state.show && state.artists? (
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
