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

const options: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 25000,
  maximumAge: 0
};

@Component({
  selector: 'app-terms',
  templateUrl: './dialog-terms.component.html',
  styleUrls: ['./dialog-terms.component.scss']
})
export class DialogTermsComponent {
  deviceId: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogTermsComponent>) {

    if (data) {
      this.deviceId = data.deviceId;
    }
  }

  submit(): void {
    this.dialogRef.close();
  }
}
