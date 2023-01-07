import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FuseDrawerModule } from '@fuse/components/drawer';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { FuseCardModule } from '@fuse/components/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSliderModule } from '@angular/material/slider';
import { NgxImageSwiperModule } from 'ngx-image-swiper';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import { FuseAlertModule } from '@fuse/components/alert';
import { NgxPayPalModule } from 'ngx-paypal';
import { StarRatingModule } from 'angular-star-rating';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import {
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    NgxMatTimepickerModule
} from '@angular-material-components/datetime-picker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { TranslocoModule } from '@ngneat/transloco';
import { QRCodeModule } from 'angularx-qrcode';
import { FuseScrollbarModule } from '@fuse/directives/scrollbar';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatCardModule,
        MatSnackBarModule,
        FuseDrawerModule,
        MatListModule,
        MatBottomSheetModule,
        MatMenuModule,
        MatListModule,
        MatIconModule,
        FuseCardModule,
        MatFormFieldModule,
        MatCheckboxModule,
        MatSliderModule,
        NgxImageSwiperModule,
        MatInputModule,
        MatProgressSpinnerModule,
        FuseAlertModule,
        MatSelectModule,
        MatSidenavModule,
        MatExpansionModule,
        MatPaginatorModule,
        FuseScrollbarModule,
        MatRadioModule,
        MatSlideToggleModule,
        FuseAlertModule,
        MatTableModule,
        MatDatepickerModule,
        MatMomentDateModule,
        NgxMatDatetimePickerModule,
        NgxMatTimepickerModule,
        NgxMatNativeDateModule,
        TranslocoModule,
        QRCodeModule,
        NgxPayPalModule,
        StarRatingModule.forRoot()
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatCardModule,
        MatSnackBarModule,
        FuseDrawerModule,
        MatListModule,
        MatBottomSheetModule,
        MatMenuModule,
        MatListModule,
        MatIconModule,
        FuseCardModule,
        MatSidenavModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatCheckboxModule,
        MatSliderModule,
        NgxImageSwiperModule,
        MatInputModule,
        MatProgressSpinnerModule,
        FuseAlertModule,
        MatSelectModule,
        MatPaginatorModule,
        FuseScrollbarModule,
        MatRadioModule,
        MatSlideToggleModule,
        FuseAlertModule,
        MatTableModule,
        MatDatepickerModule,
        MatMomentDateModule,
        NgxMatDatetimePickerModule,
        NgxMatTimepickerModule,
        NgxMatNativeDateModule,
        TranslocoModule,
        QRCodeModule,
        NgxPayPalModule,
        StarRatingModule
    ],
    declarations: [
    ],
    entryComponents: [
    ]
})
export class SharedModule {
}
