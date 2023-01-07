import { HttpEventType } from '@angular/common/http';
import { Component, OnInit, AfterViewInit, Inject } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
import { DialogNotificationComponent } from '../dialog-notification/dialog-notification.component';

const options: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 25000,
  maximumAge: 0
};

@Component({
  selector: 'app-email',
  templateUrl: './dialog-email.component.html',
  styleUrls: ['./dialog-email.component.scss']
})
export class DialogEmailComponent {
  form: FormGroup;
  id;
  submitting = false;

  constructor(
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogEmailComponent>) {
    this.id = data.id;
    this.form = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]]
    });
  }



  cancel(): void {
    this.dialogRef.close();
  }
  submit(): void {
    this.submitting = true;
    this.apiService.email(this.id, this.form.controls['email'].value).subscribe(res => {
      this.submitting = false;
      const dialogConfig = new MatDialogConfig();
            
            dialogConfig.data = { title: 'Email Sent', body: 'Vibe Viewer FAQ\'s have been sent to <b>' + this.form.controls['email'].value + '</b>' };

            dialogConfig.autoFocus = true;
            dialogConfig.disableClose = true;
            dialogConfig.hasBackdrop = true;
            dialogConfig.ariaLabel = 'fffff';
            dialogConfig.width = "100vw";
            dialogConfig.maxWidth = "800px";
            dialogConfig.panelClass = 'full-screen-modal';

            const dialogRef = this.dialog.open(DialogNotificationComponent,
                dialogConfig);
    })
  }
}
