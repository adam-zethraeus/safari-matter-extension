/* global chrome */

function wrapLinksThroughTabAPI() {
  const links = document.getElementsByTagName('a');
  for (let i = 0; i < links.length; i++) {
    (function () {
      const ln = links[i];
      const location = ln.href;
      chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        ln.onclick = function () {
          chrome.tabs.update(
            tabs[0].id, {active: true, url: location});
        };
      });
    })();
  }
}

async function popupInit() {
  wrapLinksThroughTabAPI();
  chrome.runtime.sendMessage({messageType: MESSAGE_TYPE_POPUP_LOADED});
}

async function popupTeardown() {
  return await new Promise(function(resolve) {
    try {
      chrome.runtime.sendMessage({messageType: MESSAGE_TYPE_CLOSE_POPUP}, function (response) {
        resolve();
      });
    } catch (error) {
      console.error(error);
    }
  });
}

window.addEventListener('load', () => popupInit());
window.addEventListener('beforeunload', () => popupTeardown(), false);

chrome.runtime.onMessage.addListener(
  function(message, sender, sendResponse) {
    console.log('embed msg');
    console.log(message);
    if (message.popupId !== EMBED_POPUP_ID) {
      sendResponse({});
    }
    if (message.messageType === MESSAGE_TYPE_GO_TO_SCREEN) {
      transitionToScreen(message.screenId);
    } else if (message.messageType === MESSAGE_TYPE_CLOSE_POPUP_EMBED) {
      transitionToScreen(null);
    } else if (message.messageType === MESSAGE_TYPE_UPDATE_ELEMENT_ATTR) {
      updateElementAttr(message.elementId, message.elementAttr, message.elementValue);
    } else if (message.messageType === MESSAGE_TYPE_ADD_CLASS_TO_ELEMENT) {
      addClassToElement(message.elementId, message.elementClass);
    } else if (message.messageType === MESSAGE_TYPE_REMOVE_CLASS_FROM_ELEMENT) {
      removeClassFromElement(message.elementId, message.elementClass);
    } else if (message.messageType === MESSAGE_TYPE_FOCUS_ELEMENT) {
      focusElement(message.elementId);
    }
    sendResponse({});
  }
);

chrome.runtime.connect({
    name: EMBED_POPUP_ID}).onDisconnect.addListener(function() {
  document.body.innerHTML = '';
});
