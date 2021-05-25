import express, {Request, Response} from "express";
import axios from "axios";
import * as querystring from "querystring";
require('dotenv').config();
const app = express();

const port = process.env.PORT || 5000;
const clientID = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectURI = process.env.REDIRECT_URI;
const scope = process.env.SCOPE;
const frontEndURL = process.env.FRONTEND_URL;


app.get("/", (req: Request, res: Response) => {
  res.sendStatus(200);
});

app.get("/login", (req: Request, res: Response) => {
  res.redirect(`https://accounts.spotify.com/authorize?show_dialog=true&response_type=code&client_id=${clientID}&redirect_uri=${redirectURI}:${port}/callback&scope=${scope}`)
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
        console.log(data)
        res.redirect(`${frontEndURL}/?access=${data.access_token}&refresh=${data.refresh_token}&expires=${data.expires_in}`)
      })
      .catch(err => console.log(err))

});

app.listen(port, () => {
  console.log(`server started on port ${port}`)
})
