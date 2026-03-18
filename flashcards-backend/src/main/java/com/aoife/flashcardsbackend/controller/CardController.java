package com.aoife.flashcardsbackend.controller;

import com.aoife.flashcardsbackend.dto.CardDtos;
import com.aoife.flashcardsbackend.repository.CardRepository;
import com.aoife.flashcardsbackend.entity.CardEntity;
import com.aoife.flashcardsbackend.entity.DeckEntity;
import com.aoife.flashcardsbackend.repository.DeckRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class CardController {

    private final CardRepository cardRepository;
    private final DeckRepository deckRepository;

    public CardController(CardRepository cardRepository, DeckRepository deckRepository) {
        this.cardRepository = cardRepository;
        this.deckRepository = deckRepository;
    }

    @GetMapping("/decks/{deckId}/cards")
    public List<CardDtos.CardResponse> listCards(@PathVariable UUID deckId) {
        return cardRepository.findByDeck_Id(deckId).stream()
                .map(c -> new CardDtos.CardResponse(c.getId(), c.getDeckId(), c.getFront(), c.getBack()))
                .toList();
    }

    @PostMapping("/decks/{deckId}/cards")
    @ResponseStatus(HttpStatus.CREATED)
    public CardDtos.CardResponse createCard(@PathVariable UUID deckId, @Valid @RequestBody CardDtos.CreateCardRequest req) {
        DeckEntity deck = deckRepository.findById(deckId)
                .orElseThrow(() -> new IllegalArgumentException("Deck not found"));

        CardEntity saved = cardRepository.save(new CardEntity(deck, req.front(), req.back()));
        return new CardDtos.CardResponse(saved.getId(), saved.getDeckId(), saved.getFront(), saved.getBack());
    }

    @PutMapping("/cards/{cardId}")
    public CardDtos.CardResponse updateCard(@PathVariable UUID cardId, @Valid @RequestBody CardDtos.UpdateCardRequest req) {
        CardEntity card = cardRepository.findById(cardId)
                .orElseThrow(() -> new IllegalArgumentException("Card not found"));

        card.setFront(req.front());
        card.setBack(req.back());

        CardEntity saved = cardRepository.save(card);
        return new CardDtos.CardResponse(saved.getId(), saved.getDeckId(), saved.getFront(), saved.getBack());
    }

    @DeleteMapping("/cards/{cardId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCard(@PathVariable UUID cardId) {
        cardRepository.deleteById(cardId);
    }
}