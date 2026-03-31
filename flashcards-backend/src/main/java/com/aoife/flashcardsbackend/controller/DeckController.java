package com.aoife.flashcardsbackend.controller;

import com.aoife.flashcardsbackend.dto.DeckDtos;
import com.aoife.flashcardsbackend.repository.DeckRepository;
import com.aoife.flashcardsbackend.entity.DeckEntity;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class DeckController {

    private final DeckRepository deckRepository;

    public DeckController(DeckRepository deckRepository) {
        this.deckRepository = deckRepository;
    }

    @GetMapping("/getDecks")
    public List<DeckDtos.DeckResponse> listDecks() {
        return deckRepository.findAll().stream()
                .map(d -> new DeckDtos.DeckResponse(d.getId(), d.getName()))
                .toList();
    }

    @PostMapping("/createDeck")
    @ResponseStatus(HttpStatus.CREATED)
    public DeckDtos.DeckResponse createDeck(@Valid @RequestBody DeckDtos.CreateDeckRequest req) {
        DeckEntity saved = deckRepository.save(new DeckEntity(req.name()));
        return new DeckDtos.DeckResponse(saved.getId(), saved.getName());
    }

    @GetMapping("/getDecks/{deckId}")
    public DeckDtos.DeckResponse getDeck(@PathVariable UUID deckId) {
        DeckEntity deck = deckRepository.findById(deckId)
                .orElseThrow(() -> new IllegalArgumentException("Deck not found"));
        return new DeckDtos.DeckResponse(deck.getId(), deck.getName());
    }

    @DeleteMapping("/deleteDeck/{deckId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteDeck(@PathVariable UUID deckId) {
        deckRepository.deleteById(deckId);
    }
}