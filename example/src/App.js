import React, { useState } from 'react'
import FragmentPlayerProvider, {FragmentPlayerContext} from 'fragment-player'
import {AutoSizer} from 'react-virtualized';

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
  const [visible, setVisisble] = useState(false)
  const [edit, setEdit] = useState(false)
  return (
    <FragmentPlayerProvider fragments={edit ? fragments.slice(1) : fragments} loadVideo={visible}>
      <FragmentPlayerContext.Consumer>
        {({seekTo, currentTime, totalLength, video , setSize}) => {
          return (
            <div style={{width: '100%'}}>
              <button onClick={() => setVisisble(true)}>Show Video</button>
              <button onClick={() => setEdit(!edit)}>Simulate Edit</button>
              {video}
              <input style={{width: '100%'}} type="range" min={0} max={totalLength} value={currentTime} onChange={(e) => seekTo(parseInt(e.target.value))}/>
            </div>
          )
        }}
      </FragmentPlayerContext.Consumer>
    </FragmentPlayerProvider>
  )
}

export default App
