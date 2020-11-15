import React, { useState } from 'react'
import FragmentPlayerProvider, {FragmentPlayerContext} from 'fragment-player'

const FRAGMENTS = [
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
  const [edit, setEdit] = useState(false)
  const [data, setData] = useState({
    fragments: FRAGMENTS,
  })
  const fragments = JSON.parse(JSON.stringify(data?.fragments))
  return (
    <FragmentPlayerProvider fragments={edit ? [...fragments.slice(0, 1), {...fragments[1], fragmentEnd: fragments[1].fragmentEnd + 10}, ...fragments.slice(2)] : fragments}>
      <FragmentPlayerContext.Consumer>
        {({Video, seekTo, currentTime, totalLength, playing, togglePlay}) => {
          return (
            <div style={{width: '75%', margin: 'auto'}}>
              <button onClick={() => setEdit(!edit)}>Simulate Edit</button>
              <button onClick={togglePlay}>{playing ? 'Pause' : 'Play'}</button>
              <button onClick={() => setData({...data, extra: (data?.extra || '') + 'asdf'})}>change data</button>
              <div style={{width: 1600, height: 900}} >{Video}</div>
              <input style={{width: '100%'}} type="range" min={0} max={totalLength} value={currentTime} onChange={(e) => seekTo(parseInt(e.target.value))}/>
            </div>
          )
        }}
      </FragmentPlayerContext.Consumer>
    </FragmentPlayerProvider>
  )
}

export default App
