package com.dsirc.tests.service.mapper;

import com.dsirc.tests.domain.*;
import com.dsirc.tests.service.dto.AddressDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Address} and its DTO {@link AddressDTO}.
 */
@Mapper(componentModel = "spring", uses = { RecipientMapper.class })
public interface AddressMapper extends EntityMapper<AddressDTO, Address> {
    @Mapping(target = "recipient", source = "recipient", qualifiedByName = "lastName")
    AddressDTO toDto(Address s);
}
