package br.edu.utfpr.pb.pw44s.server.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {

    private Long id;

    @NotBlank(message = "O nome completo não pode ser vazio.")
    @Size(min = 5, max = 100, message = "O nome completo deve ter entre 5 e 100 caracteres.")
    @Pattern(
            regexp = "^[A-Za-zÀ-ÿ]{2,}( [A-Za-zÀ-ÿ]{2,})+$",
            message = "O nome completo deve conter nome e sobrenome (mínimo 2 letras em cada parte).")
    private String fullName;

    @com.fasterxml.jackson.annotation.JsonProperty(access = com.fasterxml.jackson.annotation.JsonProperty.Access.WRITE_ONLY)
    @NotNull(message = "A senha é obrigatória.")
    @Size(min = 8, message = "A senha deve ter no mínimo 8 caracteres.")
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#]).*$",
            message = "A senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial."
    )
    private String password;

    @com.fasterxml.jackson.annotation.JsonProperty(access = com.fasterxml.jackson.annotation.JsonProperty.Access.WRITE_ONLY)
    @NotBlank(message = "A confirmação de senha é obrigatória.")
    private String confirmPassword;

    @JsonIgnore
    @AssertTrue(message = "As senhas informadas não coincidem.")
    public boolean isPasswordsMatch() {
        if (password == null || confirmPassword == null) {
            return true;
        }
        return password.equals(confirmPassword);
    }

    @NotNull(message = "A data de nascimento é obrigatória.")
    @Past(message = "A data de nascimento deve estar no passado.")
    private LocalDate birthDate;

    @NotBlank(message = "O e-mail é obrigatório.")
    @Email(message = "O formato do e-mail é inválido.")
    private String email;

    @NotBlank(message = "O CPF é obrigatório.")
    @Size(min = 11, max = 14, message = "O CPF deve conter entre 11 e 14 caracteres.")
    private String cpf;

    @NotBlank(message = "O telefone é obrigatório.")
    @Pattern(regexp = "^[0-9]{10,11}$",
            message = "O telefone deve conter apenas números, com DDD (10 ou 11 dígitos).")
    private String phone;

    private Boolean newsletterSubscription;

    @Email(message = "Informe um e-mail válido para o responsável.")
    private String parentEmail;

    @JsonIgnore
    private Long parentId;

    @NotNull(message = "O aceite dos termos e da política de privacidade é obrigatório.")
    @AssertTrue(message = "Você deve aceitar os Termos de Uso e a Política de Privacidade para prosseguir com o cadastro.")
    private Boolean termsAccepted;

    @JsonIgnore
    @AssertTrue(message = "Idade inválida para cadastro ou falta de vínculo parental.")
    public boolean isValidAgePolicy() {
        if (birthDate == null) return true;

        int age = java.time.Period.between(birthDate, LocalDate.now()).getYears();

        if (age < 12) return false;

        if (age < 16 && (parentEmail == null || parentEmail.isBlank())) return false;

        return true;
    }

    @JsonIgnore
    public boolean isAdult() {
        if (birthDate == null) {
            return false;
        }
        int age = java.time.Period.between(birthDate, LocalDate.now()).getYears();
        return age >= 18;
    }
}
