require('dotenv').config()
const express = require('express')
const next = require('next')
const request = require('request')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const querystring = require('querystring')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const redirect_uri = 'https://localhost:3000/callback'

app.prepare().then(() => {
  const server = express()
  const middlewares = [bodyParser.urlencoded(), cookieParser('sesh-dash')]
  server.use(middlewares)

  server.get('/', (req, res) => {
    res.redirect(
      'https://accounts.spotify.com/authorize?' +
        querystring.stringify({
          response_type: 'code',
          client_id: process.env.CLIENT_ID,
          scope: 'user-read-private user-read-email',
          redirect_uri: redirect_uri
        })
    )
  })

  server.get('/callback', (req, res) => {
    const code = req.query.code || null

    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        Authorization:
          'Basic ' +
          new Buffer(
            `(${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
          ).toString('base64')
      },
      json: true
    }

    request.post(authOptions, (err, res, body) => {
      const access_token = body.access_token,
        refresh_token = body.refresh_token

      /*if (req.cookies['accessToken']) res.clearCookie('accessToken')
      if (req.cookies['refreshToken']) res.clearCookie('refreshToken')

      res.cookie('accessToken', access_token, {
        maxAge: 900000,
        httpOnly: true
      })
      res.cookie('refreshToken', refresh_token, {
        maxAge: 900000,
        httpOnly: true
      })*/

      return res.redirect(
        `/app?access_token=${access_token}&refresh_token=${refresh_token}`
      )
    })
  })

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, err => {
    if (err) throw err
    console.log(`> Listening on port ${port}`)
  })
})
