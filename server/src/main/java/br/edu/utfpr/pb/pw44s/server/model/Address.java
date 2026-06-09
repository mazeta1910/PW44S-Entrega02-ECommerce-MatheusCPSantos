package br.edu.utfpr.pb.pw44s.server.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Entity
@Table(name = "tb_address")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Size(min = 8, max = 9, message = "O CEP deve ter 8 ou 9 caracteres.")
    @Column(length = 9, name = "zip_code")
    private String zipCode;

    @NotNull
    @Column(length = 150)
    private String street;

    @NotNull
    @Column(length = 20)
    private String number;

    @Column(length = 100)
    private String complement;

    @NotNull
    @Column(length = 100)
    private String neighborhood;

    @NotNull
    @Column(length = 100)
    private String city;

    @NotNull
    @Size(min = 2, max = 2, message = "O estado deve ser representado pela sigla (ex: PR).")
    @Column(length = 2)
    private String state;

    @Builder.Default
    @Column(name = "is_active")
    private Boolean isActive = true;

    @Builder.Default
    @Column(name = "is_primary")
    private Boolean isPrimary = false;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
