import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { UsersComponent } from './components/users/users.component';

const routes: Routes = [{
  path:'admin',
  loadChildren:() => import('./admin/admin.module').then(m=>m.AdminModule)
},
{
  path:'login',
  component: LoginComponent
},
{
  path:'register',
  component: RegisterComponent
},
{
  path: 'users',
  children: [
    {
      path: '',
      component: UsersComponent
    },
    {
      path: ':id',
      component: UserProfileComponent
    },
  ]
},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
