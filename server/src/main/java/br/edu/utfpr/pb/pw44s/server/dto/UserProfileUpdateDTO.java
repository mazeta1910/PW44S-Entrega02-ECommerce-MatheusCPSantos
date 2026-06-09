package br.edu.utfpr.pb.pw44s.server.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileUpdateDTO {

    @NotBlank(message = "O nome completo não pode ser vazio.")
    @Size(min = 4, max = 100, message = "O nome completo deve ter entre 4 e 100 caracteres.")
    @Pattern(regexp = "^[A-Za-zÀ-ÿ]+( [A-Za-zÀ-ÿ]+)+$", message = "O nome completo deve conter nome e sobrenome.")
    private String fullName;

    @NotBlank(message = "O telefone é obrigatório.")
    @Pattern(regexp = "^[0-9]{10,11}$",
            message = "O telefone deve conter apenas números, com DDD (10 ou 11 dígitos).")
    private String phone;

    private Boolean newsletterSubscription;
}
