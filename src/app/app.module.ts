import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MouseoverDirective } from './directive/mouseover.directive';
import { HttpClientModule } from '@angular/common/http';
import { NavComponent } from './components/shared/nav/nav.component';

@NgModule({
  declarations: [AppComponent, MouseoverDirective, NavComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [{ provide: Window, useValue: window }],
  bootstrap: [AppComponent],
})
export class AppModule {}
