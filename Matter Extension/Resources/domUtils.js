/* global chrome */

function autoExpandTextArea(element) {
  autosize(element);
  element.addEventListener('autosize:resized', function(){
    console.log('textarea height updated');
    console.log(document.body.scrollHeight);
    chrome.runtime.sendMessage({
      messageType: MESSAGE_TYPE_DYNAMIC_RESIZE,
      elementId: element.id,
      bodyScrollWidth: document.body.scrollWidth,
      bodyScrollHeight: document.body.scrollHeight,
    })
  });
}

function updateElementAttr(elemId, attr, value) {
  const element = document.getElementById(elemId);
  element[attr] = value;
  if (attr === 'value') {
    element.dispatchEvent(new Event('input'));
  }
}

function addClassToElement(elemId, newClass) {
  document.getElementById(elemId).classList.add(newClass);
}

function removeClassFromElement(elemId, targetClass) {
  document.getElementById(elemId).classList.remove(targetClass);
}

function focusElement(elemId) {
  document.getElementById(elemId).focus();
}

function sendEmbedMessage(message) {
  chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    if (tabs) {
      message.popupId = EMBED_POPUP_ID;
      chrome.tabs.sendMessage(tabs[0].id, message);
    }
  });
}

function updateEmbedElementAttr(elementId, elementAttr, elementValue) {
  sendEmbedMessage({
    messageType: MESSAGE_TYPE_UPDATE_ELEMENT_ATTR,
    elementId: elementId,
    elementAttr: elementAttr,
    elementValue: elementValue});
}

function updateEmbedElementText(elementId, elementText) {
  updateEmbedElementAttr(elementId, 'textContent', elementText);
}

function addEmbedElementClass(elementId, elementClass) {
  sendEmbedMessage({
    messageType: MESSAGE_TYPE_ADD_CLASS_TO_ELEMENT,
    elementId: elementId,
    elementClass: elementClass});
}

function removeEmbedElementClass(elementId, elementClass) {
  sendEmbedMessage({
    messageType: MESSAGE_TYPE_REMOVE_CLASS_FROM_ELEMENT,
    elementId: elementId,
    elementClass: elementClass});
}

function focusEmbedElement(elementId) {
  sendEmbedMessage({
    messageType: MESSAGE_TYPE_FOCUS_ELEMENT,
    elementId: elementId});
}
