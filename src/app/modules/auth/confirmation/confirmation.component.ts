import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { ApiService } from 'app/services/api.service';
import { finalize, Subject, takeUntil, takeWhile, tap, timer } from 'rxjs';
import { Capacitor } from '@capacitor/core';

@Component({
    selector     : 'auth-confirmation',
    templateUrl  : './confirmation.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class AuthConfirmationComponent implements OnInit, OnDestroy {
    countdown: number = 5;
    countdownMapping: any = {
        '=1': '# second',
        'other': '# seconds'
    };
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    native: string = '';
    id: string = '';
    /**
     * Constructor
     */
    constructor(
        private _router: Router,
        private apiService: ApiService,
        private route: ActivatedRoute
    )
    {
        this.native = Capacitor.isNativePlatform() ? 'White' : '';
        this.route.queryParams
            .subscribe(params => {
                this.id = params.id
            });
    }

    ngOnInit(): void {
        this.apiService.confirm(this.id).subscribe(x => {
            // Redirect after the countdown
            timer(100, 100)
                .pipe(
                    finalize(() => {
                        this._router.navigate(['sign-in']);
                    }),
                    takeWhile(() => this.countdown > 0),
                    takeUntil(this._unsubscribeAll),
                    tap(() => this.countdown--)
                )
                .subscribe();
        });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
