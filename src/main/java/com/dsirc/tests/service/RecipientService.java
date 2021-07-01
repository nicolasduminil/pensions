package com.dsirc.tests.service;

import com.dsirc.tests.domain.Recipient;
import com.dsirc.tests.repository.RecipientRepository;
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
 * Service Implementation for managing {@link Recipient}.
 */
@Service
@Transactional
public class RecipientService {

    private final Logger log = LoggerFactory.getLogger(RecipientService.class);

    private final RecipientRepository recipientRepository;

    public RecipientService(RecipientRepository recipientRepository) {
        this.recipientRepository = recipientRepository;
    }

    /**
     * Save a recipient.
     *
     * @param recipient the entity to save.
     * @return the persisted entity.
     */
    public Recipient save(Recipient recipient) {
        log.debug("Request to save Recipient : {}", recipient);
        return recipientRepository.save(recipient);
    }

    /**
     * Partially update a recipient.
     *
     * @param recipient the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Recipient> partialUpdate(Recipient recipient) {
        log.debug("Request to partially update Recipient : {}", recipient);

        return recipientRepository
            .findById(recipient.getId())
            .map(
                existingRecipient -> {
                    if (recipient.getFirstName() != null) {
                        existingRecipient.setFirstName(recipient.getFirstName());
                    }
                    if (recipient.getLastName() != null) {
                        existingRecipient.setLastName(recipient.getLastName());
                    }
                    if (recipient.getBirthDate() != null) {
                        existingRecipient.setBirthDate(recipient.getBirthDate());
                    }
                    if (recipient.getGender() != null) {
                        existingRecipient.setGender(recipient.getGender());
                    }

                    return existingRecipient;
                }
            )
            .map(recipientRepository::save);
    }

    /**
     * Get all the recipients.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Recipient> findAll(Pageable pageable) {
        log.debug("Request to get all Recipients");
        return recipientRepository.findAll(pageable);
    }

    /**
     *  Get all the recipients where Pension is {@code null}.
     *  @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<Recipient> findAllWherePensionIsNull() {
        log.debug("Request to get all recipients where Pension is null");
        return StreamSupport
            .stream(recipientRepository.findAll().spliterator(), false)
            .filter(recipient -> recipient.getPension() == null)
            .collect(Collectors.toList());
    }

    /**
     * Get one recipient by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Recipient> findOne(Long id) {
        log.debug("Request to get Recipient : {}", id);
        return recipientRepository.findById(id);
    }

    /**
     * Delete the recipient by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Recipient : {}", id);
        recipientRepository.deleteById(id);
    }
}
