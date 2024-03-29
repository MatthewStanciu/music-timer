require('dotenv').config()
const Spotify = require('spotify-web-api-node')
import request from 'request-promise'

const spotify = new Spotify()
spotify.setRefreshToken(process.env.REFRESH_TOKEN)
spotify.setClientId(process.env.CLIENT_ID)
spotify.setClientSecret(process.env.CLIENT_SECRET)

export default async (req, res) => {
  if (req.method === 'POST') {
    spotify.setRefreshToken(req.body.refresh_token)
    const accessToken = await swapTokens()

    request({
      url: 'https://api.spotify.com/v1/me/player/currently-playing',
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
        console.log(err)
        res.json({
          title: 'Not playing',
          artist: 'Not playing',
          albumCover:
            'https://collegian.com/wp-content/uploads/2017/08/spotify-1759471_1280.jpg'
        })
      })
  }
}

const swapTokens = async () => {
  return new Promise((res, rej) => {
    spotify.refreshAccessToken().then(data => {
      res(data.body['access_token'])
    })
  })
}
