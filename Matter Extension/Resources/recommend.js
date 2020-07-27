/* global chrome */
async function recommendPage(tab, blurb) {
  const authToken = await isLoggedIn();
  try {
    updateEmbedElementAttr('recommend_post_button', 'disabled', true)
    const resp = await apiRequest(
      'POST', ENDPOINTS.RECOMMEND,
      {url: tab.url, blurb: blurb}, authToken);
    await goToScreen(SCREENS.RECOMMEND_SUCCESS);
  } catch (errResp) {
    updateEmbedElementAttr('recommend_post_button', 'disabled', false)
    if ([401, 403].indexOf(errResp.status) !== -1) {
      logout();
      updateEmbedElementText('recommend_message',
        'Click the Matter icon in your browser bar to login.')
    } else {
      let msg = '';
      const errorMessagesStr = extractErrorMessagesStr(errResp);
      if (errorMessagesStr) {
        msg += '\n' + errorMessagesStr;
      }
      updateEmbedElementText('recommend_message', msg)
    }
  }
}

function recommendMain(selectionText) {
  if (selectionText) {
    updateEmbedElementAttr(
      'recommend_blurb', 'value', `"${selectionText}"`);
  }
  updateEmbedElementText('recommend_message', '');
  updateEmbedElementAttr('recommend_post_button', 'disabled', false)
  focusEmbedElement('recommend_blurb');
}

function recommendSuccessMain() {
  async function dismissPopup() {
    await sleep(REC_SUCCESS_POPUP_DURATION_SECS * 1000);
    const screenId = await getCurrentEmbedScreenId();
    if (screenId !== null) {
      await closePopup(EMBED_POPUP_ID);
    }
  }
  dismissPopup();
}
