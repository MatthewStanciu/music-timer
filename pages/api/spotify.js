require('dotenv').config()
const Spotify = require('spotify-web-api-node')
import request from 'request-promise'
import fetch from 'isomorphic-unfetch'
import axios from 'axios'

export default async (req, res) => {
  if (req.method === 'POST') {
    const accessToken = await swapTokens(req.body.refresh_token)
    console.log(`access token: ${accessToken}`)

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

/*const swapTokens = async () => {
  return new Promise((res, rej) => {
    spotify.refreshAccessToken().then(data => {
      res(data.body['access_token'])
    })
  })
}*/

const swapTokens = async refreshToken => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: `https://accounts.spotify.com/api/token`,
      params: {
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization:
          'Basic ' +
          Buffer.from(
            `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
          ).toString('base64')
      }
    }).then(response => {
      resolve(response.data.access_token)
    })
  })
}
