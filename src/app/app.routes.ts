import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'chat',
    loadComponent: () =>
      import('./pages/chat-component/chat-component').then((com) => com.ChatComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login-component/login-component').then((com) => com.LoginComponent),
  },
  {
    path: '',
    loadComponent: () =>
      import('./pages/login-component/login-component').then((com) => com.LoginComponent),
  },
];