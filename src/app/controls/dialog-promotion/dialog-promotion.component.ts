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
import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal';

const options: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 25000,
  maximumAge: 0
};

@Component({
  selector: 'app-promotion',
  templateUrl: './dialog-promotion.component.html',
  styleUrls: ['./dialog-promotion.component.scss']
})
export class DialogPromotionComponent implements OnInit, AfterViewInit {
  image: string = null;
  fileToUpload: any;
  form: FormGroup;
  userItems: User[];
  public payPalConfig?: IPayPalConfig;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogPromotionComponent>,
    private variableService: VariableService,
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    public fuseSplashScreenService: FuseSplashScreenService) {
    fuseSplashScreenService.show();
    this.form = this.data.form;

    if (data) {
    }
    this.getUsersFilter().then(getUsersFilterResult => {
      this.userItems = getUsersFilterResult;
      if (getUsersFilterResult.length > 0) {
        this.form.controls['userId'].setValue(getUsersFilterResult[0].id);
      }
      fuseSplashScreenService.hide();
    })
  }

  ngOnInit(): void {
    this.initConfig();
  }

  getUsersFilter(): Promise<any[]> {
    var promise = new Promise<any[]>((resolve) => {
      try {
        Geolocation.getCurrentPosition(options).then(res => {
          this.apiService.getUsersFilter(1000, res.coords.latitude, res.coords.longitude).subscribe(result => {
            resolve(result);
          });
        });
      } catch (exception) {
        resolve([]);
      }
    });
    return promise;
  }

  ngAfterViewInit(): void {
  }

  async captureImage() {
    let options = {
      quality: 100,
      allowEditing: false,
      source: CameraSource.Prompt,
      resultType: CameraResultType.Base64,
      height: 600
    }
    Camera.getPhoto(options).then(async (imageData) => {
      this.image = `data:image/jpeg;base64,${imageData.base64String}`!;
      const resizedImage = await this.variableService.resizeImage({
        file: this.dataURLtoFile(`data:image/jpeg;base64,${imageData.base64String}`!),
        maxSize: 600
      });
      console.log(resizedImage);
      this.fileToUpload = this.dataURLtoFile(resizedImage);
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

    console.log(new File([u8arr], 'file.' + mime.replace('image/', ''), { type: mime }));

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

  private initConfig(): void {
    this.payPalConfig = {
      currency: 'USD',
      clientId: 'AUDcxIQ0BpCD0O1y6mkBzMMxcdQDqea0CF7ql6X8C8RxcMZPdaUuqbShFl1T-PTfiVhU9JUsvN23Cf7B',
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: '5',
              breakdown: {
                item_total: {
                  currency_code: 'USD',
                  value: '5'
                }
              }
            },
            items: [
              {
                name: 'Vibe Viewer Promotion',
                quantity: '1',
                category: 'DIGITAL_GOODS',
                unit_amount: {
                  currency_code: 'USD',
                  value: '5',
                },
              }
            ]
          }
        ]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical',
        shape: 'pill'
      },
      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        //NBNBNBNB// Add to db
        this.form.controls['urlImage'].setValue(this.image);
        this.form.controls['fileToUpload'].setValue(this.fileToUpload);
        console.log(this.form.value);
        this.dialogRef.close(this.form.value);
      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
      },
      onError: err => {
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
    };
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
  submit(): void {
    let proceed = true;
    if (!this.form.controls['userId'].value || !this.image || !this.fileToUpload || !this.form.valid) {
      proceed = false;
    }
    if (proceed) {
      this.form.controls['urlImage'].setValue(this.image);
      this.form.controls['fileToUpload'].setValue(this.fileToUpload);
      console.log(this.form.value);
      this.dialogRef.close(this.form.value);
    }
  }
}
