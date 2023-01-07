import { Component, EventEmitter, OnInit, AfterViewInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Geolocation } from '@capacitor/geolocation';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogHistoryComponent } from 'app/controls/dialog-history/dialog-history.component';
import { Browser } from '@capacitor/browser';
import { environment } from 'environments/environment';
import { Capacitor } from '@capacitor/core';

const options: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 25000,
  maximumAge: 0
};

@Component({
  selector: 'app-promotion-view',
  templateUrl: './dialog-promotion-view.component.html',
  styleUrls: ['./dialog-promotion-view.component.scss']
})
export class DialogPromotionViewComponent implements OnInit {
  name = '';
  title = '';
  content = '';
  urlImage = '';
  api = environment.api;
  id = '';
  images: [];
  lat;
  lon;
  userId;

  constructor(
    public dialogRef: MatDialogRef<DialogPromotionViewComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.userId = data.userId;
    this.name = data.name;
    this.title = data.title;
    this.content = data.content;
    this.urlImage = data.urlImage;
    this.id = data.id;
    this.images = data.images;
    this.lat = data.lat;
    this.lon = data.lon;
  }

  ngOnInit(): void {
  }

  async viewLocation(lat, lon) {
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
      let url = 'https://www.google.com/maps/dir/' + res.coords.latitude + ',' + res.coords.longitude + '/' + lat + ',' + lon + '/data=!3m1!4b1!4m2!4m1!3e0';
      Browser.open({ url });
    });
  }

  viewReviews(event, item) {
    if (item.length == 0) {
      event.preventDefault();
    } else {
      const dialogConfig = new MatDialogConfig();

      //item.images = this.sortByDtateString(item.reviewImages.split(',')).map(image => environment.api + '/Images/Reviews/' + image.trim());

      dialogConfig.data = { item: this.images, list: this.images };

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

  sortByDtateString(list) {
    return list.sort((n2, n1) => Number(n1.substring(n1.indexOf('_') + 1).split('_')[0]) - Number(n2.substring(n2.indexOf('_') + 1).split('_')[0]));
  }

  submit(): void {
    this.dialogRef.close(null);
  }
}
