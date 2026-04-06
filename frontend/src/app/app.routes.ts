import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { DeckListComponent } from './deck/deck-list/deck-list';
import { DeckDetail } from './deck/deck-detail/deck-detail';
import { DeckStudy } from './deck/deck-study/deck-study';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: '', component: LoginComponent },

  { path: 'home', component: DeckListComponent, canActivate: [authGuard] },
  { path: 'deck/:id', component: DeckDetail, canActivate: [authGuard] },
  { path: 'deck/:id/study', component: DeckStudy, canActivate: [authGuard] },
];
