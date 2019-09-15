require('dotenv').config()
import request from 'request-promise'
import fetch from 'isomorphic-unfetch'

export default async (req, res) => {
  if (req.method === 'POST') console.log(req)
  //console.log(req.method)
  //console.log(req)
  const refreshToken = await req.body.refresh_token
  const accessToken = await swapTokens(refreshToken)
  console.log(`REFRESH TOKEN: ${refreshToken}`)
  console.log(`ACCESS TOKEN: ${accessToken}`)

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
      res.json({
        title: 'Not playing',
        artist: 'Not playing',
        albumCover:
          'https://collegian.com/wp-content/uploads/2017/08/spotify-1759471_1280.jpg'
      })
    })
}

const swapTokens = async refreshToken => {
  return new Promise((resolve, reject) => {
    fetch(`https://accounts.spotify.com/api/token`, {
      method: 'POST',
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
      resolve(response.body.access_token)
    })
  })
}
