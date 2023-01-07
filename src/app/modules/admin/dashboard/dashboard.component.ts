import { AfterViewInit, Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { User } from 'app/models/user.model';
import { ApiService } from 'app/services/api.service';
import { SharedService } from 'app/shared/shared.service';
import { VariableService } from 'app/services/variable.service';
import { environment } from 'environments/environment';
import { Guid } from 'guid-typescript';
import { UserService } from 'app/core/user/user.service';
import { EventEmitterService } from 'app/services/event-emitter.service';
import { upperCase } from 'lodash';
import { DialogNotificationComponent } from 'app/controls/dialog-notification/dialog-notification.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.html',
    encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements AfterViewInit {
    timestamp: number = 0;
    imagesFolder = environment.api + '/Images/';
    user: any;
    review = 3;
    reviewVibe = 1;
    reviewQuality = 2;
    reviewPrice = 3;
    reviewChildFriendly = 5;
    reviewCount = 24;
    countSent = 50;
    countRead = 45;
    encodedData: '';
    isReseller = false;
    trial = false;
    daysLeft = '0';

    constructor(
        private _activatedRoute: ActivatedRoute,
        private dialog: MatDialog,
        private _userService: UserService,
        private fuseSplashScreenService: FuseSplashScreenService,
        private eventEmitterService: EventEmitterService,
        private router: Router,
        public variableService: VariableService,
        public sharedService: SharedService,
        public apiService: ApiService,
        private _router: Router
    ) {
        console.log('in');
        this.timestamp = new Date().getTime();
        this.fuseSplashScreenService.show();
        this._userService.get().subscribe(user => {
            this.user = user;
            this.isReseller = upperCase(this.user.userTypeId) == upperCase('463af20d-e093-4ca0-9ac1-23909de39f9c');
            this.eventEmitterService.onChangeUser(user);
            if (!this.user) {
                localStorage.removeItem('AT');
                localStorage.removeItem('RT');
                localStorage.removeItem('ID');
                this.router.navigateByUrl('/sign-in');
            } else {
                var Difference_In_Time = new Date().getTime() - new Date(this.user.ts).getTime();
                var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
                console.log(Difference_In_Days);
                if (Guid.parse(this.user.statusId).toString() !== Guid.parse('8225b68c-0691-4cb7-aff2-5efe9866f434').toString() && Difference_In_Days > 14) {
                    this.router.navigateByUrl('/subscription');
                }
                if (Guid.parse(this.user.statusId).toString() !== Guid.parse('8225b68c-0691-4cb7-aff2-5efe9866f434').toString() && Difference_In_Days <= 14) {
                    this.trial = true;
                    this.daysLeft = (14 - Difference_In_Days).toFixed(0);
                }
                this.apiService.getDashboard(this.user.id).subscribe(dashboard => {
                    this.review = dashboard.review;
                    this.reviewVibe = dashboard.reviewVibe;
                    this.reviewQuality = dashboard.reviewQuality;
                    this.reviewPrice = dashboard.reviewPrice;
                    this.reviewChildFriendly = dashboard.reviewChildFriendly;
                    this.reviewCount = dashboard.reviewCount;
                    this.countSent = dashboard.countSent;
                    this.countRead = dashboard.countRead;
                    this.fuseSplashScreenService.hide();
                    this.eventEmitterService.onChangePage('dashboard');
                })
            }

        }, error => {
            localStorage.removeItem('AT');
            localStorage.removeItem('RT');
            localStorage.removeItem('ID');

            const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/home';
            this._router.navigateByUrl(redirectURL);
        });
    }

    subscribe(){
        this.apiService.submitSubscription(this.user.id).subscribe(result => {
            const dialogConfig = new MatDialogConfig();
            
            dialogConfig.data = { title: 'Email Sent', body: 'A subscription link has been sent to <b>' + this.user.email + '</b>' };

            dialogConfig.autoFocus = true;
            dialogConfig.disableClose = true;
            dialogConfig.hasBackdrop = true;
            dialogConfig.ariaLabel = 'fffff';
            dialogConfig.width = "100vw";
            dialogConfig.maxWidth = "800px";
            dialogConfig.panelClass = 'full-screen-modal';

            const dialogRef = this.dialog.open(DialogNotificationComponent,
                dialogConfig);
        });
    }

    ngAfterViewInit(): void {
    }

    menuClicked(str) {
        this._router.navigate([str]);
    }
}
