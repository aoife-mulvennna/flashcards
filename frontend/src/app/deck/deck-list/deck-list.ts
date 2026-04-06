import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Deck } from '../../core/services/api';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-deck-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './deck-list.html',
  styleUrl: './deck-list.scss',
})
export class DeckListComponent implements OnInit {
  decks = signal<Deck[]>([]);
  loading = signal(true);
  showModal = signal(false);
  newDeckName = signal('');
  error = signal('');

  constructor(
    private api: ApiService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadDecks();
  }

  loadDecks() {
    this.loading.set(true);
    this.error.set('');

    this.api.getDecks().subscribe({
      next: (decks) => {
        this.decks.set(decks);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Could not load your decks. Please try again.');
        this.loading.set(false);
      },
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('');
  }

  openModal() {
    this.showModal.set(true);
    this.newDeckName.set('');
  }

  closeModal() {
    this.showModal.set(false);
  }

  createDeck() {
    const name = this.newDeckName().trim();
    if (!name) return;

    this.api.createDeck(name).subscribe({
      next: (deck) => {
        this.decks.update((current) => [deck, ...current]);
        this.closeModal();
      },
      error: () => {
        this.error.set('Could not create deck. Please try again.');
      },
    });
  }
}