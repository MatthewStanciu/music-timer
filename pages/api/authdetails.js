require('dotenv').config()
import querystring from 'query-string'

const loginUrl =
  'https://accounts.spotify.com/authorize?' +
  querystring.stringify({
    response_type: 'code',
    client_id: process.env.CLIENT_ID,
    scope: 'user-read-private user-read-email',
    redirect_uri: 'http://localhost:3000/auth'
  })

export default (req, res) => {
  res.json({
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    login_url: loginUrl
  })
}
