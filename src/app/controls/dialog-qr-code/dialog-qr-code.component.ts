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
  selector: 'app-qr-code',
  templateUrl: './dialog-qr-code.component.html',
  styleUrls: ['./dialog-qr-code.component.scss']
})
export class DialogQrCodeComponent {
  email;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogQrCodeComponent>) {
      this.email = data.email;
  }

  copyReferral() {
      Clipboard.write({
          string: "https://vibeviewer.com/sign-up?r=" + this.email
      });
      Toast.show({
          text: 'Referral Link copied to clipboard',
        });
  }

  submit(): void {
    this.dialogRef.close();
  }
}
