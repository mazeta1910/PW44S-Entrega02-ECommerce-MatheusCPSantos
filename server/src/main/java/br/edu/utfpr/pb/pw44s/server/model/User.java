package br.edu.utfpr.pb.pw44s.server.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.util.Collection;

@Entity
@Table(name = "tb_user")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(length = 50, unique = true)
    private String username;

    @NotNull
    @Column(length = 50, name = "display_name")
    private String displayName;

    @NotNull
    private String password;

    // --- NOVOS CAMPOS ---

    @NotNull
    @Column(name = "full_name", length = 150)
    private String fullName;

    @NotNull
    @Column(name = "birth_date")
    private LocalDate birthDate;

    @NotNull
    @Column(length = 100, unique = true)
    private String email;

    @NotNull
    @Column(length = 14, unique = true)
    private String cpf;

    @NotNull
    @NotBlank(message = "O telefone é obrigatório.")
    @Column(length = 20)
    private String phone;

    @Column(name = "newsletter_subscription", nullable = false)
    @Builder.Default
    private Boolean newsletterSubscription = false;

    @Column(name = "parent_id")
    private Long parentId;

    @Column(name = "terms_accepted", nullable = false)
    @Builder.Default
    private Boolean termsAccepted = false;

    // DEMAIS CAMPOS //

    @Override
    @Transient
    @JsonIgnore
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (username != null && "admin".equalsIgnoreCase(username)) {
            return AuthorityUtils.createAuthorityList("ROLE_ADMIN", "ROLE_USER");
        }
        return AuthorityUtils.createAuthorityList("ROLE_USER");
    }

    @Override
    @Transient
    @JsonIgnore
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    @Transient
    @JsonIgnore
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    @Transient
    @JsonIgnore
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    @Transient
    @JsonIgnore
    public boolean isEnabled() {
        return true;
    }

    public void setNewsletterSubscription(Boolean newsletterSubscription) {
        this.newsletterSubscription = (newsletterSubscription != null) ? newsletterSubscription : false;
    }
}