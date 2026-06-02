package br.edu.utfpr.pb.pw44s.server.mapper;

import br.edu.utfpr.pb.pw44s.server.dto.AddressDTO;
import br.edu.utfpr.pb.pw44s.server.model.Address;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = UserMapper.class)
public interface AddressMapper {
    AddressDTO toDto(Address entity);

    @Mapping(target = "isActive", ignore = true)
    @Mapping(target = "user", ignore = true)
    Address toEntity(AddressDTO dto);
}