package com.dsirc.tests.service;

import com.dsirc.tests.service.dto.PensionDTO;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link com.dsirc.tests.domain.Pension}.
 */
public interface PensionService {
    /**
     * Save a pension.
     *
     * @param pensionDTO the entity to save.
     * @return the persisted entity.
     */
    PensionDTO save(PensionDTO pensionDTO);

    /**
     * Partially updates a pension.
     *
     * @param pensionDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<PensionDTO> partialUpdate(PensionDTO pensionDTO);

    /**
     * Get all the pensions.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<PensionDTO> findAll(Pageable pageable);
    /**
     * Get all the PensionDTO where Payment is {@code null}.
     *
     * @return the {@link List} of entities.
     */
    List<PensionDTO> findAllWherePaymentIsNull();

    /**
     * Get the "id" pension.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<PensionDTO> findOne(Long id);

    /**
     * Delete the "id" pension.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
