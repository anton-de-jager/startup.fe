import { OnInit, OnDestroy, Component, ViewEncapsulation } from '@angular/core';
import { EventEmitterService } from 'app/services/event-emitter.service';
import { SharedService } from 'app/shared/shared.service';

@Component({
    selector: 'sort',
    templateUrl: './sort.component.html',
    encapsulation: ViewEncapsulation.None
})
export class SortComponent implements OnInit, OnDestroy {

    /**
     * Constructor
     */
    constructor(
        private eventEmitterService: EventEmitterService
    ) {
    }

    sort(val:string, event: MouseEvent): void {
        this.eventEmitterService.onButtonClick(val);
        event.preventDefault();
    }

    ngOnInit() {
    }

    ngOnDestroy() {
    }
}