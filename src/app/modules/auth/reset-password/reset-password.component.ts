import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseValidators } from '@fuse/validators';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Guid } from 'guid-typescript';
import { Capacitor } from '@capacitor/core';

@Component({
    selector: 'auth-reset-password',
    templateUrl: './reset-password.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class AuthResetPasswordComponent implements OnInit {
    @ViewChild('resetPasswordNgForm') resetPasswordNgForm: NgForm;
    id: string;
    native: string = '';

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: ''
    };
    resetPasswordForm: FormGroup;
    showAlert: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private authService: AuthService,
        private _formBuilder: FormBuilder,
        private route: ActivatedRoute
    ) {
        this.native = Capacitor.isNativePlatform() ? 'White' : '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.route.queryParams
            .subscribe(params => {
                this.id = params.id
            });
        // Create the form
        this.resetPasswordForm = this._formBuilder.group({
            password: ['', Validators.required],
            passwordConfirm: ['', Validators.required]
        },
            {
                validators: FuseValidators.mustMatch('password', 'passwordConfirm')
            }
        );
        setTimeout(() => {
            //console.log(this.id);
        }, 100);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Reset password
     */
    resetPassword(): void {
        // Return if the form is invalid
        if (this.resetPasswordForm.invalid) {
            return;
        }

        // Disable the form
        this.resetPasswordForm.disable();

        // Hide the alert
        this.showAlert = false;

        // Send the request to the server
        this.authService.resetPassword(this.id, this.resetPasswordForm.get('password').value)
            .pipe(
                finalize(() => {

                    // Re-enable the form
                    this.resetPasswordForm.enable();

                    // Reset the form
                    this.resetPasswordNgForm.resetForm();

                    // Show the alert
                    this.showAlert = true;
                })
            )
            .subscribe(
                (response) => {

                    // Set the alert
                    this.alert = {
                        type: 'success',
                        message: 'Your password has been reset.'
                    };
                },
                (response) => {

                    // Set the alert
                    this.alert = {
                        type: 'error',
                        message: 'Something went wrong, please try again.'
                    };
                }
            );
    }
}
