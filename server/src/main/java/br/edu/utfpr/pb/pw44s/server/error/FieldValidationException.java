package br.edu.utfpr.pb.pw44s.server.error;

import lombok.Getter;

@Getter
public class FieldValidationException extends IllegalArgumentException {

    private final String field;

    public FieldValidationException(String field, String message) {
        super(message);
        this.field = field;
    }
}
