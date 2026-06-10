package br.edu.utfpr.pb.pw44s.server.service;

import br.edu.utfpr.pb.pw44s.server.dto.UserProfileUpdateDTO;
import br.edu.utfpr.pb.pw44s.server.model.User;

public interface IUserService extends ICrudService<User, Long> {

    User updateProfile(String email, UserProfileUpdateDTO updateDTO);
}