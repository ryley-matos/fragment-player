import React from 'react'
import FragmentPlayerProvider, {FragmentPlayerContext} from 'fragment-player'

const fragments = [{"fragmentBegin":3228.728,"fragmentEnd":3235.729,"src":"https://www.dropbox.com/s/5rs1qxmy5jn35gk/thunder.mp4?dl=1"},{"fragmentBegin":3815.461,"fragmentEnd":3821.515,"src":"https://www.dropbox.com/s/5rs1qxmy5jn35gk/thunder.mp4?dl=1"},{"fragmentBegin":3817.374,"fragmentEnd":3822.128,"src":"https://www.dropbox.com/s/5rs1qxmy5jn35gk/thunder.mp4?dl=1"},{"fragmentBegin":4509.508,"fragmentEnd":4537.675,"src":"https://www.dropbox.com/s/5rs1qxmy5jn35gk/thunder.mp4?dl=1"},{"fragmentBegin":4184.183,"fragmentEnd":4191.184,"src":"https://www.dropbox.com/s/5rs1qxmy5jn35gk/thunder.mp4?dl=1"},{"fragmentBegin":4063.062,"fragmentEnd":4071.064,"src":"https://www.dropbox.com/s/5rs1qxmy5jn35gk/thunder.mp4?dl=1"},{"fragmentBegin":3815.314,"fragmentEnd":3822.315,"src":"https://www.dropbox.com/s/5rs1qxmy5jn35gk/thunder.mp4?dl=1"},{"fragmentBegin":3744.744,"fragmentEnd":3752.245,"src":"https://www.dropbox.com/s/5rs1qxmy5jn35gk/thunder.mp4?dl=1"},{"fragmentBegin":3656.656,"fragmentEnd":3663.657,"src":"https://www.dropbox.com/s/5rs1qxmy5jn35gk/thunder.mp4?dl=1"},{"fragmentBegin":3574.073,"fragmentEnd":3581.074,"src":"https://www.dropbox.com/s/5rs1qxmy5jn35gk/thunder.mp4?dl=1"},{"fragmentBegin":3233.85,"fragmentEnd":3241.529,"src":"https://www.dropbox.com/s/5rs1qxmy5jn35gk/thunder.mp4?dl=1"},{"fragmentBegin":3228.728,"fragmentEnd":3233.85,"src":"https://www.dropbox.com/s/5rs1qxmy5jn35gk/thunder.mp4?dl=1"},{"fragmentBegin":2945.946,"fragmentEnd":2952.947,"src":"https://www.dropbox.com/s/5rs1qxmy5jn35gk/thunder.mp4?dl=1"}]

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
}

export default App
