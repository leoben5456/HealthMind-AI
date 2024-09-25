import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { AuthComponent } from './auth/auth.component';
import { authGuard } from './auth.guard';

const routes: Routes = [
  {path:'',component:MainComponent, canActivate: [authGuard]},
  {path:'chat/:uuid',component:MainComponent, canActivate: [authGuard]},
  {path:'auth',component:AuthComponent},
  {path:'share/chat/:uuid',component:MainComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
