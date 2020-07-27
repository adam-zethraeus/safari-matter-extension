/* global chrome */

async function isLoggedIn() {
  return await new Promise(function (resolve, reject) {
      getStorage().get(['authToken'], function (result) {
        resolve(result.authToken);
      });
    });
}

function logout() {
  getStorage().set({
    'authToken': null,
    'qrSessionToken': null,
    'currentProfile': null,
  });
  chrome.browserAction.setPopup({popup: 'login_popup.html'});
}

function login(authToken, currentProfile) {
  getStorage().set({'authToken': authToken, 'currentProfile': currentProfile});
}

function getCurrentProfile() {
  return new Promise(function (resolve, reject) {
    getStorage().get(['currentProfile'], function (result) {
      resolve(result.currentProfile);
    });
  });
}
