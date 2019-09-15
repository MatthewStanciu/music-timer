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
          redirect_uri: 'https://timer-now-playing.matthewstanciu.now.sh/auth'
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

  const sendData = await fetch(`https://${req.headers.host}/api/spotify`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ refresh_token: refreshToken })
  })
  const content = await sendData.json()
  console.log(content)

  res.writeHead(302, {
    Location: `https://${req.headers.host}/app`
  })
  res.end()

  return {}
}

export default Auth
