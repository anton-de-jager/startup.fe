import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Toast } from '@capacitor/toast';

@Injectable({
  providedIn: 'root'
})

export class NotificationService {

  constructor() {
    this.checkPermission();
  }

  checkPermission() {
    return LocalNotifications.checkPermissions().then((res) => {
      if (res && res.display && res.display == 'denied') {
        LocalNotifications.requestPermissions().then((res) => {
          if (res && res.display && res.display == 'denied') {
            Toast.show({text: "Need a Notification Permission to Set Reminder.", duration: 'long'});
          }
        })
      }
    });
  }

  async scheduleNotification(id: number, title: string, dateTime: any, description: string) {
    await LocalNotifications.schedule({
      notifications: [{
        id: id,
        title: title,
        body: description,
        schedule: {
          at: new Date(new Date(dateTime).getTime())
        },
        sound: 'notification.wav'
      }]
    });
  }
} 