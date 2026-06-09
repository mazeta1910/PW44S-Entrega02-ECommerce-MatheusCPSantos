package br.edu.utfpr.pb.pw44s.server.controller;

import br.edu.utfpr.pb.pw44s.server.dto.UserDTO;
import br.edu.utfpr.pb.pw44s.server.dto.UserProfileUpdateDTO;
import br.edu.utfpr.pb.pw44s.server.mapper.UserMapper;
import br.edu.utfpr.pb.pw44s.server.model.User;
import br.edu.utfpr.pb.pw44s.server.service.AuthService;
import br.edu.utfpr.pb.pw44s.server.service.IUserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("auth")
public class AuthController {

    private final AuthService authService;
    private final UserMapper userMapper;
    private final IUserService userService;

    public AuthController(AuthService authService, UserMapper userMapper, IUserService userService) {
        this.authService = authService;
        this.userMapper = userMapper;
        this.userService = userService;
    }

    @GetMapping("user-info")
    public UserDTO getUserInfo(Principal principal) {
        String email = principal.getName();
        User user = (User) authService.loadUserByUsername(email);
        return userMapper.toDto(user);
    }

    @PutMapping("user-info")
    public UserDTO updateUserInfo(
            Principal principal,
            @Valid @RequestBody UserProfileUpdateDTO updateDTO) {
        User updated = userService.updateProfile(principal.getName(), updateDTO);
        return userMapper.toDto(updated);
    }
}

