package com.aoife.flashcardsbackend.entity;

import jakarta.persistence.*;
import org.apache.catalina.User;

import java.util.UUID;

@Entity
@Table(name = "decks")
public class DeckEntity {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id")
    private UserEntity owner;

    protected DeckEntity() {}

    public DeckEntity(String name) {
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

    public UserEntity getOwner() {
     return owner;
    }

    public void setOwner(UserEntity owner) {
        this.owner = owner;
    }
}