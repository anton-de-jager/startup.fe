import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { DashboardComponent } from 'app/modules/admin/dashboard/dashboard.component';
import { SharedModule } from 'app/shared/shared.module';

const dashboardRoutes: Route[] = [
    {
        path: '',
        component: DashboardComponent
    }
];

@NgModule({
    declarations: [
        DashboardComponent
    ],
    imports: [
        RouterModule.forChild(dashboardRoutes),
        SharedModule
    ]
})
export class DashboardModule {
}
