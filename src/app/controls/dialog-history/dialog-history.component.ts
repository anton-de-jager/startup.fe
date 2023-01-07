import { Component, EventEmitter, OnInit, AfterViewInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-history',
  templateUrl: './dialog-history.component.html',
  styleUrls: ['./dialog-history.component.scss']
})
export class DialogHistoryComponent implements OnInit {
  item: any;
  list: any[];
  apiUrl = environment.api;

  constructor(
    public dialogRef: MatDialogRef<DialogHistoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(data);
    this.item = data.item;
    this.list = data.list.map(item => <any>{
      urlImage: item,
      reviewDate: new Date(item.substring(item.indexOf('_') + 1).split('_')[0] / 1),
      reviewVibe: item.substring(item.indexOf('_') + 1).split('_')[1] / 1,
      reviewQuality: item.substring(item.indexOf('_') + 1).split('_')[2] / 1,
      reviewPrice: item.substring(item.indexOf('_') + 1).split('_')[3] / 1,
      reviewChildFriendly: item.substring(item.indexOf('_') + 1).split('_')[4].split('.')[0] / 1
    });
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  ngOnInit(): void {
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
