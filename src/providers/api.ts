export const BASE_API_ROOT = 'http://s.tiger.cn:21021/api';

export const USER_LOGIN = BASE_API_ROOT + '/TokenAuth/Authenticate';

export const VIDEO_GET_ALL = BASE_API_ROOT + '/services/app/Video/GetAll';
export const VIDEO_DELETE = BASE_API_ROOT + '/services/app/Video/Delete';

export const FAV_GET_ALL = BASE_API_ROOT + '/services/app/Fav/GetCurrentUserAllFav';
export const FAV_CREATE = BASE_API_ROOT + '/services/app/Fav/Create';
export const FAV_UPDATE = BASE_API_ROOT + '/services/app/Fav/Update';
export const FAV_DELETE = BASE_API_ROOT + '/services/app/Fav/Delete';
export const FAV_LIKE_VIDEO = BASE_API_ROOT + '/services/app/Fav/FavoriteVideo';
export const FAV_UNLIKE_VIDEO = BASE_API_ROOT + '/services/app/Fav/UnFavoriteVideo';