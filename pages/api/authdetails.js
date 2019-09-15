require('dotenv').config()
import querystring from 'query-string'

const loginUrl =
  'https://accounts.spotify.com/authorize?' +
  querystring.stringify({
    response_type: 'code',
    client_id: process.env.CLIENT_ID,
    scope:
      'user-read-private user-read-email user-read-currently-playing user-read-playback-state',
    redirect_uri: 'https://timer-now-playing.matthewstanciu.now.sh/auth'
  })

export default (req, res) => {
  res.json({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    loginUrl: loginUrl
  })
}
