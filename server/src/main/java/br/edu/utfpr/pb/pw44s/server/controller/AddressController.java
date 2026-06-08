package br.edu.utfpr.pb.pw44s.server.controller;

import br.edu.utfpr.pb.pw44s.server.dto.AddressDTO;
import br.edu.utfpr.pb.pw44s.server.mapper.AddressMapper;
import br.edu.utfpr.pb.pw44s.server.model.Address;
import br.edu.utfpr.pb.pw44s.server.service.IAddressService;
import br.edu.utfpr.pb.pw44s.server.service.ICrudService;
import br.edu.utfpr.pb.pw44s.server.service.impl.AddressServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("addresses")
public class AddressController extends CrudController<Address, AddressDTO, Long> {

    private final IAddressService addressService;
    private final AddressMapper addressMapper;

    public AddressController(IAddressService addressService, AddressMapper addressMapper) {
        this.addressService = addressService;
        this.addressMapper = addressMapper;
    }

    @Override
    protected ICrudService<Address, Long> getService() {
        return addressService;
    }

    @Override
    protected AddressDTO toDto(Address entity) {
        return addressMapper.toDto(entity);
    }

    @Override
    protected Address toEntity(AddressDTO dto) {
        return addressMapper.toEntity(dto);
    }

    @GetMapping("me")
    public ResponseEntity<List<AddressDTO>> findMyAddresses() {
        String email = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication().getName();

        List<Address> addresses = addressService.findByUserEmail(email);
        return ResponseEntity.ok(addresses.stream().map(this::toDto).collect(Collectors.toList()));
    }
}