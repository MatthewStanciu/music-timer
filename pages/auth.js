import React from 'react'
import axios from 'axios'
import fetch from 'isomorphic-unfetch'

export default class extends React.Component {
  static async getInitialProps({ req, res }) {
    const authData = await fetch(
      (req ? `http://${req.headers.host}` : '') + '/api/authdetails'
    )
    const data = await authData.json()

    const code = req.url.match('=(.*)')[1]
    data.code = code

    const getAccessToken = async () => {
      let tokenPromise = new Promise((resolve, reject) => {
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
            //console.log(`access token: ${response.data.access_token}`)
            // get the access token oUT OF HERE!!!
            resolve(response.data.access_token)
          })
          .catch(err => console.log(err))
      })
      return tokenPromise
    }

    const token = await getAccessToken()
    console.log(token)
    res.writeHead(302, {
      Location: `http://localhost:3000/app?access_token=${token}`
    })
    res.end()

    return {}
  }
  render() {
    return React.createElement('div')
  }
}
