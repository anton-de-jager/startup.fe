import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { LandingHomeComponent } from 'app/modules/landing/home/home.component';
import { landingHomeRoutes } from 'app/modules/landing/home/home.routing';
import { LanguagesModule } from 'app/layout/common/languages/languages.module';
import { UserModule } from 'app/layout/common/user/user.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
//import { PullToRefreshModule } from '@piumaz/pull-to-refresh';

@NgModule({
    declarations: [
        LandingHomeComponent
    ],
    imports     : [
        RouterModule.forChild(landingHomeRoutes),
        LanguagesModule,
        UserModule,
        InfiniteScrollModule,

        //PullToRefreshModule,
        
        SharedModule
    ]
})
export class LandingHomeModule
{
}
