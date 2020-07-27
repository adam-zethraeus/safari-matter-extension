/* global chrome */
function onSavePostButtonClick(e) {
  e.preventDefault();
  chrome.runtime.sendMessage({messageType: MESSAGE_TYPE_SAVE_POST_CLICK});
}

function saveEmbedMain() {
  const postButtonEl = document.getElementById('save_post_button');
  postButtonEl.addEventListener('click', onSavePostButtonClick);
}

window.addEventListener('load', () => saveEmbedMain());
