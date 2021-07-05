package com.dsirc.tests.service;

import com.dsirc.tests.service.dto.RecipientDTO;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link com.dsirc.tests.domain.Recipient}.
 */
public interface RecipientService {
    /**
     * Save a recipient.
     *
     * @param recipientDTO the entity to save.
     * @return the persisted entity.
     */
    RecipientDTO save(RecipientDTO recipientDTO);

    /**
     * Partially updates a recipient.
     *
     * @param recipientDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<RecipientDTO> partialUpdate(RecipientDTO recipientDTO);

    /**
     * Get all the recipients.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<RecipientDTO> findAll(Pageable pageable);
    /**
     * Get all the RecipientDTO where Pension is {@code null}.
     *
     * @return the {@link List} of entities.
     */
    List<RecipientDTO> findAllWherePensionIsNull();
    /**
     * Get all the RecipientDTO where Payment is {@code null}.
     *
     * @return the {@link List} of entities.
     */
    List<RecipientDTO> findAllWherePaymentIsNull();

    /**
     * Get the "id" recipient.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<RecipientDTO> findOne(Long id);

    /**
     * Delete the "id" recipient.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
