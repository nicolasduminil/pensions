package com.dsirc.tests.service;

import com.dsirc.tests.domain.Pension;
import com.dsirc.tests.repository.PensionRepository;
import java.util.Optional;
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
public class PensionService {

    private final Logger log = LoggerFactory.getLogger(PensionService.class);

    private final PensionRepository pensionRepository;

    public PensionService(PensionRepository pensionRepository) {
        this.pensionRepository = pensionRepository;
    }

    /**
     * Save a pension.
     *
     * @param pension the entity to save.
     * @return the persisted entity.
     */
    public Pension save(Pension pension) {
        log.debug("Request to save Pension : {}", pension);
        return pensionRepository.save(pension);
    }

    /**
     * Partially update a pension.
     *
     * @param pension the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Pension> partialUpdate(Pension pension) {
        log.debug("Request to partially update Pension : {}", pension);

        return pensionRepository
            .findById(pension.getId())
            .map(
                existingPension -> {
                    if (pension.getPensionType() != null) {
                        existingPension.setPensionType(pension.getPensionType());
                    }
                    if (pension.getStartingDate() != null) {
                        existingPension.setStartingDate(pension.getStartingDate());
                    }
                    if (pension.getPaymentMethod() != null) {
                        existingPension.setPaymentMethod(pension.getPaymentMethod());
                    }
                    if (pension.getAmount() != null) {
                        existingPension.setAmount(pension.getAmount());
                    }

                    return existingPension;
                }
            )
            .map(pensionRepository::save);
    }

    /**
     * Get all the pensions.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Pension> findAll(Pageable pageable) {
        log.debug("Request to get all Pensions");
        return pensionRepository.findAll(pageable);
    }

    /**
     * Get one pension by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Pension> findOne(Long id) {
        log.debug("Request to get Pension : {}", id);
        return pensionRepository.findById(id);
    }

    /**
     * Delete the pension by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Pension : {}", id);
        pensionRepository.deleteById(id);
    }
}
