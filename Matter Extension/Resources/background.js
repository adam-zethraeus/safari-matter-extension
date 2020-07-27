/* global chrome */

const iframeExtraHeight = 10;
/* Stores connections with embedded popups.
  These exist primarily so that the embeds can
  detect when the connection to the extension is broken
  (e.g., due to an version update), so that they can
  clean themselves up.
*/
let PORTS = new Map();

function addConnection(port) {
  const tabId = port.sender.tab.id;
  if (!PORTS.has(port.name)) {
    PORTS.set(port.name, new Map());
  }
  const namePorts = PORTS.get(port.name);
  if (namePorts.has(tabId)) {
    namePorts.get(tabId).disconnect();
  } else {
    namePorts.set(tabId, port);
  }
}

chrome.runtime.onConnect.addListener(addConnection);

chrome.runtime.onMessage.addListener(
  function(message, sender, sendResponse) {
    console.log('bg msg');
    console.log(message);
    if (message.messageType === MESSAGE_TYPE_POPUP_LOADED) {
      popupToggle();
    } else if (message.messageType === MESSAGE_TYPE_SAVE_POST_CLICK) {
      goToScreen(SCREENS.RECOMMEND);
    } else if (message.messageType === MESSAGE_TYPE_RECOMMEND_SUBMIT_CLICK) {
      chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        recommendPage(tabs[0], message.blurb);
      });
    } else if (message.messageType === MESSAGE_TYPE_CLOSE_POPUP) {
      closePopup(EMBED_POPUP_ID);
    } else if (message.messageType === MESSAGE_TYPE_DYNAMIC_RESIZE
        && message.elementId === 'recommend_blurb') {
      chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        const iframeId = getMatterIframeId();
        if (TAB_ID_TO_CURRENT_SCREEN_ID.get(tabs[0].id) === SCREENS.RECOMMEND.id) {
          chrome.tabs.executeScript({
            code: `document.getElementById(\'${iframeId}\').width = ` +
              message.bodyScrollWidth + ';' +
              `document.getElementById(\'${iframeId}\').height = ` +
              (message.bodyScrollHeight + iframeExtraHeight) + ';'
          });
        }
      });
    } else if (message.messageType === MESSAGE_TYPE_HIT_LOGIN_WALL) {
      chrome.browserAction.setPopup({popup: 'login_popup.html'});
    }
    sendResponse({});
  }
);

chrome.runtime.onInstalled.addListener(function callback(details) {
  if (details.reason === 'install') {
    // Ensure a clean install starts with a clean slate.
    getStorage().clear();
  } else {
    // Older clients didn't track whether the tutorial was seen, so set
    // it on reinstall to make sure they don't see it again on update.
    getStorage().set({hasSeenTutorial: true});
  }
  TAB_ID_TO_CURRENT_SCREEN_ID.clear();
  chrome.browserAction.setPopup({popup: 'login_popup.html'});
});

chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.browserAction.getPopup({}, function (popup) {
    // Trigger the embedded popup if a native popup isn't enabled.
    if (!popup) {
      chrome.tabs.executeScript({
        file: 'embedPopupInjector.js'
      });
    }
  });
});