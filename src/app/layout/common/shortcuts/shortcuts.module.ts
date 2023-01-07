import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { MatButtonModule as MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule as MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule as MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule as MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule as MatTooltipModule } from '@angular/material/tooltip';
import { ShortcutsComponent } from 'app/layout/common/shortcuts/shortcuts.component';

@NgModule({
    declarations: [
        ShortcutsComponent
    ],
    imports     : [
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
        OverlayModule,
        PortalModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSlideToggleModule,
        MatTooltipModule
    ],
    exports     : [
        ShortcutsComponent
    ]
})
export class ShortcutsModule
{
}
