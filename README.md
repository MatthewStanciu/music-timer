# timer-now-playing
Displays a timer alongside the current song playing in Spotify. The first Next.js project (that I'm aware of) to implement OAuth authentication using only Next.js API Routes. Fontend by [@lachlanjc](https://github.com/lachlanjc) 💖

## To run locally
1. Download this project
2. cd into the project directory
3. npm i
4. now dev

# FAQ
## Why the hell are you handling authentication the way you're handling it?
Because it's fun. And nobody has done it before, to my knowledge. And not needing to set up a custom Express server unlocks some of Next.js' best features, which there is currently no way to do if you need to handle OAuth authentication.

## Isn't it objectively easier to set up an Express server for this?
Probably. [Here's an example](https://github.com/tmb/seethemusic/blob/master/server.js) of how easy it is with an Express server. But I believe that with a little bit of code cleanup, this can be a serious alternative for people who don't want an Express server that's still easy to understand and use.

## "A little bit" of code cleanup? Are you aware that you're using 3 different HTTP request libraries to handle data?
Yes. This project is a hack, and it's currently horrendous. I'm trying to get it to work in production before I fix the glaring issues with it. Leave me alone
