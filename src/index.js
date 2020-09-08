import React, { useRef, useMemo, useState, useEffect, useLayoutEffect, useCallback }  from 'react';

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

function FragmentPlayerProvider({children, fragments, loadVideo}) {
  const canvasRef = useRef()
  const contentRef = useRef()
  const drawInterval = useRef()
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const {totalLength, enrichedFragments} = useMemo(() => enrichFragments(fragments), [fragments])
  const currentVideoIdx = getFragmentIdx(enrichedFragments, currentTime)
  const [{ width, height }, setSize] = useState({})
  const [ready, setReady] = useState(false)

  useLayoutEffect(() => {
    const onResize = () => {
      setSize({
        width: contentRef?.current?.clientWidth,
        height: contentRef?.current?.clientHeight,
      })
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  })

  useEffect(() => {
    setSize({
      width: contentRef?.current?.clientWidth,
      height: contentRef?.current?.clientHeight,
    })
  }, [canvasRef?.current, contentRef?.current, loadVideo])

  const videos = useMemo(() => enrichedFragments?.map((f, idx) => {
    const tmp = document.createElement('video')
    tmp.src = f.src
    tmp.preload = "auto"
    tmp.currentTime = f.fragmentBegin
    if (!idx) {
      tmp.load()
      tmp.onloadeddata = () => {
        setReady(true)
        if (canvasRef?.current) {
          const ctx = canvasRef?.current?.getContext('2d')
          ctx.drawImage(videos[currentVideoIdx] ,0, 0, width, height)
        }
      }
    }
    return tmp
  }), [enrichedFragments, canvasRef?.current, loadVideo])
  

  useEffect(() => {
    const video = videos[currentVideoIdx]
    if (!video) {
      return
    }
    const onCanPlay = () => video.play()
    if (playing && video) {
      video.addEventListener('canplay', onCanPlay)
    }
    if (video.readyState !== 4) {
      video.load()
    }
    return () => {
      video.pause()
      video.removeEventListener('canplay', onCanPlay)
    }
  }, [enrichedFragments, currentVideoIdx, playing, videos])

  useEffect(() => {
    if (ready) {
      console.log('Fragment Player Ready!' )
      videos.slice(1)?.map((video, idx) => {
        const tmp = video
        tmp.load()
        tmp.onloadeddata = () => {
          console.log('loaded fragment ', idx + 1)
        }
      })
    }
    else {
      console.log('Fragment Player Intializing...')
    }
  }, [ready, canvasRef?.current])


  const seekTo = (seconds) => {
    console.log('seeking to', seconds)
    const newIdx = getFragmentIdx(enrichedFragments, currentTime)
    if (newIdx === currentVideoIdx) {
      const fragment = enrichedFragments[currentVideoIdx]
      videos[currentVideoIdx].currentTime = seconds - fragment.startAt + fragment?.fragmentBegin
    }
    console.log('setting current time', seconds)
    setCurrentTime(seconds)
  }

  const togglePlay = () => {
    if (playing) {
      setPlaying(false)
      videos[currentVideoIdx].pause()
    }
    else {
      setPlaying(true)
      videos[currentVideoIdx].play()
    }
  }

  useEffect(() => {
    if (playing) {
      videos[currentVideoIdx].play()
    }
  }, [currentVideoIdx, currentTime, playing])

  useEffect(() => {
    for (var video of videos) {
      video.pause()
    }
    if (!videos[currentVideoIdx] || !ready || !canvasRef?.current) {
      return
    }
    const fragment = enrichedFragments[currentVideoIdx]
    videos[currentVideoIdx].currentTime = currentTime - fragment.startAt + fragment?.fragmentBegin

    canvasRef.current.width = width
    canvasRef.current.height = height
    const ctx = canvasRef?.current?.getContext('2d')

    ctx.drawImage(videos[currentVideoIdx],0, 0, width, height)
    clearInterval(drawInterval?.current)
    drawInterval.current = setInterval(() => {
      const newTime = videos[currentVideoIdx]?.currentTime - enrichedFragments[currentVideoIdx]?.fragmentBegin + enrichedFragments[currentVideoIdx]?.startAt
      if (newTime >= totalLength) {
        setCurrentTime(totalLength)
        togglePlay()
      }
      else {
        setCurrentTime(videos[currentVideoIdx]?.currentTime - enrichedFragments[currentVideoIdx]?.fragmentBegin + enrichedFragments[currentVideoIdx]?.startAt)
      }
      ctx.drawImage(videos[currentVideoIdx],0, 0, width, height)
    }, 30)
  }, [enrichedFragments, currentVideoIdx, width, height, ready, canvasRef?.current])

  const video = loadVideo ? 
    <div style={{width: '100%', height: '100%', }} ref={contentRef}>
      <canvas ref={canvasRef} style={{width: '100%'}}  onClick={togglePlay}/>
    </div>
    :
    null

  useEffect(() => {
    if (loadVideo && videos) {
      videos[currentVideoIdx].load()
      videos[currentVideoIdx].onloadeddata = () => {
        const ctx = canvasRef?.current?.getContext('2d')
        ctx.drawImage(videos[currentVideoIdx],0, 0, width, height)
      }
    }
    if (!loadVideo && videos) {
        setPlaying(false)
        for (var v of videos) {
          v.pause()
        }
    }
  }, [loadVideo, videos])
    
  
  return (
    <FragmentPlayerContext.Provider
      value={{
        seekTo,
        togglePlay,
        currentTime,
        totalLength,
        video,
        videos,
        playing,
      }}
    >
      {children}
    </FragmentPlayerContext.Provider>
  );
}

export default FragmentPlayerProvider
export { FragmentPlayerContext }
