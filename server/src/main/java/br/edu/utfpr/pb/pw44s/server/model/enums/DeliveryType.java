package br.edu.utfpr.pb.pw44s.server.model.enums;

import lombok.Getter;

@Getter
public enum DeliveryType {
    PHYSICAL("Entrega física"),
    DIGITAL("Entrega digital (código de ativação)");

    private final String description;

    DeliveryType(String description) {
        this.description = description;
    }
}
