package com.aoife.flashcardsbackend.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "cards")
public class CardEntity {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "deck_id", nullable = false)
    private DeckEntity deck;

    @Column(nullable = false, columnDefinition = "text")
    private String front;

    @Column(nullable = false, columnDefinition = "text")
    private String back;

    protected CardEntity() {}

    public CardEntity(DeckEntity deck, String front, String back) {
        this.deck = deck;
        this.front = front;
        this.back = back;
    }

    public UUID getId() {
        return id;
    }

    public UUID getDeckId() {
        return deck.getId();
    }

    public String getFront() {
        return front;
    }

    public void setFront(String front) {
        this.front = front;
    }

    public String getBack() {
        return back;
    }

    public void setBack(String back) {
        this.back = back;
    }

    public DeckEntity getDeck() {
        return deck;
    }
}