
export class Favorite {
    id: number;
    categoryName: string;
    videoCount: number;

    constructor() {
    }
}

export class Image {
    isStoryCascade: boolean;
    orderCode: number;
    width: number;
    height: number;
    isCover: boolean;
    id: number;
    url: string;
    bigUrl: string;

    constructor() { }
}

export class Video {
    images: Image[];
    favorite: Favorite[];
    fileName: string;
    ftpPath: string;
    appendDate: Date;
    id: number;
    coverUrl: string;
    viewCount: number;
    playCount: number;

    constructor() {

    }
}

export class PageResult<T> {
    totalCount: number;
    items: T[];

    constructor() { }
}

export class ApiResult<T>{
    result: T;
    targetUrl: string;
    succcess: boolean;
    error: string;
    unAuthorizedRequest: boolean;
    __abp: boolean;

    constructor(result: T) {
        this.result = result;
    }
}

export class UserInfo {
    accessToken: string;
    encryptedAccessToken: string;
    expireInSeconds: number;
    userId: number;
    userName: string;
    expireDate: Date;

    constructor() {

    }
}

export class LoginInfo {
    userNameOrEmailAddress: string;
    password: string;
    rememberClient: boolean = true;

    constructor() {

    }
}

export class VideoPageRequest {
    constructor() {

    }
    videoName: string;
    favId: number;
    skipCount: number = 0;
    maxResultCount: number = 10;
    isHotPlay: boolean;
    isLatePlay: boolean;
    isHistoryView: boolean;
    isRandomList: boolean;
}

export class FavoriteVideoChangeRequest {
    constructor() {

    }
    videoId: number;
    favIds: number[];
}

export class VideoCoverSetting {
    constructor(videoId: number, imageId: number) {
        this.videoId = videoId;
        this.imageId = imageId;
    }

    videoId: number;
    imageId: number;
}

export class LuckVideoRequest {

    constructor() {

    }

    favId: number;
    inAllVideo: boolean;
    inAllFav: boolean;
    inSingleFav: boolean;
}

export class VideoViewRequest {
    constructor() {

    }

    videoId: number;
    isPlay: boolean;
}

export class PowerOffState {
    constructor() {

    }
    msg: string;
    powerOffDate: Date;
}

export class AppConfig {
    constructor() {

    }
    apiRoot: string;
}