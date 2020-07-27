/* global chrome */

function onInstructionsCloseClick(e) {
  e.preventDefault();
  chrome.runtime.sendMessage({messageType: MESSAGE_TYPE_CLOSE_POPUP});
}

function instructionsEmbedMain() {
  const closeButtonEl = document.getElementById('instructions_close_button');
  closeButtonEl.addEventListener('click', onInstructionsCloseClick);
}

window.addEventListener('load', () => instructionsEmbedMain());
