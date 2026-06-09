package br.edu.utfpr.pb.pw44s.server.mapper;

import br.edu.utfpr.pb.pw44s.server.dto.AddressDTO;
import br.edu.utfpr.pb.pw44s.server.model.Address;
import org.springframework.stereotype.Component;

@Component
public class AddressMapper {

    private final UserMapper userMapper;

    public AddressMapper(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    public AddressDTO toDto(Address entity) {
        if (entity == null) {
            return null;
        }

        return AddressDTO.builder()
                .id(entity.getId())
                .user(userMapper.toDto(entity.getUser()))
                .zipCode(entity.getZipCode())
                .street(entity.getStreet())
                .number(entity.getNumber())
                .complement(entity.getComplement())
                .neighborhood(entity.getNeighborhood())
                .city(entity.getCity())
                .state(entity.getState())
                .build();
    }

    public Address toEntity(AddressDTO dto) {
        if (dto == null) {
            return null;
        }

        return Address.builder()
                .id(dto.getId())
                .zipCode(dto.getZipCode())
                .street(dto.getStreet())
                .number(dto.getNumber())
                .complement(dto.getComplement())
                .neighborhood(dto.getNeighborhood())
                .city(dto.getCity())
                .state(dto.getState())
                .build();
    }
}
