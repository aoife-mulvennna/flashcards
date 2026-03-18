package com.aoife.flashcardsbackend.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.UUID;

public class CardDtos {

    public record CardResponse(UUID id, UUID deckId, String front, String back) {}

    public record CreateCardRequest(@NotBlank String front, @NotBlank String back) {}

    public record UpdateCardRequest(@NotBlank String front, @NotBlank String back) {}
}