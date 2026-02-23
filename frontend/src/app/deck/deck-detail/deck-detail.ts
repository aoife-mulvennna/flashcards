import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';

import { ApiService, Card } from '../../core/services/api';

@Component({
  selector: 'app-deck-detail',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf],
  templateUrl: './deck-detail.html'
})
export class DeckDetailComponent implements OnInit {
  deckId!: string;

  cards: Card[] = [];

  front = '';
  back = '';

  loading = true;
  error: string | null = null;

  constructor(private route: ActivatedRoute, private api: ApiService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'Missing deck id in route.';
      this.loading = false;
      return;
    }

    this.deckId = id;
    this.loadCards();
  }

  loadCards() {
    this.loading = true;
    this.api.getCards(this.deckId).subscribe({
      next: (cards) => {
        this.cards = cards;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load cards.';
        console.error(err);
        this.loading = false;
      }
    });
  }

  addCard() {
    if (!this.front.trim() || !this.back.trim()) return;

    this.api.createCard(this.deckId, this.front.trim(), this.back.trim()).subscribe({
      next: () => {
        this.front = '';
        this.back = '';
        this.loadCards();
      },
      error: (err) => {
        this.error = 'Failed to create card.';
        console.error(err);
      }
    });
  }
}