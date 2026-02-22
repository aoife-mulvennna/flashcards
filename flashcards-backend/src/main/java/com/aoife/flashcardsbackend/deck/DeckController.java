package com.aoife.flashcardsbackend.deck;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/decks")
public class DeckController {

    private final DeckRepository deckRepository;

    public DeckController(DeckRepository deckRepository) {
        this.deckRepository = deckRepository;
    }

    @GetMapping
    public List<DeckDtos.DeckResponse> listDecks() {
        return deckRepository.findAll().stream()
                .map(d -> new DeckDtos.DeckResponse(d.getId(), d.getName()))
                .toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DeckDtos.DeckResponse createDeck(@Valid @RequestBody DeckDtos.CreateDeckRequest req) {
        Deck saved = deckRepository.save(new Deck(req.name()));
        return new DeckDtos.DeckResponse(saved.getId(), saved.getName());
    }

    @GetMapping("/{deckId}")
    public DeckDtos.DeckResponse getDeck(@PathVariable UUID deckId) {
        Deck deck = deckRepository.findById(deckId)
                .orElseThrow(() -> new IllegalArgumentException("Deck not found"));
        return new DeckDtos.DeckResponse(deck.getId(), deck.getName());
    }

    @DeleteMapping("/{deckId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteDeck(@PathVariable UUID deckId) {
        deckRepository.deleteById(deckId);
    }
}