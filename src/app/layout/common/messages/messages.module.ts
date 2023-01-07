import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { MatButtonModule as MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule as MatTooltipModule } from '@angular/material/tooltip';
import { MessagesComponent } from 'app/layout/common/messages/messages.component';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
    declarations: [
        MessagesComponent
    ],
    imports     : [
        RouterModule,
        OverlayModule,
        PortalModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        SharedModule
    ],
    exports     : [
        MessagesComponent
    ]
})
export class MessagesModule
{
}
