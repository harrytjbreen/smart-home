import express, {Request, Response} from "express";
import axios from "axios";
import bodyParser from "body-parser";
import * as querystring from "querystring";
require('dotenv').config();
const app = express();

const port = process.env.PORT || 5000;
const clientID = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectURI = process.env.REDIRECT_URI;
const scope = process.env.SCOPE;
const frontEndURL = process.env.FRONTEND_URL;

app.use(bodyParser.json());


app.get("/", (req: Request, res: Response) => {
  res.sendStatus(200);
});

app.get("/login", (req: Request, res: Response) => {
  res.redirect(`https://accounts.spotify.com/authorize?response_type=code&client_id=${clientID}&redirect_uri=${redirectURI}:${port}/callback&scope=${scope}`)
});

app.get("/callback", (req: Request, res: Response) => {
  let code = req.query.code;
  const data = {
    code: code,
    redirect_uri: `${redirectURI}:${port}/callback`,
    grant_type: "authorization_code",
    client_id: clientID,
    client_secret: clientSecret
  }
  const headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
  };

  // @ts-ignore
  axios.post('https://accounts.spotify.com/api/token',querystring.stringify(data), {headers}).then(res => res.data)
      .then((data) => {
        res.redirect(`${frontEndURL}/?access=${data.access_token}&refresh=${data.refresh_token}&expires=${data.expires_in}`)
      })
      .catch(err => console.log(err))
});

app.post("/refresh", (req: Request, res: Response) => {
  const refresh = req.query.refresh;
  if(!refresh) {
    res.sendStatus(401);
    return;
  }

  axios.post('https://accounts.spotify.com/api/token',
    `grant_type=refresh_token&refresh_token=${refresh}`,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: ` Basic ${Buffer.from(`${clientID}:${clientSecret}`).toString('base64')}`
      }
    })
    .then(res => res.data)
    .then(data => {
      res.send({
        access: data.access_token,
        refresh,
        expires: data.expires_in
      })
    })
    .catch((err: Error) => console.log(err))
})

app.listen(port, ()  => {
  console.log(`server started on port ${port}`)
})
