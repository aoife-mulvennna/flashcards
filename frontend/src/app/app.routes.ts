import { Routes } from '@angular/router';
import { DeckListComponent } from './deck/deck-list/deck-list';
import { DeckSidebar } from './deck/deck-sidebar/deck-sidebar';
import { DeckDetail } from './deck/deck-detail/deck-detail';
import { DeckStudy } from './deck/deck-study/deck-study';

export const routes: Routes = [
  { path: '', component: DeckSidebar, outlet: 'sidebar' },
  { path: '', component: DeckListComponent },
  { path: 'deck/:id', component: DeckDetail },
  { path: 'deck/:id/study', component: DeckStudy }
];