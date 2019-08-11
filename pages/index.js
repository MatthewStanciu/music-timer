import fetch from 'isomorphic-unfetch'

const Page = ({ artist, title }) => (
  <main>
    <h1>Artist: {artist}</h1>
    <h1>Song Title: {title}</h1>
  </main>
)

Page.getInitialProps = ({ req }) =>
  fetch((req ? `http://${req.headers.host}` : '') + '/api/spotify').then(res =>
    res.json()
  )

export default Page
