package com.aoife.flashcardsbackend.repository;

import com.aoife.flashcardsbackend.entity.CardEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface CardRepository extends JpaRepository<CardEntity, UUID> {
    List<CardEntity> findByDeck_Id(UUID deckId);
}