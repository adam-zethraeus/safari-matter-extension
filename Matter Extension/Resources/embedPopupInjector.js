/* global chrome */

/* Duplicated from utils.js. */
function getMatterIframeId() {
  return `matter_iframe`;
}

function insertIframe(matterIframeId) {
  const iframe = document.createElement('iframe');
  iframe.setAttribute('id', matterIframeId);
  iframe.setAttribute('class',
    'matter_hidden matter_save_screen_frame');
  iframe.setAttribute(
    'style',
    'position:fixed; top:10px; right:10px; z-index: 10000000; ' +
    'background-color: white; ' +
    'border-radius: 10px; border: none; ' +
    'box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);' +
    'display: none;'
  );
  iframe.setAttribute('onload', 'this.contentWindow.focus()');
  iframe.src = chrome.extension.getURL('popup.html');
  document.body.appendChild(iframe);
  return iframe;
}

function insertCss() {
  const iframeCss = document.createElement('link');
  iframeCss.rel = 'stylesheet';
  iframeCss.type = 'text/css';
  iframeCss.href = chrome.extension.getURL('popupFrame.css');
  document.head.appendChild(iframeCss);
}

function injectPopup() {
  const MESSAGE_TYPE_POPUP_LOADED = 1;
  const matterIframeId = getMatterIframeId();
  const iframe = document.getElementById(matterIframeId);
  if (!iframe) {
    insertCss();
    insertIframe(matterIframeId);
    chrome.runtime.connect(
      {name: 'embed_injector'}).onDisconnect.addListener(function () {
      const iframe = document.getElementById(getMatterIframeId());
      if (iframe) {
        iframe.remove();
      }
    });
  } else {
    chrome.runtime.sendMessage({messageType: MESSAGE_TYPE_POPUP_LOADED});
  }
}

injectPopup();
