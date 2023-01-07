import { HttpEventType } from '@angular/common/http';
import { Component, OnInit, AfterViewInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { ApiService } from 'app/services/api.service';
import { VariableService } from 'app/services/variable.service';
import { FormGroup, FormControl, FormBuilder, Validators } from "@angular/forms";
import { User } from 'app/models/user.model';
import { Geolocation } from '@capacitor/geolocation';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { Device } from '@capacitor/device';
import { SafeUrl } from '@angular/platform-browser';
import { Clipboard } from '@capacitor/clipboard';
import { Toast } from '@capacitor/toast';

@Component({
  selector: 'app-notification',
  templateUrl: './dialog-notification.component.html',
  styleUrls: ['./dialog-notification.component.scss']
})
export class DialogNotificationComponent {
  title = '';
  body = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogNotificationComponent>) {
      this.title = data.title;
      this.body = data.body;
  }

  submit(): void {
    this.dialogRef.close();
  }
}
