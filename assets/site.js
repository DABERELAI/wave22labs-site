/* Restart all SMIL diagrams (and the CSS caption words on the DabereLIVE page) together;
   freeze them on a readable frame when the visitor prefers reduced motion. */
(function(){
  var svgs=[].slice.call(document.querySelectorAll('svg.anim'));
  var words=[].slice.call(document.querySelectorAll('.dl-w'));
  var reduce=window.matchMedia?window.matchMedia('(prefers-reduced-motion: reduce)'):{matches:false};
  function restart(){
    if(reduce.matches){svgs.forEach(function(s){if(s.pauseAnimations){s.pauseAnimations();s.setCurrentTime(parseFloat(s.getAttribute('data-still')||'8.5'));}});return;}
    svgs.forEach(function(s){if(s.setCurrentTime){s.setCurrentTime(0);s.unpauseAnimations();}});
    words.forEach(function(el){el.style.animation='none';void el.offsetWidth;el.style.animation='';});
  }
  restart();
  document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible')restart();});
  if(reduce.addEventListener)reduce.addEventListener('change',restart);
  /* close the mobile menu after picking a link */
  [].slice.call(document.querySelectorAll('.menu__panel a')).forEach(function(a){a.addEventListener('click',function(){var d=a.closest('details');if(d)d.removeAttribute('open');});});
})();
