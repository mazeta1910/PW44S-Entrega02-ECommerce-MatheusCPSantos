package br.edu.utfpr.pb.pw44s.server.model.enums;

import lombok.Getter;

@Getter
public enum Platform {
    UNIVERSAL("Universal"),
    PS5("PlayStation 5"),
    XBOX_SERIES("Xbox Series X|S"),
    STEAM("Steam (PC)"),
    EPIC("Epic Games (PC)");

    private final String description;

    Platform(String description) {
        this.description = description;
    }
}
