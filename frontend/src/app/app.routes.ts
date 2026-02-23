import { Routes } from '@angular/router';
import { DeckListComponent } from './deck/deck-list/deck-list';
import { DeckDetailComponent } from './deck/deck-detail/deck-detail';

export const routes: Routes = [
  { path: '', component: DeckListComponent },
  { path: 'deck/:id', component: DeckDetailComponent }
];