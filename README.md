# fragment-player

> Play and seek through fragments of videos within a single player

[![NPM](https://img.shields.io/npm/v/fragment-player.svg)](https://www.npmjs.com/package/fragment-player) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save fragment-player
```

## Usage

```jsx
import React from 'react'
import FragmentPlayerProvider, {FragmentPlayerContext} from 'fragment-player'

const fragments = [
  {
    src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    fragmentBegin: 0,
    fragmentEnd: 5,
  },
  {
    src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    fragmentBegin: 1,
    fragmentEnd: 25,
  },
  {
    src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    fragmentBegin: 1,
    fragmentEnd: 3,
  },
]

const App = () => {
  return (
    <FragmentPlayerProvider fragments={fragments}>
      <FragmentPlayerContext.Consumer>
        {({video, seekTo, currentTime, totalLength}) => {
          return (
            <div style={{width: '100%'}}>
              {video}
              <input style={{width: '100%'}} type="range" min={0} max={totalLength} value={currentTime} onChange={(e) => seekTo(parseInt(e.target.value))}/>
            </div>
          )
        }}
      </FragmentPlayerContext.Consumer>
    </FragmentPlayerProvider>
  )
```

## License

MIT © [ryley-matos](https://github.com/ryley-matos)
