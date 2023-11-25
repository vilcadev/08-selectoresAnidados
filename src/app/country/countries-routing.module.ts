import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SelectorPageComponent } from './pages/selector-page/selector-page.component';


const manageRoutes:Routes = [
  {
    path:'',
    children:[
      {path: 'selector', component:SelectorPageComponent},
      {path:'**',redirectTo:'selector'}
    ]

  }
]

@NgModule({
  imports: [
    RouterModule.forChild(manageRoutes),

  ],
  exports: [
    RouterModule
  ],


})
export class CountriesRoutingModule {}
