import React, {useMemo, useState, useEffect}  from 'react';

/*
  Very roughly based off totimedli's solution on stack overflow:
    https://stackoverflow.com/questions/34097834/html5-video-how-to-do-a-seamless-play-and-or-loop-of-several-videos
*/

const enrichFragments = (fragments) => {
  var totalLength = 0
  const enrichedFragments = fragments?.map((f) => {
    const tmpLength = f.fragmentEnd - f.fragmentBegin
    const tmp = {...f, startAt: totalLength, endAt: totalLength + tmpLength}
    totalLength += tmpLength
    return tmp
  })
  return {totalLength, enrichedFragments}
}

const getFragmentIdx = (fragments, seconds) => fragments.findIndex(({startAt, endAt}) => seconds >= startAt && seconds <= endAt)

const FragmentPlayerContext = React.createContext({})

/*
  Fragment:
    fragmentBegin: seconds (relative to original video)
    fragmentEnd: seconds (relative to original video)
    src: video source
*/


function FragmentPlayerProvider({children, fragments}) {

  const [currentTime, setCurrentTime] = useState(0)

  const [playing, setPlaying] = useState()

  const {totalLength, enrichedFragments} = useMemo(() => enrichFragments(fragments), [fragments])

  const currentFragmentIdx = useMemo(() => getFragmentIdx(enrichedFragments, currentTime))

  const videoRefs = useMemo(() => {
    let tmp = {}
    for (var f of fragments) {
      tmp[`fragment-${f.fragmentBegin}-${f.fragmentEnd}`] = React.createRef()
    }
    return tmp
  }, [fragments])
  
  const videos = useMemo(() => (
    enrichedFragments.map((f, idx) => {
      const id = `fragment-${f.fragmentBegin}-${f.fragmentEnd}`
      return (
        <video 
          ref={videoRefs[id]} 
          id={id} 
          src={`${f.src}#t=${f.fragmentBegin},${f.fragmentEnd}`}
          playsInline 
          muted={"true"}
          style={{width: '100%', position: 'absolute', top: 0, left: 0, zIndex: currentFragmentIdx === idx ? 10 : 0}}
          onTimeUpdate={() => {
            if (playing && currentFragmentIdx === idx) {
              const newTime = videoRefs[id]?.current?.currentTime - f.fragmentBegin + f.startAt
              console.log({newTime, totalLength})
              if (newTime >= totalLength) {
                setCurrentTime(totalLength)
                setPlaying(false)
              }
              else {
                setCurrentTime(newTime)
              }
            }
          }}
        />
      )
    })
  ), [enrichedFragments, playing, currentFragmentIdx])

  useEffect(() => {
    const f = enrichedFragments[currentFragmentIdx]
    console.log(f)
    for (var key in videoRefs) {
      videoRefs[key]?.current?.pause()
    }
    if (f && playing) {
      const id = `fragment-${f.fragmentBegin}-${f.fragmentEnd}`
      console.log('f.currentTime', currentTime)
      const diff = currentTime - f.startAt
      videoRefs[id].current.currentTime = f.fragmentBegin + diff
      videoRefs[id]?.current?.play()
    }
  }, [currentFragmentIdx, playing])

  const seekTo = (seconds) => {
    for (var key in videoRefs) {
      videoRefs[key]?.current?.pause()
    }
    const newFragment = enrichedFragments[
      getFragmentIdx(enrichedFragments, seconds)
    ]
    const id = `fragment-${newFragment.fragmentBegin}-${newFragment.fragmentEnd}`
    const diff = seconds - newFragment.startAt
    videoRefs[id].current.currentTime = newFragment.fragmentBegin + diff
    if (playing) {
      videoRefs[id]?.current?.play()
    }
    setCurrentTime(seconds)
  }

  const togglePlay = () => {
    if (playing) {
      const f = enrichedFragments[currentFragmentIdx]
      const id = `fragment-${f.fragmentBegin}-${f.fragmentEnd}`
      videoRefs[id]?.current?.pause()
      setPlaying(false)
    }
    else {
      const f = enrichedFragments[currentFragmentIdx]
      const id = `fragment-${f.fragmentBegin}-${f.fragmentEnd}`
      videoRefs[id]?.current?.play()
      setPlaying(true)
    }
  }

  const Video = useMemo(
    () => (
      <div style={{position: 'relative'}}>
        {videos}
      </div>
   ), [videos])

  return (
    <FragmentPlayerContext.Provider
      value={{
        Video,
        totalLength,
        currentTime,
        playing,
        enrichedFragments,
        seekTo,
        togglePlay,
      }}
    >
      {children}
    </FragmentPlayerContext.Provider>
  );
}

export default FragmentPlayerProvider
export { FragmentPlayerContext }
