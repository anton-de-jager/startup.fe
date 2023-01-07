import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { Observable } from "rxjs";
import { EventEmitterService } from "./event-emitter.service";

@Injectable()
export class ApiService {
    baseUrl: string;
    env = environment;

    constructor(
        private http: HttpClient,
        private eventEmitterService: EventEmitterService,
        @Inject('BASE_URL') _baseUrl: string
    ) {
        this.baseUrl = environment.api;
    }

    getItems(model) {
        return this.http.get<any>(this.baseUrl + '/api/' + model);
    }

    getItem(model) {
        return this.http.get<any>(this.baseUrl + '/api/' + model);
    }

    getItemParm(model, parm) {
        return this.http.get<any>(this.baseUrl + '/api/' + model + '/' + parm);
    }

    saveItemParm(model: string, parm: string): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/api/` + model + '/' + parm, parm);
    }

    getDevicePromotions(deviceId, lat, lon) {
        return this.http.get<any>(this.baseUrl + '/api/promotions/device/' + deviceId + '/' + lat + '/' + lon);
    }

    getDevicePromotionsAll(deviceId, lat, lon) {
        return this.http.get<any>(this.baseUrl + '/api/promotions/device/all/' + deviceId + '/' + lat + '/' + lon);
    }

    logDevicePromotion(promotionId, deviceId, action) {
        return this.http.post<any>(this.baseUrl + '/api/promotions/log', { promotionId: promotionId, deviceId: deviceId, action: action });
    }

    updateDevicePromotion(promotionId, deviceId, action) {
        return this.http.post<any>(this.baseUrl + '/api/promotions/log-update', { promotionId: promotionId, deviceId: deviceId, action: action });
    }

    deleteReviewByUrlImage(urlImage) {
        return this.http.delete<any>(this.baseUrl + '/api/reviews/url/' + urlImage);
    }

    // saveLocation(deviceId, lat, lon): Observable<any> {
    //     return this.http.post<any>(`${this.baseUrl}/api/devices/location/` + deviceId + '/' + lat + '/' + lon, deviceId);
    // }

    // getItemsByUserId(model, userId) {
    //     return this.http.get<any>(this.baseUrl + '/api/' + model + '/user/' + userId);
    // }

    // getUsersList(distance, userTypeIds, vibe, quality, price, childFriendly, lat, lon, startIndex, orderBy) {
    //     return this.http.get<any>(this.baseUrl + '/api/users/list/' + distance + '/' + userTypeIds + '/' + vibe + '/' + quality + '/' + price + '/' + childFriendly + '/' + lat + '/' + lon + '/' + startIndex + '/' + orderBy);
    // }

    saveItem(model: string, item: any): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/api/` + model, item);
    }

    upload(model, formData, filename) {
        return this.http.post(this.baseUrl + '/api/' + model + '/uploadImage/' + filename, formData, { reportProgress: true, observe: 'events' });
    }

    uploadPromotion(id, formData, filename) {
        return this.http.post(this.baseUrl + '/api/promotions/uploadImage/' + id + '/' + filename, formData, { reportProgress: true, observe: 'events' });
    }

    countUserReviews(userId, deviceId): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/api/reviews/count`, { userId: userId, deviceId: deviceId });
    }

    // getReviewByUrlImage(urlImage) {
    //     return this.http.get<any>(this.baseUrl + '/api/reviews/details/' + urlImage);
    // }

    // getUsersFilter(distance, lat, lon) {
    //     return this.http.get<any>(this.baseUrl + '/api/users/filter/' + distance + '/' + lat + '/' + lon);
    // }

    updateUser(item: any): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/api/users/update`, item);
    }

    changePassword(item: any): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/api/users/change-password`, item);
    }

    getDashboard(userId) {
        return this.http.get<any>(this.baseUrl + '/api/users/dashboard/' + userId);
    }

    activate(request) {
        return this.http.post(this.baseUrl + '/api/users/activate', request);
    }

    confirm(id) {
        return this.http.post(this.baseUrl + '/api/users/confirm', { id: id });
    }

    getItemsByUserId(model, userId) {
        return this.http.get<any>(this.baseUrl + '/api/' + model + '/user/' + userId);
    }

    cancelSubscription(userId) {
        return this.http.get<any>(this.baseUrl + '/api/users/cancel/' + userId);
    }

    // getReviewByUrlImage(urlImage) {
    //     return this.http.get<any>(environment.nodeApi + '/reviews/details/' + urlImage);
    // }

    saveLocation(deviceId, lat, lon): Observable<any> {
        //return this.http.post<any>(environment.nodeApi + '/devices/location', { deviceId: deviceId, lat: lat, lon: lon });
        return this.http.post<any>(this.baseUrl + '/api/devices/location', { id: deviceId, lat: lat, lon: lon });
    }

    getDevice(id) {
        //return this.http.get<any>(environment.nodeApi + '/devices/' + id);
        return this.http.get<any>(this.baseUrl + '/api/devices/' + id);
    }

    getUsersList(distance, userTypeIds, vibe, quality, price, childFriendly, lat, lon, startIndex, orderBy) {
        //return this.http.post<any>(environment.nodeApi + '/users/list', { distance: distance, userTypeIds: userTypeIds, vibe: vibe, quality: quality, price: price, childFriendly: childFriendly, lat: lat, lon: lon, startIndex: startIndex, orderBy: orderBy });
        return this.http.post<any>(this.baseUrl + '/api/users/list', { distance: distance, userTypeIds: userTypeIds, vibe: vibe, quality: quality, price: price, childFriendly: childFriendly, lat: lat, lon: lon, startIndex: startIndex, orderBy: orderBy });
    }

    getUsersFilter(distance, lat, lon) {
        //return this.http.post<any>(environment.nodeApi + '/users/filter', { distance: distance, lat: lat, lon: lon });
        return this.http.post<any>(this.baseUrl + '/api/users/filter', { distance: distance, lat: lat, lon: lon });
    }

    submitSubscription(id) {
        return this.http.post<any>(this.baseUrl + '/api/users/subscription-email', { id: id });
    }

    email(id, email) {
        return this.http.post(this.baseUrl + '/api/users/email', { id: id, email: email });
    }

    // testUpload(formData, filename) {
    //     return this.http.post(environment.nodeApi + '/upload', formData, { reportProgress: true, observe: 'events' });
    // }
}