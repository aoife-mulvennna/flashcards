// deck-sidebar.ts
import { Component, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService, Deck } from '../../core/services/api';

@Component({
  selector: 'app-deck-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    @for (deck of decks(); track deck.id) {
      <a
        class="deck-item"
        [routerLink]="['/deck', deck.id]"
        routerLinkActive="active"
      >
        <span class="deck-item-dot"></span>
        <span class="flex-1">{{ deck.name }}</span>
      </a>
    }

    @if (decks().length === 0) {
      <div class="muted text-sm" style="padding: 8px 12px; opacity: 0.5;">
        No decks yet
      </div>
    }
  `
})
export class DeckSidebar implements OnInit {
  decks = signal<Deck[]>([]);

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getDecks().subscribe(decks => this.decks.set(decks));
  }
}