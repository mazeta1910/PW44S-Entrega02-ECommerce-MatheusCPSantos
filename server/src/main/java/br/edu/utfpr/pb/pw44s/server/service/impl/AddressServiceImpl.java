package br.edu.utfpr.pb.pw44s.server.service.impl;

import br.edu.utfpr.pb.pw44s.server.model.Address;
import br.edu.utfpr.pb.pw44s.server.model.User;
import br.edu.utfpr.pb.pw44s.server.repository.AddressRepository;
import br.edu.utfpr.pb.pw44s.server.repository.UserRepository;
import br.edu.utfpr.pb.pw44s.server.service.IAddressService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AddressServiceImpl extends CrudServiceImpl<Address, Long> implements IAddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public AddressServiceImpl(AddressRepository addressRepository, UserRepository userRepository) {
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
    }

    @Override
    protected JpaRepository<Address, Long> getRepository() {
        return addressRepository;
    }

    @Override
    public Address save(Address address) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User loggedUser = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new IllegalArgumentException("Usuário logado não encontrado."));

        address.setUser(loggedUser);

        return super.save(address);
    }

    @Override
    public List<Address> findByUserEmail(String email) {
        return addressRepository.findByUser_Email(email);
    }

    @Override
    public List<Address> findActiveByUserId(Long userId) {
        return addressRepository.findByUserIdAndIsActiveTrue(userId);
    }

    @Override
    public List<Address> findAll() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return addressRepository.findByUser_Email(email);
    }

    @Override
    public void deleteById(Long id) {
        Address address = addressRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Endereço não encontrado"));

        address.setIsActive(false);
        addressRepository.save(address);
    }
}
