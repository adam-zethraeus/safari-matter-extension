/* global chrome */
async function savePage(tab, selectionText, willPost) {
  addEmbedElementClass('save_post_button', 'hidden');
  updateEmbedElementText('save_headline', 'Saving article...');
  updateEmbedElementText('save_message', '');
  const authToken = await isLoggedIn();
  try {
    const saveResp = await apiRequest(
      'POST', ENDPOINTS.SAVE,
      {url: tab.url}, authToken);
    updateEmbedElementText('save_headline', 'Saved to Matter!');
    removeEmbedElementClass('save_post_button', 'hidden');
    if (willPost) {
      await goToScreen(SCREENS.RECOMMEND, selectionText);
    } else {
      await sleep(SAVE_POPUP_DURATION_SECS * 1000);
      const screenId = await getCurrentEmbedScreenId();
      if (tab.id) {
        chrome.browserAction.setIcon({
            'path': 'images/BookmarkSquare.png', 'tabId': tab.id
          },
          function () {
            if (screenId === SCREENS.SAVE.id) {
              closePopup(EMBED_POPUP_ID);
            }
          });
      } else {
        if (screenId === SCREENS.SAVE.id) {
          await closePopup(EMBED_POPUP_ID);
        }
      }
    }
  } catch (errResp) {
    if ([401, 403].indexOf(errResp.status) !== -1) {
      logout();
      updateEmbedElementText('save_message',
        'Click the Matter icon in your browser bar to login.')
    } else {
      updateEmbedElementText('save_headline', 'Failed to save page');
      let msg = '';
      const errorMessagesStr = extractErrorMessagesStr(errResp);
      if (errorMessagesStr) {
        msg += '\n' + errorMessagesStr;
      }
      updateEmbedElementText('save_message', msg);
    }
  }
}

function saveMain(tab, selectionText, willPost) {
  if (tab) {
    savePage(tab, selectionText, willPost);
  } else {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
      savePage(tabs[0], selectionText, willPost);
    });
  }
}

