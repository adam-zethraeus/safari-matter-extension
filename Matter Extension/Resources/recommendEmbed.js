/* global chrome */

function onRecPostButtonClick(e) {
  e.preventDefault();
  const blurbEl = document.getElementById('recommend_blurb');
  chrome.runtime.sendMessage({
    messageType: MESSAGE_TYPE_RECOMMEND_SUBMIT_CLICK,
    blurb: blurbEl.value});
}

function onRecCloseButtonClick(e) {
  e.preventDefault();
  chrome.runtime.sendMessage({messageType: MESSAGE_TYPE_CLOSE_POPUP});
}

function recommendEmbedMain() {
  const postButtonEl = document.getElementById('recommend_post_button');
  const closeButtonEl = document.getElementById('recommend_close_button');
  const blurbEl = document.getElementById('recommend_blurb');
  postButtonEl.addEventListener('click', onRecPostButtonClick);
  closeButtonEl.addEventListener('click', onRecCloseButtonClick);
  autoExpandTextArea(blurbEl);
}

window.addEventListener('load', () => recommendEmbedMain());
