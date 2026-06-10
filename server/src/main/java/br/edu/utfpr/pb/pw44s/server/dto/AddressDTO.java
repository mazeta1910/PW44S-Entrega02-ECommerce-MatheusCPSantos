package br.edu.utfpr.pb.pw44s.server.dto;

import jakarta.validation.constraints.NotNull;
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
public class AddressDTO {

    private Long id;

    private UserDTO user;

    @NotNull
    @Pattern(regexp = "^\\d{5}-?\\d{3}$", message = "Formato de CEP inválido. Use XXXXX-XXX ou XXXXXXXX")
    private String zipCode;

    @NotNull
    private String street;

    @NotNull
    private String number;

    private String complement;

    @NotNull
    private String neighborhood;

    @NotNull
    private String city;

    @NotNull
    @Size(min = 2, max = 2, message = "O estado deve ser representado pela sigla (ex: PR).")
    private String state;

    private Boolean isPrimary;

}