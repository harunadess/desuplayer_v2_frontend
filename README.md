# Desuplayer V2 Frontend
Frontend for [Desuplayer V2 Server](https://github.com/jordanjohnston/desuplayer_v2_frontend)

Written in React + JS (currently porting to TypeScript).

It is supposed to be a reasonable looking music player that is decoupled from the backend - so you don't have to have everything on the same system or can access it on multiple systems.

Also had the goal of not being as slow as molasses, and resource heavy - but there are probably too many images to promise that.


## Deployment
- Install [nodejs](https://nodejs.org/en/download/) (LTS is fine).
- Install [yarn](https://yarnpkg.com/) by running `npm i -g yarn`
- In the root of the folder, run the following build command: `yarn run build`
- From there, you can run `node ./serveBuild.js`
- It will be accessible through the link in the terminal that should appear
  - It should default to `[http://localhost:8080](http://localhost:8080)` but you can change this if you want.