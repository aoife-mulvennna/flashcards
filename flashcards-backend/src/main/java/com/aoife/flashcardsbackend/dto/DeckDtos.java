package com.aoife.flashcardsbackend.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.UUID;

public class DeckDtos {

    public record DeckResponse(UUID id, String name) {}

    public record CreateDeckRequest(@NotBlank String name) {}
}