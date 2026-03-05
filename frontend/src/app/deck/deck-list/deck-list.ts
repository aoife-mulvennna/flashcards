// deck-list.ts
import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Deck } from '../../core/services/api';

@Component({
  selector: 'app-deck-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="page-header">
      <div class="page-header-left">
        <h1>Your Decks</h1>
        <p>Choose a deck to study or manage your cards.</p>
      </div>
    </div>

    <div class="deck-grid">
      @for (deck of decks(); track deck.id) {
        <a [routerLink]="['/deck', deck.id]" class="deck-card">
          <span class="deck-card-emoji">{{ getDeckEmoji(deck.name) }}</span>
          <div class="deck-card-name">{{ deck.name }}</div>
          <div class="deck-card-meta">Tap to view cards</div>
        </a>
      }

      <div class="deck-card deck-card-new" (click)="openModal()">
        <div class="deck-card-plus">+</div>
        <span>New Deck</span>
      </div>
    </div>

    @if (decks().length === 0 && !loading()) {
      <div class="empty-state" style="margin-top: 40px;">
        <div class="empty-icon">📭</div>
        <h3>No decks yet</h3>
        <p>Create your first deck to start studying.</p>
      </div>
    }

    <!-- Create Deck Modal -->
    @if (showModal()) {
      <div class="modal-overlay" (click)="closeModal()">
        <div class="modal" (click)="$event.stopPropagation()">
          <h2>Create a new deck</h2>
          <div class="form-group">
            <label class="form-label">Deck name</label>
            <input
              class="form-input"
              [(ngModel)]="newDeckName"
              placeholder="e.g. Spanish, Biology, History…"
              (keydown.enter)="createDeck()"
              autofocus
            />
          </div>
          <div class="modal-footer">
            <button class="btn btn-ghost" (click)="closeModal()">Cancel</button>
            <button class="btn btn-amber" (click)="createDeck()" [disabled]="!newDeckName().trim()">
              Create deck
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class DeckListComponent implements OnInit {
  decks = signal<Deck[]>([]);
  loading = signal(true);
  showModal = signal(false);
  newDeckName = signal('');

  private readonly emojiMap: Record<string, string> = {
    spanish: '🇪🇸', french: '🇫🇷', german: '🇩🇪', japanese: '🇯🇵',
    italian: '🇮🇹', portuguese: '🇵🇹', chinese: '🇨🇳', arabic: '🇸🇦',
    biology: '🧬', chemistry: '⚗️', physics: '⚡', math: '📐',
    history: '🏛️', geography: '🌍', science: '🔬', english: '📖',
    music: '🎵', art: '🎨', coding: '💻', programming: '💻',
  };

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getDecks().subscribe({
      next: (decks) => { this.decks.set(decks); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  getDeckEmoji(name: string): string {
    const key = name.toLowerCase().trim();
    for (const [word, emoji] of Object.entries(this.emojiMap)) {
      if (key.includes(word)) return emoji;
    }
    return '📋';
  }

  openModal() { this.showModal.set(true); this.newDeckName.set(''); }
  closeModal() { this.showModal.set(false); }

  createDeck() {
    const name = this.newDeckName().trim();
    if (!name) return;
    this.api.createDeck(name).subscribe(deck => {
      this.decks.update(d => [...d, deck]);
      this.closeModal();
    });
  }
}