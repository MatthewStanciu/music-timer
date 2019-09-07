import fetch from 'isomorphic-unfetch'
import querystring from 'query-string'
import Router from 'next/router'
import Link from 'next/link'

const redirect_uri = 'http://localhost:3000/auth'

const LoginPage = ({ client_id, client_secret, login_url }) => (
  <div>
    <Link href={login_url}>
      <a className="no-underline bg-green hover:bg-green-light text-white font-bold py-2 px-4 border-b-4 border-green-dark hover:border-green rounded">
        LOG IN
      </a>
    </Link>
  </div>
)

LoginPage.getInitialProps = ({ req }) =>
  fetch((req ? `http://${req.headers.host}` : '') + '/api/authdetails').then(
    res => res.json()
  )

export default LoginPage
