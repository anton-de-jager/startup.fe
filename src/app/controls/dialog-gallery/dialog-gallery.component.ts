import { Component, EventEmitter, OnInit, AfterViewInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from 'app/core/user/user.service';
import { ApiService } from 'app/services/api.service';
import { environment } from 'environments/environment';
import { upperCase } from 'lodash';

@Component({
  selector: 'app-gallery',
  templateUrl: './dialog-gallery.component.html',
  styleUrls: ['./dialog-gallery.component.scss']
})
export class DialogGalleryComponent implements OnInit {
  image: string;
  reviewVibe: any;
  reviewQuality: any;
  reviewPrice: any;
  reviewChildFriendly: any;
  reviewDate: any;
  type: string;
  sameUser = false;

  constructor(
    public dialogRef: MatDialogRef<DialogGalleryComponent>,
    private _userService: UserService,
    private apiService: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.image = data.image;
    this.reviewVibe = data.reviewVibe;
    this.reviewQuality = data.reviewQuality;
    this.reviewPrice = data.reviewPrice;
    this.reviewChildFriendly = data.reviewChildFriendly;
    this.reviewDate = data.reviewDate;
    this.type = data.type;
    this.sameUser = false;//data.sameUser;
  }

  ngOnInit(): void {
  }

  delete() {
    this.apiService.deleteReviewByUrlImage(this.image.replace(environment.api + '/Images/Reviews/', '')).subscribe(res => {
      this.dialogRef.close(1);
    })
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
