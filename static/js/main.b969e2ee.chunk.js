(this["webpackJsonpfragment-player-example"]=this["webpackJsonpfragment-player-example"]||[]).push([[0],{10:function(e,t,n){"use strict";n.r(t);n(5);var r=n(0),o=n.n(r),a=n(2),i=n.n(a),u=n(3);function l(){return(l=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(this,arguments)}function c(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function d(e,t){var n;if("undefined"===typeof Symbol||null==e[Symbol.iterator]){if(Array.isArray(e)||(n=function(e,t){if(e){if("string"===typeof e)return c(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?c(e,t):void 0}}(e))||t&&e&&"number"===typeof e.length){n&&(e=n);var r=0;return function(){return r>=e.length?{done:!0}:{done:!1,value:e[r++]}}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}return(n=e[Symbol.iterator]()).next.bind(n)}var v=function(e,t){return e.findIndex((function(e){var n=e.startAt,r=e.endAt;return t>=n&&t<=r}))},f=o.a.createContext({});var s=function(e){var t=e.children,n=e.fragments,a=e.loadVideo,i=Object(r.useRef)(),u=Object(r.useRef)(),c=Object(r.useRef)(),s=Object(r.useState)(!1),g=s[0],m=s[1],p=Object(r.useState)(0),h=p[0],b=p[1],y=Object(r.useMemo)((function(){return function(e){var t=0,n=null===e||void 0===e?void 0:e.map((function(e){var n=e.fragmentEnd-e.fragmentBegin,r=l({},e,{startAt:t,endAt:t+n});return t+=n,r}));return{totalLength:t,enrichedFragments:n}}(n)}),[n]),E=y.totalLength,O=y.enrichedFragments,j=v(O,h),w=Object(r.useState)({}),A=w[0],S=A.width,I=A.height,B=w[1],k=Object(r.useState)(!1),x=k[0],T=k[1];Object(r.useLayoutEffect)((function(){var e=function(){var e,t;B({width:null===u||void 0===u||null===(e=u.current)||void 0===e?void 0:e.clientWidth,height:null===u||void 0===u||null===(t=u.current)||void 0===t?void 0:t.clientHeight})};return window.addEventListener("resize",e),function(){return window.removeEventListener("resize",e)}})),Object(r.useEffect)((function(){var e,t;B({width:null===u||void 0===u||null===(e=u.current)||void 0===e?void 0:e.clientWidth,height:null===u||void 0===u||null===(t=u.current)||void 0===t?void 0:t.clientHeight})}),[null===i||void 0===i?void 0:i.current,null===u||void 0===u?void 0:u.current,a]);var C=Object(r.useMemo)((function(){return null===O||void 0===O?void 0:O.map((function(e,t){var n=document.createElement("video");return n.src=e.src,n.preload="auto",n.currentTime=e.fragmentBegin,t||(n.load(),n.onloadeddata=function(){var e;(T(!0),null===i||void 0===i?void 0:i.current)&&(null===i||void 0===i||null===(e=i.current)||void 0===e?void 0:e.getContext("2d")).drawImage(C[j],0,0,S,I)}),n}))}),[O,null===i||void 0===i?void 0:i.current,a]);Object(r.useEffect)((function(){var e=C[j];if(e){var t=function(){return e.play()};return g&&e&&e.addEventListener("canplay",t),4!==e.readyState&&e.load(),function(){e.pause(),e.removeEventListener("canplay",t)}}}),[O,j,g,C]),Object(r.useEffect)((function(){var e;x?(console.log("Fragment Player Ready!"),null===(e=C.slice(1))||void 0===e||e.map((function(e,t){var n=e;n.load(),n.onloadeddata=function(){console.log("loaded fragment ",t+1)}}))):console.log("Fragment Player Intializing...")}),[x,null===i||void 0===i?void 0:i.current]);var L=function(){g?(m(!1),C[j].pause()):(m(!0),C[j].play())};Object(r.useEffect)((function(){g&&C[j].play()}),[j,h,g]),Object(r.useEffect)((function(){for(var e,t,n=d(C);!(t=n()).done;){t.value.pause()}if(C[j]&&x&&(null===i||void 0===i?void 0:i.current)){var r=O[j];C[j].currentTime=h-r.startAt+(null===r||void 0===r?void 0:r.fragmentBegin),i.current.width=S,i.current.height=I;var o=null===i||void 0===i||null===(e=i.current)||void 0===e?void 0:e.getContext("2d");o.drawImage(C[j],0,0,S,I),clearInterval(null===c||void 0===c?void 0:c.current),c.current=setInterval((function(){var e,t,n,r,a,i;(null===(e=C[j])||void 0===e?void 0:e.currentTime)-(null===(t=O[j])||void 0===t?void 0:t.fragmentBegin)+(null===(n=O[j])||void 0===n?void 0:n.startAt)>=E?(b(E),L()):b((null===(r=C[j])||void 0===r?void 0:r.currentTime)-(null===(a=O[j])||void 0===a?void 0:a.fragmentBegin)+(null===(i=O[j])||void 0===i?void 0:i.startAt));o.drawImage(C[j],0,0,S,I)}),30)}}),[O,j,S,I,x,null===i||void 0===i?void 0:i.current]);var F=a?o.a.createElement("div",{style:{width:"100%",height:"100%"},ref:u},o.a.createElement("canvas",{ref:i,style:{width:"100%"},onClick:L})):null;return Object(r.useEffect)((function(){if(a&&C&&(C[j].load(),C[j].onloadeddata=function(){var e;(null===i||void 0===i||null===(e=i.current)||void 0===e?void 0:e.getContext("2d")).drawImage(C[j],0,0,S,I)}),!a&&C){m(!1);for(var e,t=d(C);!(e=t()).done;){e.value.pause()}}}),[a,C]),o.a.createElement(f.Provider,{value:{seekTo:function(e){if(console.log("seeking to",e),v(O,h)===j){var t=O[j];C[j].currentTime=e-t.startAt+(null===t||void 0===t?void 0:t.fragmentBegin)}console.log("setting current time",e),b(e)},togglePlay:L,currentTime:h,totalLength:E,video:F,videos:C,playing:g}},t)},g=[{src:"http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",fragmentBegin:0,fragmentEnd:5},{src:"http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",fragmentBegin:1,fragmentEnd:25},{src:"http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",fragmentBegin:1,fragmentEnd:3}],m=function(){var e=Object(r.useState)(!1),t=Object(u.a)(e,2),n=t[0],a=t[1];return o.a.createElement(s,{fragments:g,loadVideo:n},o.a.createElement(f.Consumer,null,(function(e){var t=e.video,r=e.seekTo,i=e.currentTime,u=e.totalLength;return o.a.createElement("div",{style:{width:"100%"}},o.a.createElement("button",{onClick:function(){return a(!n)}},"Show Video"),t,o.a.createElement("input",{style:{width:"100%"},type:"range",min:0,max:u,value:i,onChange:function(e){return r(parseInt(e.target.value))}}))})))};i.a.render(o.a.createElement(m,null),document.getElementById("root"))},4:function(e,t,n){e.exports=n(10)},5:function(e,t,n){}},[[4,1,2]]]);
//# sourceMappingURL=main.b969e2ee.chunk.js.map