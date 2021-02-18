import { RouterModule, Routes } from '@angular/router';

import { JobsComponent } from './jobs/jobs.component';
import { NgModule } from '@angular/core';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  { path: 'jobs', component: JobsComponent },
  { path: '',   redirectTo: '/jobs', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
