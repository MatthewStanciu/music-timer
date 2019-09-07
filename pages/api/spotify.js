require('dotenv').config()
import request from 'request-promise'
import { parse } from 'query-string'

const Spotify = require('spotify-web-api-node')
const spotify = new Spotify()
spotify.setRefreshToken(process.env.REFRESH_TOKEN)
spotify.setClientId(process.env.CLIENT_ID)
spotify.setClientSecret(process.env.CLIENT_SECRET)

const exchangeTokens = async () => {
  return new Promise((res, rej) => {
    spotify.refreshAccessToken().then(data => {
      res(data.body['access_token'])
    })
  })
}

export default async (req, res) => {
  const accessToken = await exchangeTokens()

  if (req.method === 'POST') {
    console.log(req.body.refresh_token)
    spotify.setRefreshToken(req.body.refresh_token)
  }

  request({
    url: 'https://api.spotify.com/v1/me/player/currently-playing?market=US',
    headers: {
      Accept: `application/json`,
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  })
    .then(data => {
      console.log('Retrieved currently playing song!')
      const json = JSON.parse(data)

      const title = json['item']['name']
      const artist = json['item']['artists'][0]['name']
      const albumCover = json['item']['album']['images'][0]['url']

      res.json({ artist, title, albumCover })
    })
    .catch(err => {
      res.json({
        title: 'Not playing',
        artist: 'Not playing',
        albumCover:
          'https://collegian.com/wp-content/uploads/2017/08/spotify-1759471_1280.jpg'
      })
    })
}
