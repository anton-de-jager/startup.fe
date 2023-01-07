import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SharedService {
    private subject = new Subject<any>();

    sendMessage(message: string) {
        this.subject.next(message);
    }

    clearMessages() {
        //this.subject.next();
    }

    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }

    async getObject(obj:string) {
        let strObject = await Preferences.get({ key: obj });
        if (strObject) {
          return JSON.parse(strObject.value)
        }
        return null
    } 

    async setObject(obj, val) {
        await Preferences.set({ key: obj, value: JSON.stringify(val) });
    }

    async removeObject(obj){
        await Preferences.remove(obj);
    }

    async clearPreferences(){
        await Preferences.clear();
    }
}