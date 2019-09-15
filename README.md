# music-timer
Displays a timer alongside the current song playing in Spotify. The first Next.js project to implement OAuth authentication using only Next.js API Routes. Fontend by [@lachlanjc](https://github.com/lachlanjc) 💖

# FAQ
## Why the hell are you handling authentication this way?
Because it's fun. And nobody has done it before. And not needing to set up a custom Express server unlocks some of Next.js' best features, which there is currently no way to do if you need to handle OAuth authentication.

## Isn't it objectively easier to set up an Express server for this?
[Yeah.](https://github.com/tmb/seethemusic/blob/master/server.js) But I believe that with a little bit of code cleanup, this can be a serious alternative for people who don't want an Express server that's still easy to understand and implement.

## "A little bit" of code cleanup? Are you aware that you're using 3 different HTTP request libraries to handle data?
Yes. This project is a hack, and it's horrendous, and I spent so much time trying to get this to work that I'm not interested in making it better. If you want to make it better, though, please do :)
