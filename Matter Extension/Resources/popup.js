/* global chrome */

async function openPopup(tab, selectionText, willPost, screen) {
  const authToken = await isLoggedIn();
  if (!authToken) {
    await goToScreen(SCREENS.QR_LOGIN);
  } else {
    if (screen) {
      await goToScreen(screen, selectionText);
    } else {
      if (await hasSeenTutorial()) {
        await goToScreen(SCREENS.SAVE, tab, selectionText, willPost);
      } else {
        getStorage().set({hasSeenTutorial: true});
        await goToScreen(SCREENS.QR_LOGIN_SUCCESS);
      }
    }
  }
}

async function closePopup(popupId) {
  if (popupId === EMBED_POPUP_ID) {
    await setCurrentEmbedScreenId(null);
    await updateEmbedIframeDisplay(null);
    await new Promise(function (resolve) {
      chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          {messageType: MESSAGE_TYPE_CLOSE_POPUP_EMBED},
          function (response) {
            resolve();
          });
      });
    });
  } else if (popupId === LOGIN_POPUP_ID) {
    setCurrentLoginPopupScreenId(null);
    window.close();
  }
}

async function popupToggle(tab, selectionText, willPost) {
  const screenId = await getCurrentEmbedScreenId();
  if (screenId !== null) {
    await closePopup(EMBED_POPUP_ID);
  } else {
    await openPopup(tab, selectionText, willPost);
  }
}
