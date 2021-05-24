import express, {Request, Response} from "express";
import axios from "axios";
const app = express();

const port = process.env.PORT || 5000;
const clientID = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectURI = process.env.REDIRECT_URI;
const scope = process.env.SCOPE;

interface Token {
  access?: string;
  refresh?: string;
  timeout?: number;
}

let tokens: Token;

app.get("/", (req: Request, res: Response) => {
  res.sendStatus(200);
});

app.get("/login", (req: Request, res: Response) => {
  res.redirect(`https://accounts.spotify.com/authorize?
  response_type=code&clientID=${clientID}&redirect_uri=${redirectURI}&scope=${scope}`)
});

app.get("/callback", async (req: Request, res: Response) => {
  let code = req.query?.code;
  const authOptions = {
    url: `https://accounts.spotify.com/api/token`,
    Method: "POST",
    data: {
      code: code,
      redirect_uri: `${redirectURI}:${port}/callback`,
      grant_type: "authorization_code"
    },
    headers : {
      'Authorization' : 'Basic ' + Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64')},
      json: true
    };

  const response = await axios(authOptions);
  const data = await response.data();
  tokens = {
    access: data.body.access_token,
    refresh: data.body.refresh_token,
    timeout: data.body.expires_in
  }
});

app.listen(port, () => {
  console.log(`server started on port ${port}`)
})
