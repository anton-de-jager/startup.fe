import { Component, ViewEncapsulation } from '@angular/core';
import { EventEmitterService } from 'app/services/event-emitter.service';
import { UserService } from 'app/core/user/user.service';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'app/services/api.service';
import { Geolocation } from '@capacitor/geolocation';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { FormBuilder, FormGroup } from '@angular/forms';
import { environment } from 'environments/environment';
import { AfterViewInit, OnInit } from '@angular/core';
import { NgxSwiperConfig } from 'ngx-image-swiper';
import { StarRatingColor } from 'app/controls/star-rating/star-rating.component';
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { SortComponent } from 'app/controls/sort/sort.component';
import { DialogGalleryComponent } from 'app/controls/dialog-gallery/dialog-gallery.component';
import { DialogHistoryComponent } from 'app/controls/dialog-history/dialog-history.component';
import { DialogReviewComponent } from 'app/controls/dialog-review/dialog-review.component';
import { Browser } from '@capacitor/browser';
import { Toast } from '@capacitor/toast';
import { DialogMapComponent } from 'app/controls/dialog-map/dialog-map.component';
//import { PullToRefreshService } from '@piumaz/pull-to-refresh';
import { User } from 'app/models/user.model';
import { App } from '@capacitor/app';
import { upperCase } from 'lodash';
import { ActionSheet, ActionSheetButtonStyle } from '@capacitor/action-sheet';
import { Capacitor } from '@capacitor/core';
import { Device } from '@capacitor/device';
import { DialogNotificationComponent } from 'app/controls/dialog-notification/dialog-notification.component';

const options: PositionOptions = {
    enableHighAccuracy: true,
    timeout: 25000,
    maximumAge: 0
};

@Component({
    selector: 'landing-home',
    templateUrl: './home.component.html',
    encapsulation: ViewEncapsulation.None
})
export class LandingHomeComponent implements OnInit, AfterViewInit {
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    user: any;
    timestamp = new Date().getTime();

    userIds = 'none';
    orderBy = 'distance';
    count: number = 0;

    lat;
    lon;
    latMap;
    lonMap;

    imageConfig = false;

    list = [];

    form: FormGroup;

    ratingVibe = 1;
    ratingQuality = 1;
    ratingPrice = 1;
    ratingChildFriendly = 1;

    loading = true;
    loaded = false;
    showSlideshow = false;
    scrollIndex = 0;

    listNearby = [];
    seasons: string[] = ['Current Location', 'Map'];

    str: string;
    mapVisible = false;
    currentLocation: any;
    destinationLocation: any;
    drawerMode = 'over';
    drawerLeftOpened = false;
    starColor: StarRatingColor = StarRatingColor.accent;
    swiperConfig: NgxSwiperConfig = {
        navigationPlacement: 'inside',
        pagination: true,
        paginationPlacement: 'outside'
    };
    location: any;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private eventEmitterService: EventEmitterService,
        private _userService: UserService,
        private apiService: ApiService,
        private _router: Router,
        private _formBuilder: FormBuilder,
        private bottomSheet: MatBottomSheet,
        private dialog: MatDialog,
        private router: Router,
        private route: ActivatedRoute
        //private pullToRefreshService: PullToRefreshService,
        //private fuseSplashScreenService: FuseSplashScreenService
    ) {
        // this.route.queryParams
        // .subscribe(params => {
        //     console.log(params);
        //     this.router.navigate(['promotion' + '/' + params.pid]);
        // });

        this.loading = true; //this.fuseSplashScreenService.show();
        this.eventEmitterService.invokeChangeLocationFunction.subscribe(location => {
            this.location = location;
        });

        localStorage.setItem('filterRestaurants', localStorage.getItem('filterRestaurants') == '1' ? '1' : '0');
        localStorage.setItem('filterPubs', localStorage.getItem('filterPubs') == '1' ? '1' : '0');
        localStorage.setItem('filterClubs', localStorage.getItem('filterClubs') == '1' ? '1' : '0');
        localStorage.setItem('filterSportVenues', localStorage.getItem('filterSportVenues') == '1' ? '1' : '0');
        localStorage.setItem('filterHotels', localStorage.getItem('filterHotels') == '1' ? '1' : '0');
        localStorage.setItem('filterGuestHouses', localStorage.getItem('filterGuestHouses') == '1' ? '1' : '0');
        localStorage.setItem('filterBedAndBreakfasts', localStorage.getItem('filterBedAndBreakfasts') == '1' ? '1' : '0');
        localStorage.setItem('filterResorts', localStorage.getItem('filterResorts') == '1' ? '1' : '0');
        localStorage.setItem('filterCaravanParks', localStorage.getItem('filterCaravanParks') == '1' ? '1' : '0');

        localStorage.setItem('ratingVibe', localStorage.getItem('ratingVibe') == undefined ? '1' : localStorage.getItem('ratingVibe'));
        localStorage.setItem('ratingQuality', localStorage.getItem('ratingQuality') == undefined ? '1' : localStorage.getItem('ratingQuality'));
        localStorage.setItem('ratingPrice', localStorage.getItem('ratingPrice') == undefined ? '1' : localStorage.getItem('ratingPrice'));
        localStorage.setItem('ratingChildFriendly', localStorage.getItem('ratingChildFriendly') == undefined ? '1' : localStorage.getItem('ratingChildFriendly'));



        this._userService.get().subscribe(user => {
            this.user = user;
            this.eventEmitterService.onChangeUser(user);
        }, error => {
            console.log('error', error);
            localStorage.removeItem('AT');
            localStorage.removeItem('RT');
            localStorage.removeItem('ID');

            const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/refresh';
            this._router.navigateByUrl(redirectURL);
        });

        this.form = this._formBuilder.group({
            distance: [10],
            current: [true],
            map: [false],
            restaurants: [localStorage.getItem('filterRestaurants') == '1' ? true : false],
            pubs: [localStorage.getItem('filterPubs') == '1' ? true : false],
            clubs: [localStorage.getItem('filterClubs') == '1' ? true : false],
            sportVenues: [localStorage.getItem('filterSportVenues') == '1' ? true : false],
            hotels: [localStorage.getItem('filterHotels') == '1' ? true : false],
            guestHouses: [localStorage.getItem('filterGuestHouses') == '1' ? true : false],
            bedAndBreakfasts: [localStorage.getItem('filterBedAndBreakfasts') == '1' ? true : false],
            resorts: [localStorage.getItem('filterResorts') == '1' ? true : false],
            caravanParks: [localStorage.getItem('filterCaravanParks') == '1' ? true : false],
            origin: ['Current Location']
        });
        this.ratingVibe = Number(localStorage.getItem('ratingVibe'));
        this.ratingQuality = Number(localStorage.getItem('ratingQuality'));
        this.ratingPrice = Number(localStorage.getItem('ratingPrice'));
        this.ratingChildFriendly = Number(localStorage.getItem('ratingChildFriendly'));

        // App.addListener('appStateChange', ({ isActive }) => {
        //     if (isActive) {
        //         this.loading = true; //this.fuseSplashScreenService.show();
        //         this.imageConfig = false;
        //         this.removeReviewImages();
        //         this.getEstablishments().then(getEstablishmentsResult => {
        //             this.userIds = getEstablishmentsResult;
        //             this.initUserList().then(updateUserListResult => {
        //                 this.imageConfig = true;
        //                 this.loading = false; //this.fuseSplashScreenService.hide();
        //                 setTimeout(() => {
        //                     window.scroll({ top: 0, left: 0, behavior: 'auto' });
        //                 }, 200);
        //             });
        //         });
        //     }
        // });
        // this.init().then(res => {
        //     this.imageConfig = true;
        //     this.loading = false;
        //     this.loaded = true;
        // });
    }
    ngOnInit(): void {
        this.loading = true; //this.fuseSplashScreenService.show();
        this.imageConfig = false;
        this.removeReviewImages();
        this.getEstablishments().then(getEstablishmentsResult => {
            this.userIds = getEstablishmentsResult;
            this.initUserList().then(updateUserListResult => {
                this.loading = false; //this.fuseSplashScreenService.hide();
                this.loaded = true;
                setTimeout(() => {
                    this.imageConfig = true;
                    window.scroll({ top: 0, left: 0, behavior: 'auto' });
                }, 400);
            });
        });
        
        // this.pullToRefreshService.refresh$().subscribe(() => {
        //     this.loading = true; //this.fuseSplashScreenService.show();
        //     this.imageConfig = false;
        //     this.removeReviewImages();
        //     this.getEstablishments().then(getEstablishmentsResult => {
        //         this.userIds = getEstablishmentsResult;
        //         this.initUserList().then(updateUserListResult => {
        //             this.loading = false; //this.fuseSplashScreenService.hide();
        //             setTimeout(() => {
        //                 this.imageConfig = true;
        //                 window.scroll({ top: 0, left: 0, behavior: 'auto' });
        //             }, 400);
        //         });
        //     });
        // })
    }

    init(): Promise<boolean> {
        var promise = new Promise<boolean>((resolve) => {
            this.initUserList().then(updateUserListResult => {
                resolve(true);
                // if (this.list.length > 4) {
                //     resolve(true);
                // } else {
                //     if (this.form.controls['distance'].value < 90) { this.form.controls['distance'].setValue(this.form.controls['distance'].value + 10); }
                //     this.updateUserList().then(updateUserListResult1 => {
                //         if (this.list.length > 4) {
                //             resolve(true);
                //         } else {
                //             if (this.form.controls['distance'].value < 90) { this.form.controls['distance'].setValue(this.form.controls['distance'].value + 10); }
                //             this.updateUserList().then(updateUserListResult1 => {
                //                 if (this.list.length > 4) {
                //                     resolve(true);
                //                 } else {
                //                     if (this.form.controls['distance'].value < 90) { this.form.controls['distance'].setValue(this.form.controls['distance'].value + 10); }
                //                     this.updateUserList().then(updateUserListResult => {
                //                         resolve(true);
                //                     });
                //                 }
                //             });
                //         }
                //     });
                // }
            });
        });
        return promise;
    }

    initUserList(): Promise<boolean> {
        this.count = 0;
        this.showSlideshow = false;
        var promise = new Promise<boolean>(async (resolve) => {
            try {
                this.listNearby = [];
                this.scrollIndex = 0;
                this.imageConfig = false;
                this.removeReviewImages();
                if (Capacitor.getPlatform() !== 'web') {
                    const geolocationEnabled = await Geolocation.checkPermissions();

                    if (geolocationEnabled.location !== 'granted') {
                        const granted = await Geolocation.requestPermissions();

                        if (granted.location !== 'granted') {
                            resolve(false);
                        }
                    }
                }

                Geolocation.getCurrentPosition(options).then(res => {
                    this.lat = res.coords.latitude;
                    this.lon = res.coords.longitude;
                    this.latMap = this.latMap ? this.latMap : res.coords.latitude;
                    this.lonMap = this.lonMap ? this.lonMap : res.coords.longitude;
                    console.log('distance', this.form.controls['distance']);
                    this.apiService.getUsersList(this.form.controls['distance'].value, this.userIds, this.ratingVibe, this.ratingQuality, this.ratingPrice, this.ratingChildFriendly, this.form.controls['current'].value ? this.lat : this.latMap, this.form.controls['current'].value ? this.lon : this.lonMap, this.scrollIndex, this.orderBy).subscribe(userList => {
                        this.list = this.addImages(userList);
                        this.count = userList.length > 0 ? userList[0].count : 0;
                        setTimeout(() => {
                            this.showSlideshow = true;
                            this.list = this.addImages(userList);
                            resolve(true);
                        }, 200);
                    });
                    this.apiService.getUsersFilter(100, res.coords.latitude, res.coords.longitude).subscribe(result => {
                        this.listNearby = result;
                    });
                });
            } catch (exception) {
                Toast.show({ text: JSON.stringify(exception) });
                resolve(false);
            }
        });
        return promise;
    }

    updateUserList(): Promise<boolean> {
        this.loading = true;
        var promise = new Promise<boolean>((resolve) => {
            try {
                console.log('distance', this.form.controls['distance']);
                this.apiService.getUsersList(this.form.controls['distance'].value, this.userIds, this.ratingVibe, this.ratingQuality, this.ratingPrice, this.ratingChildFriendly, this.form.controls['current'].value ? this.lat : this.latMap, this.form.controls['current'].value ? this.lon : this.lonMap, this.scrollIndex, this.orderBy).subscribe(userList => {
                    this.list = this.list.concat(this.addImages(userList));
                    this.count = userList.length > 0 ? userList[0].count : 0;
                    // setTimeout(() => {
                    //     this.list = this.addImages(this.list);
                    // }, 200);
                    resolve(true);
                });
            } catch (exception) {
                resolve(false);
            }
        });
        return promise;
    }

    selectOrigin(str, event) {
        switch (str) {
            case 'current':
                this.form.controls['map'].setValue(!event.checked);
                break;
            case 'map':
                this.form.controls['current'].setValue(!event.checked);
                break;
            default:
                break;
        }

        if (this.form.controls['map'].value) {
            const dialogConfig = new MatDialogConfig();

            dialogConfig.data = { lat: this.latMap, lon: this.lonMap };

            dialogConfig.autoFocus = true;
            dialogConfig.disableClose = true;
            dialogConfig.hasBackdrop = true;
            dialogConfig.ariaLabel = 'fffff';
            dialogConfig.width = "100vw";
            dialogConfig.maxWidth = "800px";
            dialogConfig.panelClass = 'full-screen-modal';

            const dialogRef = this.dialog.open(DialogMapComponent,
                dialogConfig);

            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    this.latMap = result.location.lat;
                    this.lonMap = result.location.lon;
                } else {
                    this.form.controls['map'].setValue(false);
                    this.form.controls['current'].setValue(true);
                }
            });
        }
    }

    ngAfterViewInit() {
        this.eventEmitterService.invokeButtonClickFunction.subscribe(message => {
            //setTimeout(() => {
            this.loading = true; //this.fuseSplashScreenService.show();
            this.imageConfig = false;
            this.removeReviewImages();
            this.orderBy = message;
            // this.getEstablishments().then(getEstablishmentsResult => {
            //     this.userIds = getEstablishmentsResult;
            this.initUserList().then(updateUserListResult => {
                this.loading = false; //this.fuseSplashScreenService.hide();
                this.loaded = true;
                setTimeout(() => {
                    this.imageConfig = true;
                    window.scroll({ top: 0, left: 0, behavior: 'auto' });
                }, 400);
                this.bottomSheet.dismiss();
            });
            //});

            // switch (message) {
            //     case 'distance':
            //         setTimeout(() => {
            //             this.loading = true; //this.fuseSplashScreenService.show();
            //             this.imageConfig = false;
            //             this.removeReviewImages();
            //             this.orderBy = message;
            //             this.getEstablishments().then(getEstablishmentsResult => {
            //                 this.userIds = getEstablishmentsResult;
            //                 this.initUserList().then(updateUserListResult => {
            //                     this.loading = false; //this.fuseSplashScreenService.hide();
            //                     this.loaded = true;
            //                     setTimeout(() => {
            //                         this.imageConfig = true;
            //                         window.scroll({ top: 0, left: 0, behavior: 'auto' });
            //                     }, 400);
            //                 });
            //             });

            //             this.loading = true; //this.fuseSplashScreenService.show();
            //             this.imageConfig = false;
            //             this.removeReviewImages();
            //             this.orderBy = message;
            //             this.initUserList().then(updateUserListResult => {
            //                 this.imageConfig = true;
            //                 this.loading = false; //this.fuseSplashScreenService.hide();
            //                 setTimeout(() => {
            //                     window.scroll({ top: 0, left: 0, behavior: 'auto' });
            //                 }, 200);
            //             });
            //             this.bottomSheet.dismiss();
            //         }, 100);
            //         break;
            //     case 'reviewCount':
            //         this.loading = true; //this.fuseSplashScreenService.show();
            //         this.imageConfig = false;
            //         this.removeReviewImages();
            //         this.orderBy = message;
            //         this.initUserList().then(updateUserListResult => {
            //             this.imageConfig = true;
            //             this.loading = false; //this.fuseSplashScreenService.hide();
            //             setTimeout(() => {
            //                 window.scroll({ top: 0, left: 0, behavior: 'auto' });
            //             }, 200);
            //         });
            //         this.bottomSheet.dismiss();
            //         break;
            //     case 'review':
            //         this.loading = true; //this.fuseSplashScreenService.show();
            //         this.imageConfig = false;
            //         this.removeReviewImages();
            //         this.orderBy = message;
            //         this.initUserList().then(updateUserListResult => {
            //             this.imageConfig = true;
            //             this.loading = false; //this.fuseSplashScreenService.hide();
            //             setTimeout(() => {
            //                 window.scroll({ top: 0, left: 0, behavior: 'auto' });
            //             }, 200);
            //         });
            //         this.bottomSheet.dismiss();
            //         break;
            //     case 'vibe':
            //         this.loading = true; //this.fuseSplashScreenService.show();
            //         this.imageConfig = false;
            //         this.removeReviewImages();
            //         this.orderBy = message;
            //         this.initUserList().then(updateUserListResult => {
            //             this.imageConfig = true;
            //             this.loading = false; //this.fuseSplashScreenService.hide();
            //             setTimeout(() => {
            //                 window.scroll({ top: 0, left: 0, behavior: 'auto' });
            //             }, 200);
            //         });
            //         this.bottomSheet.dismiss();
            //         break;
            //     case 'quality':
            //         this.loading = true; //this.fuseSplashScreenService.show();
            //         this.imageConfig = false;
            //         this.removeReviewImages();
            //         this.orderBy = message;
            //         this.initUserList().then(updateUserListResult => {
            //             this.imageConfig = true;
            //             this.loading = false; //this.fuseSplashScreenService.hide();
            //             setTimeout(() => {
            //                 window.scroll({ top: 0, left: 0, behavior: 'auto' });
            //             }, 200);
            //         });
            //         this.bottomSheet.dismiss();
            //         break;
            //     case 'price':
            //         this.loading = true; //this.fuseSplashScreenService.show();
            //         this.imageConfig = false;
            //         this.removeReviewImages();
            //         this.orderBy = message;
            //         this.initUserList().then(updateUserListResult => {
            //             this.imageConfig = true;
            //             this.loading = false; //this.fuseSplashScreenService.hide();
            //             setTimeout(() => {
            //                 window.scroll({ top: 0, left: 0, behavior: 'auto' });
            //             }, 200);
            //         });
            //         this.bottomSheet.dismiss();
            //         break;
            //     case 'childFriendly':
            //         this.loading = true; //this.fuseSplashScreenService.show();
            //         this.imageConfig = false;
            //         this.removeReviewImages();
            //         this.orderBy = message;
            //         this.initUserList().then(updateUserListResult => {
            //             this.imageConfig = true;
            //             this.loading = false; //this.fuseSplashScreenService.hide();
            //             setTimeout(() => {
            //                 window.scroll({ top: 0, left: 0, behavior: 'auto' });
            //             }, 200);
            //         });
            //         this.bottomSheet.dismiss();
            //         break;
            //     default:
            //         break;
            // }
        });
    }

    menuClicked(str) {
        switch (str) {
            case 'leftSidebar':
                this.drawerLeftOpened = !this.drawerLeftOpened;
                break;
            case 'bottomSheet':
                this.bottomSheet.open(SortComponent);
                break;
            default:
                break;
        }
    }

    openedChangedLeft(event) {
        this.drawerLeftOpened = event;
    }

    imageClick(item, index) {
        this.viewGallery(item, index);
    }

    viewGallery(item, index) {
        if (item.images[index].indexOf('Users') >= 0) {
            const dialogConfig = new MatDialogConfig();

            dialogConfig.data = {
                type: 'user',
                image: item.images[index] + '?t=' + this.timestamp,
                sameUser: false,
                reviewDate: item.reviewLast,
                reviewVibe: item.reviewVibe,
                reviewQuality: item.reviewQuality,
                reviewPrice: item.reviewPrice,
                reviewChildFriendly: item.reviewChildFriendly
            };

            dialogConfig.autoFocus = true;
            dialogConfig.disableClose = true;
            dialogConfig.hasBackdrop = true;
            dialogConfig.ariaLabel = 'fffff';
            dialogConfig.width = "100vw";
            dialogConfig.maxWidth = "600px";
            dialogConfig.panelClass = 'full-screen-modal';

            const dialogRef = this.dialog.open(DialogGalleryComponent,
                dialogConfig);

            dialogRef.afterClosed().subscribe(result => { });
        } else {
            this.loading = true; //this.fuseSplashScreenService.show();

            this.loading = false; //this.fuseSplashScreenService.hide();

            const dialogConfig = new MatDialogConfig();

            dialogConfig.data = {
                type: 'review',
                sameUser: upperCase(item.id) == upperCase(this.user ? this.user.id.toString() : 'NOTLOGGED'),
                image: item.images[index],
                reviewDate: new Date(item.images[index].substring(item.images[index].indexOf('_') + 1).split('_')[0] / 1),
                reviewVibe: item.images[index].substring(item.images[index].indexOf('_') + 1).split('_')[1] / 1,
                reviewQuality: item.images[index].substring(item.images[index].indexOf('_') + 1).split('_')[2] / 1,
                reviewPrice: item.images[index].substring(item.images[index].indexOf('_') + 1).split('_')[3] / 1,
                reviewChildFriendly: item.images[index].substring(item.images[index].indexOf('_') + 1).split('_')[4].split('.')[0] / 1
            };

            dialogConfig.autoFocus = true;
            dialogConfig.disableClose = true;
            dialogConfig.hasBackdrop = true;
            dialogConfig.ariaLabel = 'fffff';
            dialogConfig.width = "100vw";
            dialogConfig.maxWidth = "600px";
            dialogConfig.panelClass = 'full-screen-modal';

            const dialogRef = this.dialog.open(DialogGalleryComponent,
                dialogConfig);

            dialogRef.afterClosed().subscribe(result => {
                if (result !== null) {
                    item.images.splice(index, 1);
                }
            });
        }
    }

    viewReviews(event, item) {
        if (item.reviewCount == 0) {
            event.preventDefault();
        } else {
            const dialogConfig = new MatDialogConfig();

            dialogConfig.data = { item: item, list: this.sortByDtateString(item.images.filter(x => x.indexOf('Users') == -1)) };

            dialogConfig.autoFocus = true;
            dialogConfig.disableClose = true;
            dialogConfig.hasBackdrop = true;
            dialogConfig.ariaLabel = 'fffff';
            dialogConfig.width = "100vw";
            dialogConfig.maxWidth = "800px";
            dialogConfig.panelClass = 'full-screen-modal';

            const dialogRef = this.dialog.open(DialogHistoryComponent,
                dialogConfig);

            dialogRef.afterClosed().subscribe(result => { });
        }
    }

    async viewLocation(item) {
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
            let url = 'https://www.google.com/maps/dir/' + res.coords.latitude + ',' + res.coords.longitude + '/' + item.lat + ',' + item.lon + '/data=!3m1!4b1!4m2!4m1!3e0';
            Browser.open({ url });
        });
    }

    getReview() {
        Device.getId().then(device => {
            this.apiService.countUserReviews(this.listNearby[0].id, device.uuid).subscribe(res => {
                if (res.value == 0) {
                    const dialogConfig = new MatDialogConfig();
                    dialogConfig.data = { userItems: this.listNearby };

                    dialogConfig.autoFocus = true;
                    dialogConfig.disableClose = true;
                    dialogConfig.hasBackdrop = true;
                    dialogConfig.ariaLabel = 'fffff';
                    dialogConfig.width = "100vw";
                    dialogConfig.maxWidth = "800px";
                    dialogConfig.panelClass = 'full-screen-modal';

                    const dialogRef = this.dialog.open(DialogReviewComponent,
                        dialogConfig);


                    dialogRef.afterClosed().subscribe(result => {
                        if (result) {
                            this.imageConfig = false;
                            this.removeReviewImages();
                            this.loading = true; //this.fuseSplashScreenService.show();
                            let todayNumber: number = Date.now();
                            result.urlImage = result.deviceId + '_' + todayNumber + '_' + result.reviewVibe + '_' + result.reviewQuality + '_' + result.reviewPrice + '_' + result.reviewChildFriendly + '.' + result.fileToUpload.name.split('.').pop();
                            let fileToUpload = <File>result.fileToUpload;
                            const formData = new FormData();
                            formData.append('file', fileToUpload, result.urlImage);

                            this.apiService.upload('reviews', formData, result.urlImage)
                                .subscribe({
                                    next: (event) => {
                                        if (event.type === HttpEventType.UploadProgress)
                                            console.log(Math.round(100 * event.loaded / event.total));
                                        else if (event.type === HttpEventType.Response) {
                                            this.apiService.saveItem('reviews', result).subscribe({
                                                next: response => {
                                                    this.loading = true; //this.fuseSplashScreenService.show();
                                                    this.imageConfig = false;
                                                    this.removeReviewImages();
                                                    this.initUserList().then(updateUserListResult => {
                                                        this.loading = false; //this.fuseSplashScreenService.hide();
                                                        this.loaded = true;
                                                        setTimeout(() => {
                                                            this.imageConfig = true;
                                                            window.scroll({ top: 0, left: 0, behavior: 'auto' });
                                                        }, 400);
                                                    });
                                                },
                                                error: err => {
                                                    console.log(JSON.stringify(err.error));
                                                    Toast.show({ text: JSON.stringify(err.error), duration: 'long', position: 'center' });
                                                    this.imageConfig = true;
                                                    this.loading = false; //this.fuseSplashScreenService.hide();
                                                }
                                            });
                                        }
                                    },
                                    error: (err: HttpErrorResponse) => {
                                        console.log(JSON.stringify(err));
                                        Toast.show({ text: JSON.stringify(err) });
                                        this.loading = false; //this.fuseSplashScreenService.hide();
                                    }
                                });
                        }
                    });
                } else {
                    const dialogConfig = new MatDialogConfig();

                    dialogConfig.data = { title: 'Not Allowed :(', body: '<p>Users are only allowed to submit <b>one</b> review per venue per day</p><p>Ask a friend to also submit a review ;)</p>' };

                    dialogConfig.autoFocus = true;
                    dialogConfig.disableClose = true;
                    dialogConfig.hasBackdrop = true;
                    dialogConfig.ariaLabel = 'fffff';
                    dialogConfig.width = "100vw";
                    dialogConfig.maxWidth = "800px";
                    dialogConfig.panelClass = 'full-screen-modal';

                    const dialogRef = this.dialog.open(DialogNotificationComponent,
                        dialogConfig);
                }
            })
        });
    }

    formatDistance() {
        //console.log(this.form.controls['distance']);
        return this.form.controls['distance'] ? this.form.controls['distance'].value + ' kms' : '0 kms';
    }

    submitFilter(i) {
        localStorage.setItem('filterRestaurants', this.form.value.restaurants ? '1' : '0');
        localStorage.setItem('filterPubs', this.form.value.pubs ? '1' : '0');
        localStorage.setItem('filterClubs', this.form.value.clubs ? '1' : '0');
        localStorage.setItem('filterSportVenues', this.form.value.clubs ? '1' : '0');
        localStorage.setItem('filterHotels', this.form.value.hotels ? '1' : '0');
        localStorage.setItem('filterGuestHouses', this.form.value.guestHouses ? '1' : '0');
        localStorage.setItem('filterBedAndBreakfasts', this.form.value.bedAndBreakfasts ? '1' : '0');
        localStorage.setItem('filterResorts', this.form.value.resorts ? '1' : '0');
        localStorage.setItem('filterCaravanParks', this.form.value.caravanParks ? '1' : '0');

        localStorage.setItem('ratingVibe', this.ratingVibe.toString());
        localStorage.setItem('ratingQuality', this.ratingQuality.toString());
        localStorage.setItem('ratingPrice', this.ratingPrice.toString());
        localStorage.setItem('ratingChildFriendly', this.ratingChildFriendly.toString());

        this.loading = true; //this.fuseSplashScreenService.show();
        this.imageConfig = false;
        this.removeReviewImages();
        if (i == 1) {
            this.drawerLeftOpened = !this.drawerLeftOpened;
        }
        this.getEstablishments().then(getEstablishmentsResult => {
            this.userIds = getEstablishmentsResult;
            this.initUserList().then(updateUserListResult => {
                this.loading = false; //this.fuseSplashScreenService.hide();
                setTimeout(() => {
                    this.imageConfig = true;
                    window.scroll({ top: 0, left: 0, behavior: 'auto' });
                }, 400);
            });
        });
    }

    getEstablishments(): Promise<string> {
        var promise = new Promise<string>((resolve) => {
            try {
                let result = '';
                if (this.form.value.restaurants) {
                    result += '311D251F-E11B-4232-B692-082F35D0493C,';
                }
                if (this.form.value.clubs) {
                    result += '3A1D589C-26B3-465F-BE71-DBCCDEAA975D,';
                }
                if (this.form.value.pubs) {
                    result += '74920B93-ABF6-4754-8CE9-1D447307A979,';
                }
                if (this.form.value.sportVenues) {
                    result += 'e557ee36-d985-4232-bb0f-0b29d7478de9,';
                }
                if (this.form.value.hotels) {
                    result += '5AB43E25-AF81-49E3-8E06-211523AC6E59,';
                }
                if (this.form.value.guestHouses) {
                    result += '1e7852ff-2e28-46a3-b3af-3f8b2dbcec3d,';
                }
                if (this.form.value.bedAndBreakfasts) {
                    result += '03D07537-C189-44A2-8FA5-5C90C74DCD84,';
                }
                if (this.form.value.resorts) {
                    result += 'BDDE1113-C082-440E-BE4F-D3CD15FD5A65,';
                }
                if (this.form.value.caravanParks) {
                    result += '7d6479d8-cc76-4b99-89f6-02dddf657c2e,';
                }
                setTimeout(() => {
                    if (result == '') {
                        resolve('none');
                    } else {
                        resolve(result.substring(0, result.length - 1));
                    }
                }, 100);
            } catch (exception) {
                resolve('none');
            }
        });
        return promise;
    }

    ratingUpdated(element, val) {
        console.log(element, val);
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

    addImages(list: any[]) {
        return list.map(item => <any>{
            address: item.address,
            description: item.description,
            distance: item.distance,
            email: item.email,
            id: item.id,
            images: item.reviewImages ? this.sortByDtateString(item.reviewImages.split(',')).map(image => environment.api + '/Images/Reviews/' + image.trim()).concat([environment.api + '/Images/Users/' + item.id + item.urlImage.trim() + '?t=' + this.timestamp]) : [environment.api + '/Images/Users/' + item.id + item.urlImage.trim() + '?t=' + this.timestamp],
            lat: item.lat,
            lon: item.lon,
            name: item.name,
            parentId: item.parentId,
            phone: item.phone,
            review: item.review,
            reviewChildFriendly: item.reviewChildFriendly,
            reviewCount: item.reviewCount,
            reviewImages: item.reviewImages,
            reviewLast: item.reviewLast,
            reviewPrice: item.reviewPrice,
            reviewQuality: item.reviewQuality,
            reviewVibe: item.reviewVibe,
            urlImage: item.urlImage,
            userTypeId: item.userTypeId,
            web: item.web
        });
    }

    removeReviewImages() {
        // this.list.forEach(element => {
        //     element.images = element.images.filter(prop => prop.indexOf('Images/Users') >= 0);
        //     console.log(element.images);
        // });
    }

    sortByDtate(list) {
        return list.sort((a, b) => new Date(b.reviewDate).getTime() - new Date(a.reviewDate).getTime());
    }

    sortByDtateString(list) {
        return list.sort((n2, n1) => Number(n1.substring(n1.indexOf('_') + 1).split('_')[0]) - Number(n2.substring(n2.indexOf('_') + 1).split('_')[0]));
    }

    onScrollDown(ev: any) {
        if (!this.loading && this.scrollIndex + 5 < this.count) {
            this.loading = true;
            this.scrollIndex += 5;
            this.updateUserList().then(updateUserListResult => {
                this.imageConfig = true;
                this.loading = false;
            });
        }
    }

    get currentYear(): number {
        return new Date().getFullYear();
    }

    goHome(): void {
        this._router.navigate(['home']);
    }

    promotion(): void {
        this._router.navigate(['promotion/all']);
    }

    faq(): void {
        this._router.navigate(['faq']);
    }

    share() {
        ActionSheet.showActions({
            title: 'Share Vibe Viewer',
            message: 'Select an option to perform',
            options: [
                {
                    title: 'Facebook',
                },
                {
                    title: 'Instagram',
                },
                {
                    title: 'Remove',
                    style: ActionSheetButtonStyle.Destructive,
                },
            ],
        }).then(result => {
            console.log(result);
        })
    }
}
