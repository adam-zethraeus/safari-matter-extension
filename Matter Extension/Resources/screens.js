/* global chrome */
let TAB_ID_TO_CURRENT_SCREEN_ID = new Map();
let CURRENT_LOGIN_POPUP_SCREEN_ID = null;

const SCREENS = {
  QR_LOGIN: {
    id: 'qr_login_screen',
    init: QRLoginMain,
    popupId: LOGIN_POPUP_ID},
  QR_LOGIN_SUCCESS: {
    id: 'qr_login_success_screen',
    init: QRLoginSuccessMain,
    popupId: EMBED_POPUP_ID},
  SAVE: {
    id: 'save_screen',
    init: saveMain,
    popupId: EMBED_POPUP_ID},
  RECOMMEND: {
    id: 'recommend_screen',
    init: recommendMain,
    popupId: EMBED_POPUP_ID},
  RECOMMEND_SUCCESS: {
    id: 'recommend_success_screen',
    init: recommendSuccessMain,
    popupId: EMBED_POPUP_ID},
};
const SCREENS_LIST = [
  SCREENS.QR_LOGIN, SCREENS.QR_LOGIN_SUCCESS,
  SCREENS.SAVE,
  SCREENS.RECOMMEND, SCREENS.RECOMMEND_SUCCESS];

async function getCurrentEmbedScreenId() {
  return await new Promise(function(resolve) {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
      if (!tabs || !tabs[0] || !tabs[0].id
          || !TAB_ID_TO_CURRENT_SCREEN_ID.has(tabs[0].id)) {
        resolve(null);
      } else {
        resolve(TAB_ID_TO_CURRENT_SCREEN_ID.get(tabs[0].id));
      }
    });
  });
}

function setCurrentEmbedScreenIdForTab(tabId, screenId) {
  TAB_ID_TO_CURRENT_SCREEN_ID.set(tabId, screenId);
}

async function setCurrentEmbedScreenId(screen) {
  return await new Promise(function(resolve) {
    const screenId = screen ? screen.id : null;
    chrome.tabs.query(
      {active: true, currentWindow: true}, function (tabs) {
        if (!tabs || !tabs[0] || !tabs[0].id) {
          return;
        }
        setCurrentEmbedScreenIdForTab(tabs[0].id, screenId);
        resolve();
      });
  });
}

function getCurrentLoginPopupScreenId() {
  return CURRENT_LOGIN_POPUP_SCREEN_ID;
}

function setCurrentLoginPopupScreenId(screen) {
  return CURRENT_LOGIN_POPUP_SCREEN_ID = screen ? screen.id : null;
}

async function updateEmbedIframeDisplay(screenId) {
  return await new Promise(function(resolve) {
    const iframeId = getMatterIframeId();
    if (screenId === null) {
      chrome.tabs.executeScript({
        code: `if (document.getElementById(\'${iframeId}\')) {` +
          `document.getElementById(\'${iframeId}\')` +
          '.className = \'matter_hidden matter_save_screen_frame\';' +
          '}'
      }, function () {
        resolve();
      });
    } else {
      const screenClass = '\'matter_' + screenId + '_frame\'';
      chrome.tabs.executeScript({
        code: `if (document.getElementById(\'${iframeId}\')) {` +
          `document.getElementById(\'${iframeId}\')` +
          '.style.display = \'block\';' +
          `document.getElementById(\'${iframeId}\')` +
          '.className = ' + screenClass + ';' +
          '}'
      }, function () {
        resolve();
      });
    }
  });
}

async function goToPopupScreen(screen, ...initArgs) {
  const screenId = screen.id;
  const message = {
      messageType: MESSAGE_TYPE_GO_TO_SCREEN,
      popupId: screen.popupId,
      screenId: screenId
    };
  if (screen.popupId === LOGIN_POPUP_ID) {
    await new Promise(function (resolve) {
      handlePopupMessage(message, null, function (response) {
        if (initArgs) {
          screen.init(...initArgs);
        } else {
          screen.init();
        }
        resolve();
      });
    });
  } else {
    // Hide the iframe while we transition screens.
    await updateEmbedIframeDisplay(null);
    // Switch the current screen.
    await new Promise(function (resolve) {
      chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
          if (initArgs) {
            screen.init(...initArgs);
          } else {
            screen.init();
          }
          resolve();
        });
      });
    });
    // Now display the iframe again.
    if (screenId !== null) {
      await updateEmbedIframeDisplay(screenId);
    }
  }
}

async function goToScreen(screen, ...initArgs) {
  if (screen.popupId === EMBED_POPUP_ID) {
    await setCurrentEmbedScreenId(screen);
  } else if (screen.popupId === LOGIN_POPUP_ID) {
    setCurrentLoginPopupScreenId(screen);
  }
  await goToPopupScreen(screen, ...initArgs);
}
