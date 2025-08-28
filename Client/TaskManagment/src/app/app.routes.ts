import { Routes } from '@angular/router';
import { Login } from './Pages/login/login';
import { Register } from './Pages/register/register';
import { Layout } from './layout/layout/layout';
import { Home } from './Pages/home/home';
import { Task } from './Pages/task/task';
import { Dashboard } from './Pages/dashboard/dashboard';
import { Projects } from './Pages/projects/projects';
import { ProjectAssign } from './Pages/project-assign/project-assign';
import { AuthGuard } from './Core/Guards/AuthGuard';
import { LoginGuard } from './Core/Guards/LoginGuard';
import { TeamManagement } from './Pages/team-management/team-management';

export const routes: Routes = [
  
 { path: '', component: Login , canActivate: [LoginGuard]  },
 { path: 'login', component: Login , canActivate: [LoginGuard] },
 { path: 'Register', component: Register },

 {
    path: 'Dashboard',
    component: Layout,
    canActivate: [AuthGuard],
   
    children: [
      { path: '', redirectTo: 'Home', pathMatch: 'full' },
      { path: 'Home', component: Home },
      { path: 'Task', component: Task },
      { path: 'Project', component: Projects },
      { path: 'AssignProject', component: ProjectAssign },
      { path: 'Head', component: Dashboard },
      { path: 'TeamManagement', component: TeamManagement },
      
    ]
  },

];
