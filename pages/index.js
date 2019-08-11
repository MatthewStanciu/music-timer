import fetch from 'isomorphic-unfetch'

const Page = ({ artist, title, albumCover }) => (
  <main>
    <h1>Artist: {artist}</h1>
    <h1>Song Title: {title}</h1>
    <img src={albumCover} />

    <style jsx>
      {`
        img {
          width: 256px;
          height: 256px;
        }
      `}
    </style>
  </main>
)

Page.getInitialProps = ({ req }) =>
  fetch((req ? `http://${req.headers.host}` : '') + '/api/spotify').then(res =>
    res.json()
  )

export default Page
