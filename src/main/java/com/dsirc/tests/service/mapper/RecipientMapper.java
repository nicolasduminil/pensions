package com.dsirc.tests.service.mapper;

import com.dsirc.tests.domain.*;
import com.dsirc.tests.service.dto.RecipientDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Recipient} and its DTO {@link RecipientDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface RecipientMapper extends EntityMapper<RecipientDTO, Recipient> {
    @Named("id")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    RecipientDTO toDtoId(Recipient recipient);

    @Named("lastName")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "lastName", source = "lastName")
    RecipientDTO toDtoLastName(Recipient recipient);
}
