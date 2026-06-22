package br.edu.utfpr.pb.pw44s.server.service.impl;

import br.edu.utfpr.pb.pw44s.server.dto.UserProfileUpdateDTO;
import br.edu.utfpr.pb.pw44s.server.error.FieldValidationException;
import br.edu.utfpr.pb.pw44s.server.model.User;
import br.edu.utfpr.pb.pw44s.server.repository.UserRepository;
import br.edu.utfpr.pb.pw44s.server.service.IUserService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;

@Service
public class UserServiceImpl extends CrudServiceImpl<User, Long> implements IUserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    @Override
    protected JpaRepository<User, Long> getRepository() {
        return userRepository;
    }

    @Override
    public User save(User user) {
        resolveParentLink(user);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return super.save(user);
    }

    private void resolveParentLink(User user) {
        String parentEmail = user.getParentEmail();

        if (parentEmail == null || parentEmail.isBlank()) {
            return;
        }

        String normalizedParentEmail = parentEmail.trim();

        if (user.getEmail() != null
                && normalizedParentEmail.equalsIgnoreCase(user.getEmail().trim())) {
            throw new FieldValidationException(
                    "parentEmail",
                    "O e-mail do responsável deve ser diferente do seu.");
        }

        User parent = userRepository.findByEmailIgnoreCase(normalizedParentEmail)
                .orElseThrow(() -> new FieldValidationException(
                        "parentEmail",
                        "Não encontramos uma conta com este e-mail. O responsável precisa "
                                + "se cadastrar na loja primeiro; depois, informe aqui o e-mail "
                                + "usado no cadastro dele."));

        if (parent.getBirthDate() == null) {
            throw new FieldValidationException(
                    "parentEmail",
                    "A conta do responsável está incompleta. Peça para ele atualizar o "
                            + "cadastro ou entre em contato com o suporte.");
        }

        int parentAge = Period.between(parent.getBirthDate(), LocalDate.now()).getYears();

        if (parentAge < 18) {
            throw new FieldValidationException(
                    "parentEmail",
                    "A conta informada pertence a um menor de idade. Informe o e-mail de um "
                            + "responsável legal maior de 18 anos.");
        }

        user.setParentId(parent.getId());
        user.setParentEmail(null);
    }

    @Override
    public User updateProfile(String email, UserProfileUpdateDTO updateDTO) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado."));

        user.setFullName(updateDTO.getFullName().trim());
        user.setPhone(updateDTO.getPhone());
        user.setNewsletterSubscription(updateDTO.getNewsletterSubscription());

        return userRepository.save(user);
    }
}