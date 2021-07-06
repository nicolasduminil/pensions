package com.dsirc.tests.service.mapper;

import com.dsirc.tests.domain.*;
import com.dsirc.tests.service.dto.ContactDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Contact} and its DTO {@link ContactDTO}.
 */
@Mapper(componentModel = "spring", uses = { RecipientMapper.class })
public interface ContactMapper extends EntityMapper<ContactDTO, Contact> {
    @Mapping(target = "recipient", source = "recipient", qualifiedByName = "lastName")
    ContactDTO toDto(Contact s);
}
