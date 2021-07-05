package com.dsirc.tests.service.impl;

import com.dsirc.tests.domain.Pension;
import com.dsirc.tests.repository.PensionRepository;
import com.dsirc.tests.service.PensionService;
import com.dsirc.tests.service.dto.PensionDTO;
import com.dsirc.tests.service.mapper.PensionMapper;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Pension}.
 */
@Service
@Transactional
public class PensionServiceImpl implements PensionService {

    private final Logger log = LoggerFactory.getLogger(PensionServiceImpl.class);

    private final PensionRepository pensionRepository;

    private final PensionMapper pensionMapper;

    public PensionServiceImpl(PensionRepository pensionRepository, PensionMapper pensionMapper) {
        this.pensionRepository = pensionRepository;
        this.pensionMapper = pensionMapper;
    }

    @Override
    public PensionDTO save(PensionDTO pensionDTO) {
        log.debug("Request to save Pension : {}", pensionDTO);
        Pension pension = pensionMapper.toEntity(pensionDTO);
        pension = pensionRepository.save(pension);
        return pensionMapper.toDto(pension);
    }

    @Override
    public Optional<PensionDTO> partialUpdate(PensionDTO pensionDTO) {
        log.debug("Request to partially update Pension : {}", pensionDTO);

        return pensionRepository
            .findById(pensionDTO.getId())
            .map(
                existingPension -> {
                    pensionMapper.partialUpdate(existingPension, pensionDTO);

                    return existingPension;
                }
            )
            .map(pensionRepository::save)
            .map(pensionMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PensionDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Pensions");
        return pensionRepository.findAll(pageable).map(pensionMapper::toDto);
    }

    /**
     *  Get all the pensions where Payment is {@code null}.
     *  @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<PensionDTO> findAllWherePaymentIsNull() {
        log.debug("Request to get all pensions where Payment is null");
        return StreamSupport
            .stream(pensionRepository.findAll().spliterator(), false)
            .filter(pension -> pension.getPayment() == null)
            .map(pensionMapper::toDto)
            .collect(Collectors.toCollection(LinkedList::new));
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<PensionDTO> findOne(Long id) {
        log.debug("Request to get Pension : {}", id);
        return pensionRepository.findById(id).map(pensionMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Pension : {}", id);
        pensionRepository.deleteById(id);
    }
}
