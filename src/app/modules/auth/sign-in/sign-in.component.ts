import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { LoginRequest } from 'app/requests/login-request';
import { ErrorResponse } from 'app/responses/error-response';
import { EventEmitterService } from 'app/services/event-emitter.service';
import { TokenService } from 'app/services/token.service';

@Component({
    selector: 'auth-sign-in',
    templateUrl: './sign-in.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class AuthSignInComponent implements OnInit {
    @ViewChild('signInNgForm') signInNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: ''
    };
    signInForm: FormGroup;
    showAlert: boolean = false;

    showPlayStore = Capacitor.getPlatform() === 'web';

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private authService: AuthService,
        private tokenService: TokenService,
        private eventEmitterService: EventEmitterService
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.signInForm = this._formBuilder.group({
            email: [localStorage.getItem('login_email') ? localStorage.getItem('login_email') : '', [Validators.required, Validators.email]],
            password: [localStorage.getItem('login_password') ? localStorage.getItem('login_password') : '', Validators.required],
            rememberMe: ['']
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign in
     */
    signIn(): void {
        // Return if the form is invalid
        if (this.signInForm.invalid) {
            return;
        }


        // Disable the form
        this.signInForm.disable();

        // Hide the alert
        this.showAlert = false;

        localStorage.setItem('login_email', this.signInForm.controls['email'].value);
        localStorage.setItem('login_password', this.signInForm.controls['password'].value);
        let loginRequest: LoginRequest = {
            email: this.signInForm.controls['email'].value,
            password: this.signInForm.controls['password'].value
        };
        this.authService.signIn(loginRequest).subscribe({
            next: (data => {
                console.debug(`logged in successfully ${data}`);
                this.tokenService.saveSession(data);
                const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';
                this._router.navigateByUrl(redirectURL);
            }),
            error: ((error: ErrorResponse) => {
                console.log(error);
                // Re-enable the form
                this.signInForm.enable();

                // Reset the form
                //this.signInNgForm.resetForm();

                // Set the alert
                this.alert = {
                    type: 'error',
                    message: 'Wrong email or password'
                };

                // Show the alert
                this.showAlert = true;
            })

        });

        // // Sign in
        // this._authService.signIn(this.signInForm.value)
        //     .subscribe(
        //         () => {

        //             // Set the redirect url.
        //             // The '/signed-in-redirect' is a dummy url to catch the request and redirect the user
        //             // to the correct page after a successful sign in. This way, that url can be set via
        //             // routing file and we don't have to touch here.
        //             const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';

        //             // Navigate to the redirect url
        //             this._router.navigateByUrl(redirectURL);

        //         },
        //         (response) => {

        //             // Re-enable the form
        //             this.signInForm.enable();

        //             // Reset the form
        //             this.signInNgForm.resetForm();

        //             // Set the alert
        //             this.alert = {
        //                 type: 'error',
        //                 message: 'Wrong email or password'
        //             };

        //             // Show the alert
        //             this.showAlert = true;
        //         }
        //     );
    }

    home() {
        this.eventEmitterService.onChangePage('home');
        this._router.navigate(['home']);
    }

    navigateExternal(event: Event, url) {
        event.preventDefault();
        if (Capacitor.isNativePlatform) {
            Browser.open({ url });
        } else {
            window.open(url, '_blank');
        }
    }
}
