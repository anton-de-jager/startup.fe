import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { FuseNavigationService, FuseVerticalNavigationComponent } from '@fuse/components/navigation';
import { Navigation } from 'app/core/navigation/navigation.types';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { EventEmitterService } from 'app/services/event-emitter.service';
import { UserService } from 'app/core/user/user.service';
import { upperCase } from 'lodash';

@Component({
    selector: 'modern-layout',
    templateUrl: './modern.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ModernLayoutComponent implements OnInit, OnDestroy {
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    pageItems = [];
    pageSelected = '';
    location: any;

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _navigationService: NavigationService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseNavigationService: FuseNavigationService,
        private eventEmitterService: EventEmitterService,
        private userService: UserService
    ) {
        this.userService.get().subscribe(user => {
            this.initBottomBar(localStorage.getItem('pageSelected') ? localStorage.getItem('pageSelected') : 'home', upperCase(user.userTypeId.toString()) == upperCase('463AF20D-E093-4CA0-9AC1-23909DE39F9C'));
            this.eventEmitterService.invokeChangePageFunction.subscribe(page => {
                this.initBottomBar(page, upperCase(user.userTypeId.toString()) == upperCase('463AF20D-E093-4CA0-9AC1-23909DE39F9C'));
            });
        });
    }

    initBottomBar(page, isReseller) {
        switch (page) {
            case 'home':
                this.pageSelected = 'home';
                break;
            case 'dashboard':
                this.pageSelected = 'dashboard';
                if (isReseller) {
                    this.pageItems = [
                        { id: 'home', icon: 'heroicons_outline:home', description: 'Home' },
                        { id: 'promotions', icon: 'heroicons_outline:light-bulb', description: 'Promotions' },
                        { id: 'profile', icon: 'heroicons_outline:user', description: 'Profile' }
                    ];
                } else {
                    this.pageItems = [
                        { id: 'home', icon: 'heroicons_outline:home', description: 'Home' },
                        { id: 'promotions', icon: 'heroicons_outline:light-bulb', description: 'Promotions' },
                        { id: 'profile', icon: 'heroicons_outline:user', description: 'Profile' }
                    ]
                }
                break;
            case 'profile':
                this.pageSelected = 'profile';
                if (isReseller) {
                    this.pageItems = [
                        { id: 'home', icon: 'heroicons_outline:home', description: 'Home' },
                        { id: 'dashboard', icon: 'heroicons_outline:document-report', description: 'Dashboard' },
                    ];
                } else {
                    this.pageItems = [
                        { id: 'home', icon: 'heroicons_outline:home', description: 'Home' },
                        { id: 'dashboard', icon: 'heroicons_outline:document-report', description: 'Dashboard' },
                        { id: 'promotions', icon: 'heroicons_outline:light-bulb', description: 'Promotions' }
                    ]
                }
                break;
            case 'promotions':
                this.pageSelected = 'promotions';
                this.pageItems = [
                    { id: 'home', icon: 'heroicons_outline:home', description: 'Home' },
                    { id: 'dashboard', icon: 'heroicons_outline:document-report', description: 'Dashboard' },
                    { id: 'profile', icon: 'heroicons_outline:user', description: 'Profile' }
                ]
                break;
            case 'subscription':
                this.pageSelected = 'subscription';
                this.pageItems = [
                    { id: 'home', icon: 'heroicons_outline:home', description: 'Home' }
                ]
                break;
            default:
                this.pageSelected = 'home';
                this.pageItems = [
                    { id: 'home', icon: 'heroicons_outline:home', description: 'Home' }
                ]
                break;
        }
    }

    menuClicked(str) {
        this.eventEmitterService.onChangePage(str);
        this._router.navigate([str]);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for current year
     */
    get currentYear(): number {
        return new Date().getFullYear();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle navigation
     *
     * @param name
     */
    toggleNavigation(name: string): void {
        // Get the navigation
        const navigation = this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(name);

        if (navigation) {
            // Toggle the opened status
            navigation.toggle();
        }
    }

    goHome(): void {
        this._router.navigate(['home']);
    }
}
