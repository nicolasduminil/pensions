package com.dsirc.tests.service.mapper;

import com.dsirc.tests.domain.*;
import com.dsirc.tests.service.dto.PaymentDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Payment} and its DTO {@link PaymentDTO}.
 */
@Mapper(componentModel = "spring", uses = { PensionMapper.class, RecipientMapper.class })
public interface PaymentMapper extends EntityMapper<PaymentDTO, Payment> {
    @Mapping(target = "pension", source = "pension", qualifiedByName = "id")
    @Mapping(target = "recipient", source = "recipient", qualifiedByName = "id")
    PaymentDTO toDto(Payment s);
}
