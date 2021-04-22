import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
// import { AuthGuard } from './_helpers/auth.guard';

// const routes: Routes = [];

/* */

const routes: Routes = [
  // { path: '', component: AppComponent, canActivate: [AuthGuard] },
  // { path: 'login', component: LoginComponent },

  // otherwise redirect to home
  // { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }

// export const appRoutingModule = RouterModule.forRoot(routes);

