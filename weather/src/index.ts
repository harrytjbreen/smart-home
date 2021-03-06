import express, {Request, Response} from "express";
import bodyParser from "body-parser";
import cors from "cors";
import axios from "axios";
require("dotenv").config();

const app = express();

const port = process.env.PORT ?? 6000;
const apiKey = process.env.API_KEY;
const baseURL = 'https://api.weatherapi.com/v1';

app.use(bodyParser.json());
app.use(cors());


app.options('/current', (req: Request, res: Response) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.end();
});
app.get("/current", async (req: Request, res: Response) => {
  const q = req.query.q;
  if(!q) {
    res.sendStatus(400)
    return;
  }
  try {
    const response = await axios.get(`${baseURL}/current.json?key=${apiKey}&q=${q}&aqi=yes`)
    const data = await response.data;
    res.json({
      location: data.location.name,
      lastUpdated: data.current.last_updated_epoch,
      condition: data.current.condition,
      windMPH: data.current.wind_mph,
      windKPH: data.current.wind_kph,
      feelsLikeC: data.current.feelslike_c,
      feelsLikeF: data.current.feelslike_f,
    })
  } catch (e) {
    console.log(e);
    res.sendStatus(500)
  }
})

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})
