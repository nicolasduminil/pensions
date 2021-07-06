package com.dsirc.tests.service.mapper;

import com.dsirc.tests.domain.*;
import com.dsirc.tests.service.dto.PensionDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Pension} and its DTO {@link PensionDTO}.
 */
@Mapper(componentModel = "spring", uses = { RecipientMapper.class })
public interface PensionMapper extends EntityMapper<PensionDTO, Pension> {
    @Mapping(target = "recipient", source = "recipient", qualifiedByName = "lastName")
    PensionDTO toDto(Pension s);

    @Named("id")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    PensionDTO toDtoId(Pension pension);
}
