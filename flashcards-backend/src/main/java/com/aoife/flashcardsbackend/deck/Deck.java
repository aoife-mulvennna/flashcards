package com.aoife.flashcardsbackend.deck;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "decks")
public class Deck {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    private String name;

    protected Deck() {}

    public Deck(String name) {
        this.name = name;
    }

    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}