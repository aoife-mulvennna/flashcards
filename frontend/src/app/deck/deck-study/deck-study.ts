// deck-study.ts
import { Component, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService, Card, Deck } from '../../core/services/api';

@Component({
  selector: 'app-deck-study',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <a class="back-link" [routerLink]="['/deck', deckId()]">
      ← Back to deck
    </a>

    <!-- Study complete state -->
    @if (isComplete()) {
      <div class="study-complete">
        <div class="study-complete-emoji">🎉</div>
        <h2>Round complete!</h2>
        <p>
          @if (unknown().length === 0) {
            You knew every card. Excellent work!
          } @else {
            You still have {{ unknown().length }} card{{ unknown().length !== 1 ? 's' : '' }} to review.
          }
        </p>
        <div class="study-complete-stats">
          <div class="stat-block">
            <div class="stat-number green">{{ known().length }}</div>
            <div class="stat-label">Known</div>
          </div>
          <div class="stat-block">
            <div class="stat-number red">{{ unknown().length }}</div>
            <div class="stat-label">To review</div>
          </div>
        </div>
        <div class="flex gap-2" style="flex-wrap:wrap; justify-content:center;">
          @if (unknown().length > 0) {
            <button class="btn btn-amber" (click)="retestUnknown()">
              Retry missed cards
            </button>
          }
          <button class="btn btn-ghost" (click)="restart()">Start over</button>
          <a class="btn btn-ghost" [routerLink]="['/deck', deckId()]">Back to deck</a>
        </div>
      </div>

    } @else if (currentCard()) {
      <div class="study-layout">
        <!-- Progress -->
        <div class="study-progress">
          <div class="study-progress-label">
            <span>Card {{ currentIndex() + 1 }} of {{ queue().length }}</span>
            <span>{{ progressPct() }}% through</span>
          </div>
          <div class="study-progress-bar-track">
            <div class="study-progress-bar-fill" [style.width]="progressPct() + '%'"></div>
          </div>
        </div>

        <!-- Flip card -->
        <div class="flip-card-wrapper">
          <div class="flip-card" [class.flipped]="flipped()" (click)="flip()">
            <div class="flip-card-face flip-card-front">
              <div class="flip-card-label">Question</div>
              <div class="flip-card-text">{{ currentCard()!.front }}</div>
              <div class="flip-card-hint">Click to reveal answer</div>
            </div>
            <div class="flip-card-face flip-card-back">
              <div class="flip-card-label">Answer</div>
              <div class="flip-card-text">{{ currentCard()!.back }}</div>
              <div class="flip-card-hint">How did you do?</div>
            </div>
          </div>
        </div>

        <!-- Know / Didn't know — only shown after flip -->
        @if (flipped()) {
          <div class="study-actions">
            <button class="btn btn-unknown" (click)="markUnknown()">
              😕 Didn't know
            </button>
            <button class="btn btn-know" (click)="markKnown()">
              ✓ Know that!
            </button>
          </div>
        } @else {
          <!-- Placeholder to keep layout stable -->
          <div style="height: 56px;"></div>
        }

        <!-- Secondary controls -->
        <div class="study-controls">
          <button class="btn btn-ghost" (click)="restart()">↺ Restart deck</button>
          <a class="btn btn-ghost" [routerLink]="['/deck', deckId()]">Edit cards</a>
        </div>
      </div>
    }
  `
})
export class DeckStudy implements OnInit {
  deckId = signal('');
  deck = signal<Deck | null>(null);
  allCards = signal<Card[]>([]);

  queue = signal<Card[]>([]);
  currentIndex = signal(0);
  flipped = signal(false);
  known = signal<Card[]>([]);
  unknown = signal<Card[]>([]);

  currentCard = computed(() => this.queue()[this.currentIndex()] ?? null);
  isComplete = computed(() => this.queue().length > 0 && this.currentIndex() >= this.queue().length);
  progressPct = computed(() =>
    this.queue().length === 0 ? 0 :
    Math.round((this.currentIndex() / this.queue().length) * 100)
  );

  constructor(private route: ActivatedRoute, private api: ApiService) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.deckId.set(id);
    this.api.getDecks().subscribe(decks => this.deck.set(decks.find(d => d.id === id) ?? null));
    this.api.getCards(id).subscribe(cards => {
      this.allCards.set(cards);
      this.startSession(cards);
    });
  }

  startSession(cards: Card[]) {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    this.queue.set(shuffled);
    this.currentIndex.set(0);
    this.flipped.set(false);
    this.known.set([]);
    this.unknown.set([]);
  }

  flip() { this.flipped.set(!this.flipped()); }

  markKnown() {
    this.known.update(k => [...k, this.currentCard()!]);
    this.advance();
  }

  markUnknown() {
    this.unknown.update(u => [...u, this.currentCard()!]);
    this.advance();
  }

  advance() {
    this.flipped.set(false);
    setTimeout(() => this.currentIndex.update(i => i + 1), 150);
  }

  restart() { this.startSession(this.allCards()); }

  retestUnknown() {
    const toRetry = this.unknown();
    this.startSession(toRetry);
  }
}