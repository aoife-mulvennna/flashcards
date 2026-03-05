// deck-detail.ts
import { Component, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Card, Deck } from '../../core/services/api';

@Component({
  selector: 'app-deck-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <a class="back-link" routerLink="/">
      ← All decks
    </a>

    <div class="page-header">
      <div class="page-header-left">
        <h1>{{ deck()?.name ?? 'Deck' }}</h1>
        <p>{{ cards().length }} card{{ cards().length !== 1 ? 's' : '' }}</p>
      </div>
      <div class="page-actions">
        <a [routerLink]="['/deck', deckId(), 'study']" class="btn btn-amber">
          ▶ Study now
        </a>
      </div>
    </div>

    <!-- Add Card Panel -->
    <div class="add-card-panel">
      <h3>Add a card</h3>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Question (front)</label>
          <textarea
            class="form-textarea"
            [(ngModel)]="newFront"
            placeholder="e.g. Hello?"
            rows="2"
          ></textarea>
        </div>
        <div class="form-group">
          <label class="form-label">Answer (back)</label>
          <textarea
            class="form-textarea"
            [(ngModel)]="newBack"
            placeholder="e.g. Hola"
            rows="2"
          ></textarea>
        </div>
      </div>
      <button
        class="btn btn-primary"
        (click)="addCard()"
        [disabled]="!newFront.trim() || !newBack.trim()"
      >
        + Add card
      </button>
    </div>

    <!-- Card table -->
    @if (cards().length > 0) {
      <div class="card-table">
        <div class="card-table-header">
          <div>Question</div>
          <div>Answer</div>
          <div></div>
        </div>
        @for (card of cards(); track card.id) {
          <div class="card-row">
            @if (editingId() === card.id) {
              <!-- Inline edit mode -->
              <input class="form-input" [(ngModel)]="editFront" style="margin-right:8px" />
              <input class="form-input" [(ngModel)]="editBack" style="margin-right:8px" />
              <div class="card-row-actions">
                <button class="btn btn-primary btn-icon" (click)="saveEdit(card)" title="Save">✓</button>
                <button class="btn btn-ghost btn-icon" (click)="cancelEdit()" title="Cancel">✕</button>
              </div>
            } @else {
              <div class="card-row-front">{{ card.front }}</div>
              <div class="card-row-back">{{ card.back }}</div>
              <div class="card-row-actions">
                <button class="btn btn-ghost btn-icon" (click)="startEdit(card)" title="Edit">✎</button>
                <button class="btn btn-danger btn-icon" (click)="deleteCard(card.id)" title="Delete">✕</button>
              </div>
            }
          </div>
        }
      </div>
    } @else {
      <div class="empty-state">
        <div class="empty-icon">🃏</div>
        <h3>No cards yet</h3>
        <p>Add your first card above to get started.</p>
      </div>
    }
  `
})
export class DeckDetail implements OnInit {
  deck = signal<Deck | null>(null);
  cards = signal<Card[]>([]);
  deckId = signal('');

  newFront = '';
  newBack = '';
  editingId = signal<string | null>(null);
  editFront = '';
  editBack = '';

  constructor(private route: ActivatedRoute, private api: ApiService) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.deckId.set(id);
    this.api.getDecks().subscribe(decks => {
      this.deck.set(decks.find(d => d.id === id) ?? null);
    });
    this.api.getCards(id).subscribe(cards => this.cards.set(cards));
  }

  addCard() {
    const f = this.newFront.trim(), b = this.newBack.trim();
    if (!f || !b) return;
    this.api.createCard(this.deckId(), f, b).subscribe(card => {
      this.cards.update(cs => [...cs, card]);
      this.newFront = '';
      this.newBack = '';
    });
  }

  startEdit(card: Card) {
    this.editingId.set(card.id);
    this.editFront = card.front;
    this.editBack = card.back;
  }

  saveEdit(card: Card) {
    this.api.updateCard(card.id, this.editFront.trim(), this.editBack.trim()).subscribe(updated => {
      this.cards.update(cs => cs.map(c => c.id === updated.id ? updated : c));
      this.editingId.set(null);
    });
  }

  cancelEdit() { this.editingId.set(null); }

  deleteCard(id: string) {
    this.api.deleteCard(id).subscribe(() => {
      this.cards.update(cs => cs.filter(c => c.id !== id));
    });
  }
}