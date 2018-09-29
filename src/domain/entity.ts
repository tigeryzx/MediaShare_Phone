
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

    constructor() { }
}

export class Video {
    images: Image[];
    favorite: Favorite[];
    fileName: string;
    ftpPath: string;
    appendDate: Date;
    id: number;

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
}

export class FavoriteVideoChangeRequest {
    constructor() {

    }
    videoId: number;
    favIds: number[];
}