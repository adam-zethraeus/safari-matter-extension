/* global chrome */
async function startQRLogin() {
  let sessionToken = null;
  try {
     const triggerResp = await apiRequest(
       'POST', ENDPOINTS.QR_LOGIN_TRIGGER, null, null);
     sessionToken = triggerResp.data.session_token;
  } catch (err) {
  }
  if (!sessionToken) {
    throw Error('Server error');
  }
  getStorage().set({'qrSessionToken': sessionToken});
  return sessionToken;
}

async function checkForQRLogin(sessionToken) {
  let authToken = null;
  let currentProfile = null;
  try {
    const exchangeResp = await apiRequest(
      'POST', ENDPOINTS.QR_LOGIN_EXCHANGE,
      {session_token: sessionToken}, null);
    if (exchangeResp.data) {
      authToken = exchangeResp.data.api_key;
      currentProfile = exchangeResp.data.current_profile;
    }
  } catch (err) {}
  if (!authToken) {
    throw Error();
  }
  login(authToken, currentProfile);
  return {authToken: authToken, currentProfile: currentProfile};
}

function showQRCode(code) {
  return new QRious({
    element: document.getElementById('qr_code'),
    value: code,
    size: 100,
    padding: null,
  });
}

async function hasSeenTutorial() {
  return await new Promise(function (resolve) {
    getStorage().get('hasSeenTutorial', function (result) {
      resolve(result.hasSeenTutorial !== undefined
        && result.hasSeenTutorial === true);
    });
  });
}

function QRLoginMain() {
  (async () => await QRLoginMainAsync())();
}

async function QRLoginMainAsync() {
  let sessionToken = null;
  const messageEl = document.getElementById('qr_login_message');
  try {
    sessionToken = await startQRLogin();
  } catch {
    messageEl.textContent = 'Server error';
    return;
  }
  try {
    showQRCode(sessionToken);
  } catch (err) {
    messageEl.textContent = 'Server error';
    return;
  }
  let loginSession = null;
  let succeeded = false;
  const screenId = getCurrentLoginPopupScreenId();
  while (!succeeded && screenId === SCREENS.QR_LOGIN.id) {
    try {
      loginSession = await checkForQRLogin(sessionToken);
      succeeded = true;
    } catch (err) {
      await sleep(QR_POLLING_INTERVAL_SECS * 1000);
    }
  }
  if (succeeded) {
    // This will create and/or trigger the embedded popup,
    // showing a tutorial or launching the save action.
    await new Promise(function(resolve) {
      chrome.tabs.executeScript({
        file: 'embedPopupInjector.js'
      }, resolve);
    });
    await closePopup(LOGIN_POPUP_ID);
    chrome.browserAction.setPopup({popup: ''});
  }
}

function QRLoginSuccessMain() {
  (async () => await QRLoginSuccessMainAsync())();
}

async function QRLoginSuccessMainAsync() {
  const currentProfile = await getCurrentProfile();
  if (currentProfile && currentProfile.first_name) {
    updateEmbedElementText(
      'login_success_headline',
      'Hi, ' + currentProfile.first_name + '!');
  }
}
