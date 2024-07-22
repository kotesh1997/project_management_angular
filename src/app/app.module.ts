import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExtraOptions, PreloadAllModules, RouterModule } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { FuseModule } from '@fuse';
import { FuseConfigModule } from '@fuse/services/config';
import { CoreModule } from 'app/core/core.module';
import { appConfig } from 'app/core/config/app.config';
import { LayoutModule } from 'app/layout/layout.module';
import { AppComponent } from 'app/app.component';
import { appRoutes } from 'app/app.routing';
import { UtilitiesService } from './Services/utilities.service';
import { ToastService } from './Services/toastservice';
import { LoaderComponent } from './loader/loader.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';


const routerConfig: ExtraOptions = {
    preloadingStrategy: PreloadAllModules,
    scrollPositionRestoration: 'enabled',
    //  useHash: true
};

@NgModule({
    declarations: [AppComponent, LoaderComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule, PdfViewerModule,
        RouterModule.forRoot(appRoutes, routerConfig),

        FuseModule,
        FuseConfigModule.forRoot(appConfig),

        CoreModule,

        LayoutModule,
        MatSlideToggleModule,

        MarkdownModule.forRoot({}),
    ],
    providers: [UtilitiesService, ToastService],
    bootstrap: [AppComponent],
})
export class AppModule {}
