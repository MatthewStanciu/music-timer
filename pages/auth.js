import React from 'react'
import axios from 'axios'
import fetch from 'isomorphic-unfetch'

const Auth = () => React.createElement('div')

Auth.getInitialProps = async ({ req, res }) => {
  const authData = await fetch(
    (req ? `https://${req.headers.host}` : '') + '/api/authdetails'
  )
  const data = await authData.json()

  const code = req.url.match('=(.*)')[1]
  data.code = code

  const getRefreshToken = async () => {
    return new Promise((resolve, reject) => {
      axios({
        method: 'POST',
        url: `https://accounts.spotify.com/api/token`,
        params: {
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: 'https://music-timer.matthewstanciu.now.sh/auth'
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization:
            'Basic ' +
            Buffer.from(`${data.clientId}:${data.clientSecret}`).toString(
              'base64'
            )
        }
      })
        .then(response => {
          resolve(response.data.refresh_token)
        })
        .catch(err => console.log(err))
    })
  }

  const refreshToken = await getRefreshToken()
  res.writeHead(302, {
    Location: `https://${req.headers.host}/app?refresh_token=${refreshToken}`
  })

  res.end()
  return {}
}

export default Auth
