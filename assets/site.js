/* Diagram motion. All SMIL diagrams (and the CSS caption words on the DabereLIVE page) run together.
   Everyone gets a Pause / Play control. Visitors who prefer reduced motion start on a still, readable
   frame and can press Play to watch the animation. */
(function(){
  var root=document.documentElement;
  var svgs=[].slice.call(document.querySelectorAll('svg.anim'));
  var words=[].slice.call(document.querySelectorAll('.dl-w'));
  var mq=window.matchMedia?window.matchMedia('(prefers-reduced-motion: reduce)'):{matches:false};
  var playing=!mq.matches, opted=false, btns=[];
  function still(){svgs.forEach(function(s){if(s.pauseAnimations){s.pauseAnimations();s.setCurrentTime(parseFloat(s.getAttribute('data-still')||'8.5'));}});}
  function start(){
    svgs.forEach(function(s){if(s.setCurrentTime){s.setCurrentTime(0);s.unpauseAnimations();}});
    words.forEach(function(el){el.style.animation='none';void el.offsetWidth;el.style.animation='';});
  }
  function render(){
    root.classList.toggle('motion-on',opted);
    root.classList.toggle('motion-paused',!playing&&(opted||!mq.matches));
    btns.forEach(function(b){b.classList.toggle('is-paused',!playing);b.querySelector('span').textContent=playing?b.getAttribute('data-pause'):b.getAttribute('data-play');});
  }
  function toggle(){
    if(playing){svgs.forEach(function(s){if(s.pauseAnimations)s.pauseAnimations();});playing=false;}
    else if(mq.matches&&!opted){opted=true;playing=true;render();start();return;}
    else{svgs.forEach(function(s){if(s.unpauseAnimations)s.unpauseAnimations();});playing=true;}
    render();
  }
  if(playing)start();else still();
  /* one control per page, right under the diagram (engine pages) or the engine cards (home) */
  var anchor=document.querySelector('.estage--v')||document.querySelector('.dl-mstage')||document.querySelector('#technology .egrid');
  if(svgs.length&&anchor){
    var many=anchor.classList.contains('egrid');
    var bar=document.createElement('div');
    bar.className='motion-bar'+(many?' motion-bar--grid':'');
    bar.innerHTML='<button type="button" class="motion-toggle" data-pause="'+(many?'Pause animations':'Pause animation')+'" data-play="'+(many?'Play animations':'Play animation')+'">'+
      '<svg class="i-pause" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><rect x="2" y="1.5" width="2.6" height="9" rx=".8" fill="currentColor"/><rect x="7.4" y="1.5" width="2.6" height="9" rx=".8" fill="currentColor"/></svg>'+
      '<svg class="i-play" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 1.6v8.8a.6.6 0 0 0 .9.5l7-4.4a.6.6 0 0 0 0-1L3.9 1.1a.6.6 0 0 0-.9.5Z" fill="currentColor"/></svg>'+
      '<span></span></button>';
    anchor.parentNode.insertBefore(bar,anchor.nextSibling);
    btns=[bar.querySelector('button')];
    btns[0].addEventListener('click',toggle);
  }
  render();
  document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible'&&playing)start();});
  function onPref(){if(opted)return;playing=!mq.matches;if(playing)start();else still();render();}
  if(mq.addEventListener)mq.addEventListener('change',onPref);else if(mq.addListener)mq.addListener(onPref);
  /* close the mobile menu after picking a link */
  [].slice.call(document.querySelectorAll('.menu__panel a')).forEach(function(a){a.addEventListener('click',function(){var d=a.closest('details');if(d)d.removeAttribute('open');});});
})();
