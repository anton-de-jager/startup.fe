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
  selector: 'app-review',
  templateUrl: './dialog-review.component.html',
  styleUrls: ['./dialog-review.component.scss']
})
export class DialogReviewComponent implements OnInit, AfterViewInit {
  image: string = null;
  fileToUpload: any;
  form: FormGroup;
  userItems: User[];
  ratingVibe = 0;
  ratingQuality = 0;
  ratingPrice = 0;
  ratingChildFriendly = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogReviewComponent>,
    private variableService: VariableService,
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    public fuseSplashScreenService: FuseSplashScreenService) {
    this.form = this.formBuilder.group({
      userId: [null, Validators.required],
      image: [null],
      vibe: [0],
      quality: [0],
      price: [0],
      childFriendly: [0]
    });

    if (data) {
      this.userItems = data.userItems;
      if (data.userItems.length > 0) {
        this.form.controls['userId'].setValue(data.userItems[0].id);
      }
    }
  }

  ngOnInit(): void {
    this.captureImage(1);
  }

  ngAfterViewInit(): void {
  }

  async captureImage(id) {
    let options = {
      quality: 100,
      allowEditing: false,
      source: CameraSource.Camera,
      resultType: CameraResultType.Base64,
      height: 1000
    }
    Camera.getPhoto(options).then(async (imageData) => {
      switch (id) {
        case 1:
          this.image = `data:image/jpeg;base64,${imageData.base64String}`!;
          const resizedImage1 = await this.variableService.resizeImage({
            file: this.dataURLtoFile(`data:image/jpeg;base64,${imageData.base64String}`!),
            maxSize: 1000
          });
          this.fileToUpload = this.dataURLtoFile(resizedImage1);
          break;
        default:
          break;
      }
    }, (err) => {
      console.log(err);
    });
  }

  dataURLtoFile(dataurl) {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }


    return new File([u8arr], 'file.' + mime.replace('image/', ''), { type: mime });
  }

  uploadFile(fileToUpload, filename): Promise<boolean> {
    var promise = new Promise<boolean>((resolve) => {
      try {
        const formData = new FormData();
        formData.append('file', fileToUpload);
        this.apiService.upload('users', formData, filename).subscribe(event => {
          if (event.type === HttpEventType.Response) {
            resolve(true);
          }
        })
      } catch (exception) {
        resolve(false);
      }
    });
    return promise;
  }

  ratingUpdated(element, val) {
    switch (element) {
      case 'vibe':
        this.ratingVibe = val.rating;
        break;
      case 'quality':
        this.ratingQuality = val.rating;
        break;
      case 'price':
        this.ratingPrice = val.rating;
        break;
      case 'childFriendly':
        this.ratingChildFriendly = val.rating;
        break;
      default:
        break;
    }
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
  submit(): void {
    let proceed = true;
    if (!this.form.controls['userId'].value || !this.image || !this.fileToUpload || !this.ratingVibe || !this.ratingQuality || !this.ratingPrice || !this.ratingChildFriendly) {
      proceed = false;
    }
    if (proceed) {
      Device.getId().then(device => {
        let result = {
          deviceId: device.uuid,
          userId: this.form.controls['userId'].value,
          urlImage: this.image,
          fileToUpload: this.fileToUpload,
          reviewVibe: this.ratingVibe,
          reviewQuality: this.ratingQuality,
          reviewPrice: this.ratingPrice,
          reviewChildFriendly: this.ratingChildFriendly,
          statusId: '511961D3-B787-47D0-ACFC-8D6F1E7565AC'
        }
        this.dialogRef.close(result);
      });
    }
  }
}
