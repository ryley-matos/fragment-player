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

const usePrev = value => {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}


function FragmentPlayerProvider({children, fragments, loadVideo}) {
  const canvasRef = useRef()
  const contentRef = useRef()
  const drawInterval = useRef()

  //handles pausing while seeking
  const seekTimeout = useRef({tmpPlaying: undefined, timeout: undefined})

  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const {totalLength, enrichedFragments} = useMemo(() => enrichFragments(fragments), [fragments])
  const currentVideoIdx = getFragmentIdx(enrichedFragments, currentTime)
  const [{ width, height }, setSize] = useState({})
  const [ready, setReady] = useState(false)
  const [loadedIdx, setLoadedWrapper] = useState(-1)
  
  useEffect(() => {
    const vidContainer = document.createElement('div')
    vidContainer.style.display = 'none'
    vidContainer.id = 'fragment-dummy'
    document.body.appendChild(
      vidContainer
    )
    return () => document.body.removeChild(vidContainer)
  }, [])

  const setLoadedIdx = (idx) => {
    setLoadedWrapper(idx)
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

  const video = loadVideo ? 
    <div style={{width: '100%', height: '100%', }} ref={contentRef}>
      <canvas ref={canvasRef} style={{width: '100%'}}  onClick={togglePlay}/>
    </div>
    :
    null

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
  }, [canvasRef?.current, contentRef?.current, loadVideo, ready])

  const videos = useMemo(() => {
    setReady(false)
    return loadVideo ? enrichedFragments?.map((f, idx) => {
      const id = `${f.fragmentBegin}-${f.fragmentEnd}-${f.src}`
      const cached = document.getElementById(id)
      const tmp = cached || document.createElement('video')
      if (!idx && !cached) {
        tmp.src = f.src
        tmp.preload = "auto"
        tmp.currentTime = f.fragmentBegin
        tmp.load()
        tmp.onloadeddata = () => {
          setReady(true)
          setLoadedIdx(idx)
        }
      } else if (!idx) {
        setReady(true)
        setLoadedIdx(idx)
      }
      if (!cached) {
        tmp.id = id
        const fragmentDummy = document.getElementById('fragment-dummy')
        fragmentDummy.appendChild(tmp)
      }
      return tmp
    }) : []
  }, [enrichedFragments, canvasRef?.current, loadVideo])

  useEffect(() => {
    const loadVidIdx = loadedIdx + 1
    const v = videos[loadVidIdx]
    const f = enrichedFragments[loadVidIdx]
    if (v) {
      v.src = f.src
      v.preload="auto"
      if (loadVidIdx === currentVideoIdx) {
        v.currentTime = currentTime - f.startAt + f?.fragmentBegin
      }
      else {
        v.currentTime = f.fragmentBegin
      }
      v.load()
      v.onloadeddata = () => {
        setLoadedIdx(loadVidIdx)
      }
    }
  }, [loadedIdx])
  

  useEffect(() => {
    const video = videos[currentVideoIdx]
    if (!video) {
      return
    }
    const onCanPlay = () => video.play()
    if (playing && video) {
      video.addEventListener('canplay', onCanPlay)
    }
    return () => {
      video.pause()
      video.removeEventListener('canplay', onCanPlay)
    }
  }, [enrichedFragments, currentVideoIdx, playing, videos])


  //pause for ms then return to original play state
  const tmpPause = (ms) => {
    if (seekTimeout?.current?.tmpPlaying === undefined) {
      seekTimeout.current.tmpPlaying = playing
    }
    setPlaying(false)
    clearTimeout(seekTimeout.current.timeout)
    seekTimeout.current.timeout = setTimeout(() => {
      setPlaying(seekTimeout?.current?.tmpPlaying)
      seekTimeout.current.tmpPlaying = undefined
    }, ms)
  }


  const seekTo = (seconds) => {
    tmpPause(100)
    const newIdx = getFragmentIdx(enrichedFragments, currentTime)
    if (newIdx === currentVideoIdx) {
      const fragment = enrichedFragments[currentVideoIdx]
      videos[currentVideoIdx].currentTime = seconds - fragment.startAt + fragment?.fragmentBegin
    }
    setCurrentTime(seconds)
  }

  

  useEffect(() => {
    if (playing) {
      videos[currentVideoIdx].play()
    }
  }, [currentVideoIdx, currentTime, playing])

  useEffect(() => {
    for (var v of videos) {
      v.pause()
    }
    if (!videos[currentVideoIdx] || !ready || !canvasRef?.current || !video) {
      return
    }
    const fragment = enrichedFragments[currentVideoIdx]

    // const newTime = currentTime - fragment?.startAt + fragment?.fragmentBegin
    // if (newTime === fragment?.fragmentBegin) { //check video hasnt already progressed
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
      else if (newTime <= 0) {
        setCurrentTime(0)
        togglePlay()
      }
      else {
        setCurrentTime(newTime)
      }
      ctx.drawImage(videos[currentVideoIdx],0, 0, width, height)
    }, 30)
  }, [enrichedFragments, currentVideoIdx, width, height, ready])

  useEffect(() => {
    if (!loadVideo && videos) {
        setPlaying(false)
    }
  }, [loadVideo, videos, contentRef?.current])
    
  
  return (
    <FragmentPlayerContext.Provider
      value={{
        seekTo,
        togglePlay,
        setPlaying,
        ready,
        currentTime,
        totalLength,
        video,
        videos,
        playing,
        currentVideoIdx,
        tmpPause,
      }}
    >
      {children}
    </FragmentPlayerContext.Provider>
  );
}

export default FragmentPlayerProvider
export { FragmentPlayerContext }
