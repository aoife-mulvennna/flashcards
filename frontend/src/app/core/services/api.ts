import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Deck {
  id: string;
  name: string;
}

export interface Card {
  id: string;
  deckId: string;
  front: string;
  back: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getDecks(): Observable<Deck[]> {
    return this.http.get<Deck[]>(`${this.baseUrl}/decks`);
  }

  createDeck(name: string): Observable<Deck> {
    return this.http.post<Deck>(`${this.baseUrl}/decks`, { name });
  }

  getCards(deckId: string): Observable<Card[]> {
    return this.http.get<Card[]>(`${this.baseUrl}/decks/${deckId}/cards`);
  }

  createCard(deckId: string, front: string, back: string): Observable<Card> {
    return this.http.post<Card>(
      `${this.baseUrl}/decks/${deckId}/cards`,
      { front, back }
    );
  }

  updateCard(cardId: string, front: string, back: string): Observable<Card> {
    return this.http.put<Card>(`${this.baseUrl}/cards/${cardId}`, { front, back });
  }

  deleteCard(cardId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/cards/${cardId}`);
  }
}