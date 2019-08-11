require('dotenv').config()
const Spotify = require('spotify-web-api-node')
const request = require('request-promise')

const spotify = new Spotify()
spotify.setRefreshToken(process.env.REFRESH_TOKEN)
spotify.setClientId(process.env.CLIENT_ID)
spotify.setClientSecret(process.env.CLIENT_SECRET)

function refreshToken() {
  return new Promise((res, rej) => {
    spotify.refreshAccessToken().then(data => {
      spotify.setAccessToken(data.body['access_token'])
      res(data.body['access_token'])
    })
  })
}

const headers = {
  Accept: `application/json`,
  'Content-Type': 'application/json',
  Authorization: `Bearer ${spotify.getAccessToken()}`
}

const options = {
  url: 'https://api.spotify.com/v1/me/player/currently-playing?market=US',
  headers: headers
}

export default (req, res) => {
  async function fetchData() {
    var accessToken = await refreshToken()

    refreshToken().then(
      request({
        url: 'https://api.spotify.com/v1/me/player/currently-playing?market=US',
        headers: {
          Accept: `application/json`,
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        }
      }).then(data => {
        console.log(data)
        const json = JSON.parse(data)
        const artist = json['item']['artists'][0]['name']
        const title = json['item']['name']
        console.log(artist)
        console.log(title)
        res.json({ artist, title })
      })
    )
  }

  fetchData()
}
