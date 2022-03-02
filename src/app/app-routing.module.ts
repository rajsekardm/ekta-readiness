import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { ThankYouComponent } from './components/pages/thank-you/thank-you.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';

const routes: Routes = [
  {path:'', component:HomeComponent},
  {path:'submit', component:ThankYouComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
