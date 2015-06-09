
document.cancelFullScreen = document.webkitExitFullscreen || document.mozCancelFullScreen || document.exitFullscreen;

document.addEventListener('keydown', function(e) {
  switch (e.keyCode) {
    case 13: // ENTER. ESC should also take you out of fullscreen by default.
      e.preventDefault();
      document.cancelFullScreen();
      break;
    case 70: // f
      enterFullscreen();
      break;
  }
}, false);


/**
 * Create onFullScreenEnter event when entering fullscreen
 */
function onFullScreenEnter() {
  elem.onwebkitfullscreenchange = onFullScreenExit;
  elem.onmozfullscreenchange = onFullScreenExit;

  var event = new CustomEvent("onFullScreenEnter", {
    bubbles: false,
  	cancellable: true
  });

  document.dispatchEvent(event);
}


/**
 * Create onFullScreenExit event when exiting fullscreen
 */
function onFullScreenExit() {
  var event = new CustomEvent("onFullScreenExit", {
    bubbles: false,
  	cancellable: true
  });

  document.dispatchEvent(event);
}


/**
 * Enter fullscreen mode
 *
 * Note: FF nightly needs about:config full-screen-api.enabled set to true.
 */
function enterFullscreen() {
  var elem = document.querySelector("#fullscreen");

  if(!elem) {
    console.log("Could not find element");
    return;
  }

  elem.onwebkitfullscreenchange = onFullScreenEnter;
  elem.onmozfullscreenchange = onFullScreenEnter;
  elem.onfullscreenchange = onFullScreenEnter;

  if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
  } else {
    if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else {
      elem.requestFullscreen();
    }
  }

  document.getElementById('enter-exit-fs').onclick = exitFullscreen;
}


/**
 * Explicitly exit fullscreen mode
 */
function exitFullscreen() {
  document.cancelFullScreen();
  document.getElementById('enter-exit-fs').onclick = enterFullscreen;
}
