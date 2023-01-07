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

const options: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 25000,
  maximumAge: 0
};

@Component({
  selector: 'app-app-code',
  templateUrl: './dialog-app-code.component.html',
  styleUrls: ['./dialog-app-code.component.scss']
})
export class DialogAppCodeComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogAppCodeComponent>) {
  }

  copyReferral() {
      Clipboard.write({
          string: "https://play.google.com/store/apps/details?id=com.vibeviewer.app"
      });
      Toast.show({
          text: 'App Link copied to clipboard',
        });
  }

  submit(): void {
    this.dialogRef.close();
  }
}
