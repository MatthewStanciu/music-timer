import React from 'react'
import fetch from 'isomorphic-unfetch'

const LoginPage = () => React.createElement('div')

LoginPage.getInitialProps = async ({ req, res }) => {
  const authDetails = await fetch(
    (req ? `http://${req.headers.host}` : '') + '/api/authdetails'
  )
  const data = await authDetails.json()

  res.writeHead(302, {
    Location: data.login_url
  })
  res.end()

  return {}
}

export default LoginPage
