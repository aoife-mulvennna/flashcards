package com.aoife.flashcardsbackend.service;

import com.aoife.flashcardsbackend.entity.DeckEntity;
import com.aoife.flashcardsbackend.entity.UserEntity;
import com.aoife.flashcardsbackend.repository.DeckRepository;
import com.aoife.flashcardsbackend.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DeckService {

    private final DeckRepository deckRepository;
    private final UserRepository userRepository;

    public DeckService(DeckRepository deckRepository, UserRepository userRepository) {
        this.deckRepository = deckRepository;
        this.userRepository = userRepository;
    }

    public List<DeckEntity> getMyDecks(Authentication authentication) {
        String email = authentication.getName();
        return deckRepository.findByOwnerEmail(email);
    }

    public DeckEntity createDeck(String name, Authentication authentication) {
        String email = authentication.getName();
        UserEntity owner = userRepository.findByEmail(email).orElseThrow();

        DeckEntity deck = new DeckEntity(name);
        deck.setOwner(owner);

        return deckRepository.save(deck);
    }
}