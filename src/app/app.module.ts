import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MouseoverDirective } from './directive/mouseover.directive';

@NgModule({
  declarations: [AppComponent, MouseoverDirective],
  imports: [BrowserModule, AppRoutingModule],
  providers: [{ provide: Window, useValue: window }],
  bootstrap: [AppComponent],
})
export class AppModule {}
