
const MATTER_PROTOCOL = 'https';
const MATTER_DOMAIN = 'getmatter.app';

const MATTER_API_VERSION = 'v3';
const QR_POLLING_INTERVAL_SECS = 1;
const USE_LOCAL_STORAGE = true;
const SAVE_POPUP_DURATION_SECS = 5;
const REC_SUCCESS_POPUP_DURATION_SECS = 2;
const saveContextActionId = 'save';
const saveLinkContextActionId = 'save_link';
const postContextActionId = 'post';
const EMBED_POPUP_ID = 'embed';
const LOGIN_POPUP_ID = 'login';

const MESSAGE_TYPE_POPUP_LOADED = 1;
const MESSAGE_TYPE_GO_TO_SCREEN = 2;
const MESSAGE_TYPE_FOCUS_ELEMENT = 3;
const MESSAGE_TYPE_UPDATE_ELEMENT_ATTR = 4;
const MESSAGE_TYPE_ADD_CLASS_TO_ELEMENT = 5;
const MESSAGE_TYPE_REMOVE_CLASS_FROM_ELEMENT = 6;
const MESSAGE_TYPE_SAVE_POST_CLICK = 7;
const MESSAGE_TYPE_RECOMMEND_SUBMIT_CLICK = 8;
const MESSAGE_TYPE_CLOSE_POPUP = 9;
const MESSAGE_TYPE_CLOSE_POPUP_EMBED = 10;
const MESSAGE_TYPE_DYNAMIC_RESIZE = 11;
const MESSAGE_TYPE_HIT_LOGIN_WALL = 12;

const ENDPOINTS = {
  QR_LOGIN_TRIGGER: '/qr_login/trigger/',
  QR_LOGIN_EXCHANGE: '/qr_login/exchange/',
  SAVE: '/save/',
  RECOMMEND: '/posts/from_url/'
};
