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

const getFragmentIdx = (fragments, seconds) => fragments.findIndex(({startAt, endAt}) => seconds >= startAt && seconds < endAt)

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

  const currentFragmentIdx = useMemo(() => getFragmentIdx(enrichedFragments, currentTime), [enrichedFragments, totalLength, currentTime])

  const videoRefs = useMemo(() => {
    let tmp = {}
    for (var f of fragments) {
      tmp[`fragment-${f.fragmentBegin}-${f.fragmentEnd}`] = React.createRef()
    }
    return tmp
  }, [fragments])

  const currentVideoRef = useMemo(() => {
    const {fragmentBegin, fragmentEnd} = enrichedFragments[currentFragmentIdx] || {}
    return videoRefs[`fragment-${fragmentBegin}-${fragmentEnd}`]
  }, [videoRefs, currentFragmentIdx])
  
  const videos = useMemo(() => (
    enrichedFragments.map((f, idx) => {
      const id = `fragment-${f.fragmentBegin}-${f.fragmentEnd}`
      return (
        <video 
          ref={videoRefs[id]} 
          id={id} 
          src={`${f.src}#t=${f.fragmentBegin},${f.fragmentEnd}`}
          onLoadedMetadata={() => {
            videoRefs[id].current.currentTime = f.fragmentBegin
          }}
          playsInline 
          muted={"true"}
          style={{width: '100%', position: 'absolute', top: 0, left: 0, zIndex: currentFragmentIdx === idx ? 10 : 0}}
          onTimeUpdate={ playing && currentFragmentIdx === idx ? () => {
              const tmpTime = videoRefs[id].current.currentTime < f.fragmentBegin ? f.fragmentBegin : videoRefs[id].current.currentTime
              const newTime = tmpTime - f.fragmentBegin + f.startAt
              if (newTime >= totalLength) {
                setCurrentTime(totalLength)
                setPlaying(false)
              }
              else {
                setCurrentTime(newTime)
              }
          } : null}
        />
      )
    })
  ), [enrichedFragments, playing, currentFragmentIdx])

  useEffect(() => {
    const f = enrichedFragments[currentFragmentIdx]
    for (var key in videoRefs) {
      videoRefs[key]?.current?.pause()
    }
    if (f && playing) {
      const id = `fragment-${f.fragmentBegin}-${f.fragmentEnd}`
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
        totalLength: totalLength - .01,
        currentTime,
        playing,
        enrichedFragments,
        currentFragmentIdx,
        currentVideoRef,
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
