import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { BooleanInput } from '@angular/cdk/coercion';
import { Subject, takeUntil } from 'rxjs';
import { User } from 'app/models/user.model';
import { UserService } from 'app/core/user/user.service';
import { Preferences } from '@capacitor/preferences';
import { EventEmitterService } from 'app/services/event-emitter.service';
import { MatDialog as MatDialog, MatDialogConfig as MatDialogConfig } from '@angular/material/dialog';
import { DialogQrCodeComponent } from 'app/controls/dialog-qr-code/dialog-qr-code.component';
import { DialogAppCodeComponent } from 'app/controls/dialog-app-code/dialog-app-code.component';
import { environment } from 'environments/environment';
import { upperCase } from 'lodash';
import { DialogEmailComponent } from 'app/controls/dialog-email/dialog-email.component';
import { Share } from '@capacitor/share';

@Component({
    selector: 'user',
    templateUrl: './user.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'user'
})
export class UserComponent implements OnInit, OnDestroy {
    /* eslint-disable @typescript-eslint/naming-convention */
    static ngAcceptInputType_showAvatar: BooleanInput;
    /* eslint-enable @typescript-eslint/naming-convention */

    @Input() showAvatar: boolean = true;
    user: User;
    apiUrl = environment.api;
    isReseller = false;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _userService: UserService,
        private eventEmitterService: EventEmitterService,
        private dialog: MatDialog
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) => {
                this.user = user;
                this.isReseller = user ? upperCase(user.userTypeId.toString()) == upperCase('463AF20D-E093-4CA0-9AC1-23909DE39F9C') : false;
                this._changeDetectorRef.markForCheck();
            });

            this.eventEmitterService.invokeChangeUserFunction.subscribe(user => {
                this._userService.user = user;
                this.user = user;
                this.isReseller = user ? upperCase(user.userTypeId.toString()) == upperCase('463AF20D-E093-4CA0-9AC1-23909DE39F9C') : false;
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    qr(){
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            email: this.user.email
        }

        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.hasBackdrop = true;
        dialogConfig.ariaLabel = 'fffff';
        dialogConfig.width = "324px";
        dialogConfig.panelClass = 'full-screen-modal';

        const dialogRef = this.dialog.open(DialogQrCodeComponent,
            dialogConfig);
    }

    app(){
        const dialogConfig = new MatDialogConfig();

        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.hasBackdrop = true;
        dialogConfig.ariaLabel = 'fffff';
        dialogConfig.width = "324px";
        dialogConfig.panelClass = 'full-screen-modal';

        const dialogRef = this.dialog.open(DialogAppCodeComponent,
            dialogConfig);
    }

    async email(){
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            id: this.user.id
        }

        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.hasBackdrop = true;
        dialogConfig.ariaLabel = 'fffff';
        dialogConfig.width = "324px";
        dialogConfig.panelClass = 'full-screen-modal';

        const dialogRef = this.dialog.open(DialogEmailComponent,
            dialogConfig);    
    }
    async share(){
        let url = 'https://vibeviewer.com/sign-up';
        if(this.user !== undefined){
            url += '?r=' + this.user.email;
        }
        await Share.share({
            title: 'Vibe Viewer',
            text: 'find YOUR vibe',
            url: url,
            dialogTitle: 'Share the Vibe',
          });
    }

    signIn(): void {
        this._router.navigate(['/sign-in']);
    }

    signUp(): void {
        this._router.navigate(['/sign-up']);
    }

    signOut(): void {
        this._router.navigate(['/sign-out']);
    }

    selectPage(page): void {
        this.eventEmitterService.onChangePage(page);
        this._router.navigate([page]);
    }
}
