package br.edu.utfpr.pb.pw44s.server.security.dto;

import br.edu.utfpr.pb.pw44s.server.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;

import java.util.HashSet;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDTO {

    private String fullName;
    private String email;
    private Set<AuthorityResponseDTO> authorities;

    public UserResponseDTO(User user) {
        this.fullName = user.getFullName();
        this.email = user.getEmail();
        this.authorities = new HashSet<>();
        for (GrantedAuthority authority : user.getAuthorities()) {
            authorities.add(new AuthorityResponseDTO(authority.getAuthority()));
        }
    }
}
