import React from 'react'
import axios from 'axios'
import fetch from 'isomorphic-unfetch'

const Auth = () => React.createElement('div')

Auth.getInitialProps = async ({ req, res }) => {
  const authData = await fetch(
    (req ? `http://${req.headers.host}` : '') + '/api/authdetails'
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
          redirect_uri: 'http://localhost:3000/auth'
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization:
            'Basic ' +
            new Buffer(`${data.client_id}:${data.client_secret}`).toString(
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

  fetch((req ? `http://${req.headers.host}` : '') + '/api/spotify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ refresh_token: refreshToken })
  })
    .then(r => console.log('success'))
    .catch(err => console.log(err))

  res.writeHead(302, {
    Location: `http://localhost:3000/app`
  })
  res.end()

  return {}
}

export default Auth
