import { Component, OnInit } from '@angular/core';
import { ApiService, Deck } from '../../core/services/api';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-deck-list',
  standalone: true,
  imports: [FormsModule, NgFor],
  templateUrl: './deck-list.html'
})
export class DeckListComponent implements OnInit {
  decks: Deck[] = [];
  newDeckName = '';

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.loadDecks();
  }

  loadDecks() {
    this.api.getDecks().subscribe(d => this.decks = d);
  }

  createDeck() {
    if (!this.newDeckName.trim()) return;

    this.api.createDeck(this.newDeckName.trim()).subscribe(() => {
      this.newDeckName = '';
      this.loadDecks();
    });
  }

  openDeck(deck: Deck) {
    this.router.navigate(['/deck', deck.id]);
  }
}