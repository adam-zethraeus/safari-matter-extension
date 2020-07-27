/* global chrome */
async function loginPopupMain() {
  const authToken = await isLoggedIn();
  if (!authToken) {
    await goToScreen(SCREENS.QR_LOGIN);
  } else {
    // Login popup is unneeded - disable it, open the save embed popup, and close this.
    chrome.browserAction.setPopup({popup: ''});
    chrome.tabs.executeScript({
      file: 'embedPopupInjector.js'
    }, function () {
      (async () => await goToScreen(SCREENS.SAVE))();
      window.close();
    });
  }
}

function handlePopupMessage(message, sender, sendResponse) {
  console.log('login popup msg');
  console.log(message);
  if (message.popupId !== LOGIN_POPUP_ID) {
    if (sendResponse) {
      sendResponse({});
    }
    return;
  }
  if (message.messageType === MESSAGE_TYPE_GO_TO_SCREEN) {
    if (message.screenId === null) {
      window.close();
    } else {
      transitionToScreen(message.screenId);
    }
  } else if (message.messageType === MESSAGE_TYPE_UPDATE_ELEMENT_ATTR) {
    updateElementAttr(message.elementId, message.elementAttr, message.elementValue);
  } else if (message.messageType === MESSAGE_TYPE_ADD_CLASS_TO_ELEMENT) {
    addClassToElement(message.elementId, message.elementClass);
  } else if (message.messageType === MESSAGE_TYPE_REMOVE_CLASS_FROM_ELEMENT) {
    removeClassFromElement(message.elementId, message.elementClass);
  } else if (message.messageType === MESSAGE_TYPE_FOCUS_ELEMENT) {
    focusElement(message.elementId);
  }
  if (sendResponse) {
    sendResponse({});
  }
}

window.addEventListener('load', () => loginPopupMain());

chrome.runtime.onMessage.addListener(handlePopupMessage);
