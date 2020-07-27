/* global chrome */

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  chrome.tabs.executeScript({
    file: 'embedPopupInjector.js'
  });
  if (info.menuItemId === saveContextActionId && info.pageUrl) {
    openPopup({url: info.pageUrl, id: tab.id});
  } else if (info.menuItemId === saveLinkContextActionId && info.linkUrl) {
    openPopup({url: info.linkUrl, id: null});
  } else if (info.menuItemId === postContextActionId) {
    const selectionText = (info.selectionText || '').trim();
    openPopup({url: info.pageUrl, id: tab.id}, selectionText,
      SCREENS.RECOMMEND);
  }
});

chrome.contextMenus.removeAll();

chrome.contextMenus.create({
  'id': saveContextActionId,
  'title': 'Save to Matter',
  'contexts': ['page'],
});

chrome.contextMenus.create({
  'id': saveLinkContextActionId,
  'title': 'Save link to Matter',
  'contexts': ['link'],
});

chrome.contextMenus.create({
  'id': postContextActionId,
  'title': 'Post to Matter',
  'contexts': ['selection'],
});
