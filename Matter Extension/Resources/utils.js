
function getApiUrl(basePath) {
  let url = `${MATTER_PROTOCOL}://${MATTER_DOMAIN}/api/${MATTER_API_VERSION}`;
  if (!basePath || !basePath.startsWith('/')) {
    url += '/';
  }
  url += basePath;
  if (!url.endsWith('/')) {
    url += '/';
  }
  return url;
}


function apiRequest(method, basePath, data, authToken) {
  return new Promise(function(resolve, reject) {
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = false;
    const url = getApiUrl(basePath);
    console.log('requesting ' + url);
    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader(
      'X-Matter-Extension-Version',
      chrome.runtime.getManifest().version);
    if (authToken) {
      xhr.setRequestHeader(
        'Authorization', 'Token ' + authToken);
    }
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        let data = {};
        if (xhr.responseText) {
          try {
            data = JSON.parse(xhr.responseText);
          } catch {}
        }
        const response = {status: xhr.status, data: data};
        console.log(response);
        if (xhr.status >= 200 && xhr.status <= 299) {
          resolve(response);
        } else {
          reject(response);
        }
      }
    };
    xhr.onTimeout = function () {
      reject(null);
    };
    if (data) {
      xhr.send(JSON.stringify(data));
    } else {
      xhr.send();
    }
  });
}

function transitionToScreen(screenId) {
  document.querySelectorAll('.screen').forEach(function (e) {
    e.classList.add('hidden');
  });
  if (screenId !== null) {
    document.getElementById(screenId).classList.remove('hidden');
  }
}

function getMatterIframeId() {
  return `matter_iframe`;
}

function extractErrorMessagesStr(errResp) {
  let msg = '';
  let errorMessages = [];
  if (errResp.data && errResp.data.errors) {
    errResp.data.errors.forEach((e) => {
      if (e.message) {
        errorMessages.push(e.message);
      } else {
        errorMessages.push(JSON.stringify(e));
      }
    });
  }
  if (errResp.data && typeof errResp.data === 'string') {
    errorMessages.push(errResp.data);
  }
  if (errorMessages.length > 0) {
    msg += '\n' + errorMessages.join('\n');
  }
  return msg;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getStorage() {
  if (USE_LOCAL_STORAGE) {
    return chrome.storage.local;
  } else {
    return chrome.storage.sync;
  }
}
