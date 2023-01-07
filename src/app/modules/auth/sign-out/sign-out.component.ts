import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, Subject, takeUntil, takeWhile, tap, timer } from 'rxjs';
import { TokenService } from 'app/services/token.service';
import { EventEmitterService } from 'app/services/event-emitter.service';

@Component({
    selector     : 'auth-sign-out',
    templateUrl  : './sign-out.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AuthSignOutComponent implements OnInit, OnDestroy
{
    countdown: number = 5;
    countdownMapping: any = {
        '=1'   : '# second',
        'other': '# seconds'
    };
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private tokenService: TokenService,
        private _router: Router,
        private eventEmitterService: EventEmitterService
    )
    {
        this.eventEmitterService.onChangeUser(null);
        localStorage.removeItem('AT');
        localStorage.removeItem('RT');
        localStorage.removeItem('ID');
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Sign out
        //this._authService.signOut();
        this.tokenService.logout();

        // Redirect after the countdown
        timer(1000, 1000)
            .pipe(
                finalize(() => {
                    this._router.navigate(['home']);
                }),
                takeWhile(() => this.countdown > 0),
                takeUntil(this._unsubscribeAll),
                tap(() => this.countdown--)
            )
            .subscribe();
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
