import * as React from "react";
import {useEffect, useState} from "react";

interface Tokens {
  access: string;
  refresh: string;
  expires?: string;
}

const Spotify: React.FC = (props) => {

  const [tokens, setTokens] = useState({});

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
  }

  const loadTokens = (): Tokens => {
    const access = localStorage.getItem('spotifyAccess')
    const refresh = localStorage.getItem('spotifyRefresh')
    return {access, refresh} as Tokens;
  }

  useEffect(() => {
    const {access, refresh, expires} = parseParams(window.location.search);
    if(access && refresh && expires) {
      saveTokens({access, refresh});
      setTokens({access, refresh})
      return;
    }
    setTokens(loadTokens());
  },[])

  return (
    <div>

    </div>
  )
}

export default Spotify;
