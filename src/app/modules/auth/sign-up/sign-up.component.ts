import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { EventEmitterService } from 'app/services/event-emitter.service';
import { Geolocation, Position } from '@capacitor/geolocation';
import { ApiService } from 'app/services/api.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogAddressComponent } from 'app/controls/dialog-address/dialog-address.component';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { HttpEventType } from '@angular/common/http';
import { VariableService } from 'app/services/variable.service';
import { AuthService } from 'app/core/auth/auth.service';
import { upperCase } from 'lodash';
import { Browser } from '@capacitor/browser';
import { DialogNotificationComponent } from 'app/controls/dialog-notification/dialog-notification.component';

const options: PositionOptions = {
    enableHighAccuracy: true,
    timeout: 25000,
    maximumAge: 0
}

@Component({
    selector: 'auth-sign-up',
    templateUrl: './sign-up.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class AuthSignUpComponent implements OnInit {
    @ViewChild('signUpNgForm') signUpNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: ''
    };
    signUpForm: UntypedFormGroup;
    showAlert: boolean = false;
    previewImage: string = null;
    fileToUpload: any;
    userTypeList = [];
    location: any;
    submitClicked = false;

    showPlayStore = Capacitor.getPlatform() === 'web';
    referral: string = '';
    referralEmailExists = false;

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _router: Router,
        private eventEmitterService: EventEmitterService,
        private fuseSplashScreenService: FuseSplashScreenService,
        private variableService: VariableService,
        private dialog: MatDialog,
        private apiService: ApiService,
        private authService: AuthService,
        private route: ActivatedRoute
    ) {
        this.route.queryParams
            .subscribe(params => {
                if (params.r !== undefined) {
                    localStorage.setItem('referralEmail', params.r);
                    this.referral = params.r;
                    this.referralEmailExists = true;
                }
            });
        if (this.referral == '' && localStorage.getItem('referralEmail') !== undefined) {
            this.referral = localStorage.getItem('referralEmail');
            this.referralEmailExists = true;
        }
        fuseSplashScreenService.show();
        this.getUserTypes().then(async result => {
            this.userTypeList = result.sort((a, b) => (a.order > b.order) ? 1 : -1);
            if (Capacitor.getPlatform() !== 'web') {
                const geolocationEnabled = await Geolocation.checkPermissions();

                if (geolocationEnabled.location !== 'granted') {
                    const granted = await Geolocation.requestPermissions();

                    if (granted.location !== 'granted') {
                        return;
                    }
                }
            }
            Geolocation.getCurrentPosition(options).then(res => {
                this.location = { lat: res.coords.latitude, lon: res.coords.longitude }
                this.signUpForm = this._formBuilder.group({
                    userTypeId: ['', Validators.required],
                    name: [''],
                    description: [''],
                    lat: [this.location.lat],
                    lon: [this.location.lon],
                    address: [''],
                    email: [localStorage.getItem('loginEmail') !== undefined ? localStorage.getItem('loginEmail') : '', [Validators.required, Validators.email]],
                    referralEmail: [this.referral, [Validators.email]],
                    phone: [''],
                    web: [''],
                    password: [localStorage.getItem('loginPassword') !== undefined ? localStorage.getItem('loginPassword') : '', [Validators.required, Validators.minLength(8)]],
                    confirmPassword: [''],
                    urlImage: [''],
                    avatarChanged: [false]//,
                    //code: ['']//,
                    //agreements: ['', Validators.requiredTrue]
                });
                fuseSplashScreenService.hide();
            })
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
    }

    getUserTypes(): Promise<any[]> {
        var promise = new Promise<any[]>((resolve) => {
            try {
                this.apiService.getItem('userTypes').subscribe(result => {
                    resolve(result);
                });
            } catch (exception) {
                resolve([]);
            }
        });
        return promise;
    }

    venueTypeChanged(event) {
        if (upperCase(event.value) == upperCase('463af20d-e093-4ca0-9ac1-23909de39f9c')) {
            this.signUpForm.get('name').clearValidators();
            this.signUpForm.get('description').clearValidators();
            this.signUpForm.get('address').clearValidators();
            this.signUpForm.get('address').clearValidators();
        } else {
            this.signUpForm.get('name').setValidators(Validators.required);
            this.signUpForm.get('description').setValidators(Validators.required);
            this.signUpForm.get('address').setValidators(Validators.required);
            this.signUpForm.get('address').setValidators(Validators.required);
        }
    }

    getAddress() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { label: 'Enter Address', address: this.signUpForm.controls['address'].value, lat: this.signUpForm.controls['lat'].value, lon: this.signUpForm.controls['lon'].value };

        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.hasBackdrop = true;
        dialogConfig.ariaLabel = 'fffff';
        dialogConfig.width = "100vw";
        dialogConfig.maxWidth = "800px";
        dialogConfig.panelClass = 'full-screen-modal';

        const dialogRef = this.dialog.open(DialogAddressComponent,
            dialogConfig);


        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.signUpForm.controls['lat'].setValue(result.location.lat);
                this.signUpForm.controls['lon'].setValue(result.location.lon);
                this.signUpForm.controls['address'].setValue(result.address);
            }
        });
    }

    // test(): void {
    //     this.uploadTest(this.fileToUpload, '0000000' + '.' + this.fileToUpload.name.split('.').pop()).then(x => {

    //     });
    // }

    signUp(): void {
        this.submitClicked = true;
        // Do nothing if the form is invalid
        console.log(this.signUpForm.controls['userTypeId'].value);
        console.log(this.signUpForm);
        if (this.signUpForm.invalid || (!this.fileToUpload && upperCase(this.signUpForm.controls['userTypeId'].value) !== upperCase('463AF20D-E093-4CA0-9AC1-23909DE39F9C'))) {
            return;
        }

        if (upperCase(this.signUpForm.controls['userTypeId'].value) == upperCase('463AF20D-E093-4CA0-9AC1-23909DE39F9C')) {
            this.signUpForm.controls['name'].setValue('Reseller');
        }

        // Disable the form
        this.signUpForm.disable();

        // Hide the alert
        this.showAlert = false;

        this.signUpForm.controls['urlImage'].setValue('.');
        if(this.referralEmailExists){
            this.signUpForm.controls['referralEmail'].setValue(localStorage.getItem('referralEmail'));        
        }
        this.signUpForm.controls['confirmPassword'].setValue(this.signUpForm.controls['password'].value);

        if (upperCase(this.signUpForm.controls['userTypeId'].value) == upperCase('463AF20D-E093-4CA0-9AC1-23909DE39F9C')) {
            this.signUpForm.controls['lat'].setValue(this.location.lat);
            this.signUpForm.controls['lon'].setValue(this.location.lon);
        }

        this.authService.signUp(this.signUpForm.value).subscribe({
            next: response => {
                if (response != '00000000-0000-0000-0000-000000000000') {
                    localStorage.setItem('loginEmail', this.signUpForm.controls['email'].value);
                    localStorage.setItem('loginPassword', this.signUpForm.controls['password'].value);
                    if (this.fileToUpload) {
                        this.uploadFile(this.fileToUpload, response + '.' + this.fileToUpload.name.split('.').pop()).then(x => {
                            this.showNotification('Confirmation Required', 'A confirmation link has been sent to your email address.<br>Please confirm your email address to activate your account.', 'home');
                        });
                    } else {
                        this.showNotification('Confirmation Required', 'A confirmation link has been sent to your email address.<br>Please confirm your email address to activate your account.', 'home');
                    }
                } else {
                    // Re-enable the form
                    this.signUpForm.enable();

                    this.alert = {
                        type: 'error',
                        message: response
                    };

                    // Show the alert
                    this.showAlert = true;
                }
            },
            error: err => {
                // Re-enable the form
                this.signUpForm.enable();

                // Reset the form
                //this.signUpNgForm.resetForm();

                // Set the alert
                this.alert = {
                    type: 'error',
                    message: 'Something went wrong, please try again.'
                };

                // Show the alert
                this.showAlert = true;
            }
        });

        // this._authService.signUp(this.signUpForm.value).subscribe({
        //     next: response => {
        //         if (response != '00000000-0000-0000-0000-000000000000') {
        //             if (this.fileToUpload) {
        //                 this.uploadFile(this.fileToUpload, response + '.' + this.fileToUpload.name.split('.').pop()).then(x => {
        //                     this._router.navigateByUrl('/sign-in');
        //                 });
        //             } else {
        //                 this._router.navigateByUrl('/sign-in');
        //             }
        //         } else {
        //             // Re-enable the form
        //             this.signUpForm.enable();

        //             this.alert = {
        //                 type: 'error',
        //                 message: response
        //             };

        //             // Show the alert
        //             this.showAlert = true;
        //         }
        //     },
        //     error: err => {
        //         // Re-enable the form
        //         this.signUpForm.enable();

        //         // Reset the form
        //         this.signUpNgForm.resetForm();

        //         // Set the alert
        //         this.alert = {
        //             type: 'error',
        //             message: 'Something went wrong, please try again.'
        //         };

        //         // Show the alert
        //         this.showAlert = true;
        //     }
        // });
    }

    showNotification(title, body, redirect) {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.data = { title: title, body: body };

        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.hasBackdrop = true;
        dialogConfig.ariaLabel = 'fffff';
        dialogConfig.width = "100vw";
        dialogConfig.maxWidth = "800px";
        dialogConfig.panelClass = 'full-screen-modal';

        const dialogRef = this.dialog.open(DialogNotificationComponent,
            dialogConfig);

        if (redirect !== null) {
            dialogRef.afterClosed().subscribe(result => {
                this._router.navigateByUrl('/' + redirect);
            });
        }
    }

    async captureImage() {
        let options = {
            quality: 100,
            allowEditing: false,
            source: CameraSource.Prompt,
            resultType: CameraResultType.Base64,
            height: 1000
        }
        Camera.getPhoto(options).then(async (imageData) => {
            this.previewImage = `data:image/jpeg;base64,${imageData.base64String}`!;
            const resizedImage = await this.variableService.resizeImage({
                file: this.dataURLtoFile(`data:image/jpeg;base64,${imageData.base64String}`!),
                maxSize: 1000
            });
            this.fileToUpload = this.dataURLtoFile(resizedImage);
            this.signUpForm.controls['avatarChanged'].setValue(true);
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

    // uploadTest(fileToUpload, filename): Promise<boolean> {
    //     var promise = new Promise<boolean>((resolve) => {
    //         try {
    //             const formData = new FormData();
    //             formData.append('file', fileToUpload);
    //             this.apiService.testUpload(this.previewImage, filename).subscribe(event => {
    //                 if (event.type === HttpEventType.Response) {
    //                     resolve(true);
    //                 }
    //             })
    //         } catch (exception) {
    //             resolve(false);
    //         }
    //     });
    //     return promise;
    // }

    home() {
        this.eventEmitterService.onChangePage('home');
        this._router.navigate(['home']);
    }
}
