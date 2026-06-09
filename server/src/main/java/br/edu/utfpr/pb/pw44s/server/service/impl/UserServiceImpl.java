package br.edu.utfpr.pb.pw44s.server.service.impl;

import br.edu.utfpr.pb.pw44s.server.dto.UserProfileUpdateDTO;
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
        if (user.getParentId() != null) {
            User parent = userRepository.findById(user.getParentId())
                    .orElseThrow(() -> new IllegalArgumentException("O ID do responsavel informado nao existe no sistema."));

            if (parent.getBirthDate() == null) {
                throw new IllegalArgumentException("O responsavel vinculado nao possui data de nascimento cadastrada.");
            }

            int parentAge = Period.between(parent.getBirthDate(), LocalDate.now()).getYears();

            if (parentAge < 18) {
                throw new IllegalArgumentException("A conta vinculada como responsavel pertence a um menor de idade.");
            }
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return super.save(user);
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