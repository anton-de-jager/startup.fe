import { Translation, TRANSLOCO_CONFIG, TRANSLOCO_LOADER, translocoConfig, TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { environment } from 'environments/environment';
import { TranslocoHttpLoader } from 'app/core/transloco/transloco.http-loader';

@NgModule({
    exports  : [
        TranslocoModule
    ],
    providers: [
        {
            // Provide the default Transloco configuration
            provide : TRANSLOCO_CONFIG,
            useValue: translocoConfig({
                availableLangs      : [
                    {
                        id   : 'en',
                        label: 'English'
                    },
                    {
                        id   : 'zh',
                        label: 'Chinese'
                    },
                    {
                        id   : 'es',
                        label: 'Spanish'
                    },
                    {
                        id   : 'hi',
                        label: 'Hindi'
                    },
                    {
                        id   : 'ru',
                        label: 'Russian'
                    },
                    {
                        id   : 'ar',
                        label: 'Arabic'
                    },
                    {
                        id   : 'pt',
                        label: 'Portuguese'
                    },
                    {
                        id   : 'ml',
                        label: 'Malay'
                    },
                    {
                        id   : 'fr',
                        label: 'French'
                    },
                    {
                        id   : 'de',
                        label: 'German'
                    },
                    {
                        id   : 'af',
                        label: 'Afrikaans'
                    },
                    {
                        id   : 'zu',
                        label: 'Zulu'
                    },
                    {
                        id   : 'xh',
                        label: 'Xhosa'
                    }
                ],
                defaultLang         : localStorage.getItem('language') ? localStorage.getItem('language') : 'en',
                fallbackLang        : 'en',
                reRenderOnLangChange: true,
                prodMode            : environment.production
            })
        },
        {
            // Provide the default Transloco loader
            provide : TRANSLOCO_LOADER,
            useClass: TranslocoHttpLoader
        },
        {
            // Preload the default language before the app starts to prevent empty/jumping content
            provide   : APP_INITIALIZER,
            deps      : [TranslocoService],
            useFactory: (translocoService: TranslocoService): any => (): Promise<Translation> => {
                const defaultLang = translocoService.getDefaultLang();
                translocoService.setActiveLang(defaultLang);
                return translocoService.load(defaultLang).toPromise();
            },
            multi     : true
        }
    ]
})
export class TranslocoCoreModule
{
}
