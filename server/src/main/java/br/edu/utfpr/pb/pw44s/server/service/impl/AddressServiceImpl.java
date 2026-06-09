package br.edu.utfpr.pb.pw44s.server.service.impl;

import br.edu.utfpr.pb.pw44s.server.model.Address;
import br.edu.utfpr.pb.pw44s.server.model.User;
import br.edu.utfpr.pb.pw44s.server.repository.AddressRepository;
import br.edu.utfpr.pb.pw44s.server.repository.UserRepository;
import br.edu.utfpr.pb.pw44s.server.service.IAddressService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
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
        User loggedUser = getLoggedUser();

        if (address.getId() != null) {
            Address existing = addressRepository.findById(address.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Endereço não encontrado."));

            ensureOwnership(existing, loggedUser);
            address.setUser(loggedUser);
            address.setIsActive(existing.getIsActive());
            address.setIsPrimary(existing.getIsPrimary());
            return super.save(address);
        }

        List<Address> activeAddresses = addressRepository.findByUserIdAndIsActiveTrue(loggedUser.getId());
        address.setUser(loggedUser);
        address.setIsActive(true);
        address.setIsPrimary(activeAddresses.isEmpty());
        return super.save(address);
    }

    @Override
    public List<Address> findByUserEmail(String email) {
        return addressRepository.findByUser_EmailAndIsActiveTrue(email).stream()
                .sorted(primaryFirstComparator())
                .toList();
    }

    @Override
    public List<Address> findActiveByUserId(Long userId) {
        return addressRepository.findByUserIdAndIsActiveTrue(userId).stream()
                .sorted(primaryFirstComparator())
                .toList();
    }

    @Override
    public List<Address> findAll() {
        return findByUserEmail(getLoggedUserEmail());
    }

    @Override
    @Transactional
    public Address setPrimaryAddress(Long id) {
        User loggedUser = getLoggedUser();
        Address target = addressRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Endereço não encontrado."));

        ensureOwnership(target, loggedUser);

        if (!Boolean.TRUE.equals(target.getIsActive())) {
            throw new IllegalArgumentException("Endereço não encontrado.");
        }

        List<Address> userAddresses = addressRepository.findByUserIdAndIsActiveTrue(loggedUser.getId());
        for (Address address : userAddresses) {
            address.setIsPrimary(address.getId().equals(id));
        }

        addressRepository.saveAll(userAddresses);
        return addressRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Endereço não encontrado."));
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        User loggedUser = getLoggedUser();
        Address address = addressRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Endereço não encontrado."));

        ensureOwnership(address, loggedUser);

        boolean wasPrimary = Boolean.TRUE.equals(address.getIsPrimary());
        address.setIsActive(false);
        address.setIsPrimary(false);
        addressRepository.save(address);

        if (wasPrimary) {
            List<Address> remaining = addressRepository.findByUserIdAndIsActiveTrue(loggedUser.getId());
            if (!remaining.isEmpty()) {
                remaining.get(0).setIsPrimary(true);
                addressRepository.save(remaining.get(0));
            }
        }
    }

    private Comparator<Address> primaryFirstComparator() {
        return Comparator
                .comparing((Address address) -> !Boolean.TRUE.equals(address.getIsPrimary()))
                .thenComparing(Address::getId, Comparator.nullsLast(Long::compareTo));
    }

    private User getLoggedUser() {
        return userRepository.findByEmailIgnoreCase(getLoggedUserEmail())
                .orElseThrow(() -> new IllegalArgumentException("Usuário logado não encontrado."));
    }

    private String getLoggedUserEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    private void ensureOwnership(Address address, User loggedUser) {
        if (address.getUser() == null || !address.getUser().getId().equals(loggedUser.getId())) {
            throw new IllegalArgumentException("Endereço não pertence ao usuário logado.");
        }
    }
}
