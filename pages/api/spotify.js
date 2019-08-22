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
      res(data.body['access_token'])
    })
  })
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
        console.log('Retrieved currently playing song!', data)
        const json = JSON.parse(data)

        const title = json['item']['name']
        const artist = json['item']['artists'][0]['name']
        const albumCover = json['item']['album']['images'][0]['url']

        res.json({ artist, title, albumCover })
      })
    )
  }

  fetchData()
}
