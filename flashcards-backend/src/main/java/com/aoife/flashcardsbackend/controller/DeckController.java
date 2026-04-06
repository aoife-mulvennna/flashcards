package com.aoife.flashcardsbackend.controller;

import com.aoife.flashcardsbackend.dto.DeckDtos;
import com.aoife.flashcardsbackend.entity.DeckEntity;
import com.aoife.flashcardsbackend.entity.UserEntity;
import com.aoife.flashcardsbackend.repository.DeckRepository;
import com.aoife.flashcardsbackend.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class DeckController {

    private final DeckRepository deckRepository;
    private final UserRepository userRepository;

    public DeckController(DeckRepository deckRepository,
                          UserRepository userRepository) {
        this.deckRepository = deckRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/getDecks")
    public List<DeckDtos.DeckResponse> listDecks(Authentication authentication) {
        String email = authentication.getName();

        return deckRepository.findByOwnerEmail(email).stream()
                .map(d -> new DeckDtos.DeckResponse(d.getId(), d.getName()))
                .toList();
    }

    @PostMapping("/createDeck")
    @ResponseStatus(HttpStatus.CREATED)
    public DeckDtos.DeckResponse createDeck(@Valid @RequestBody DeckDtos.CreateDeckRequest req,
                                            Authentication authentication) {
        String email = authentication.getName();

        if (deckRepository.existsByOwnerEmailAndNameIgnoreCase(email, req.name().trim())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "You already have a deck with that name");
        }

        UserEntity user = userRepository.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("User not found"));


        try {
            DeckEntity deck = new DeckEntity(req.name(), user);
            deck.setOwner(user);

            DeckEntity saved = deckRepository.save(deck);
            return new DeckDtos.DeckResponse(saved.getId(), saved.getName());
        } catch (DataIntegrityViolationException e) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "You already have a deck with that name");
        }
    }

    @GetMapping("/getDecks/{deckId}")
    public DeckDtos.DeckResponse getDeck(@PathVariable UUID deckId,
                                         Authentication authentication) {

        String email = authentication.getName();

        DeckEntity deck = deckRepository.findByIdAndOwnerEmail(deckId, email)
                .orElseThrow(() -> new IllegalArgumentException("Deck not found"));
        return new DeckDtos.DeckResponse(deck.getId(), deck.getName());
    }

    @DeleteMapping("/deleteDeck/{deckId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteDeck(@PathVariable UUID deckId,
                           Authentication authentication) {

        String email = authentication.getName();

        DeckEntity deck = deckRepository.findByIdAndOwnerEmail(deckId, email)
                .orElseThrow(() -> new IllegalArgumentException("Deck not found"));

        deckRepository.delete(deck);
    }
}