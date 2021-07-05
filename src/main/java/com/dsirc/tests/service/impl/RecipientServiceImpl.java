package com.dsirc.tests.service.impl;

import com.dsirc.tests.domain.Recipient;
import com.dsirc.tests.repository.RecipientRepository;
import com.dsirc.tests.service.RecipientService;
import com.dsirc.tests.service.dto.RecipientDTO;
import com.dsirc.tests.service.mapper.RecipientMapper;
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
 * Service Implementation for managing {@link Recipient}.
 */
@Service
@Transactional
public class RecipientServiceImpl implements RecipientService {

    private final Logger log = LoggerFactory.getLogger(RecipientServiceImpl.class);

    private final RecipientRepository recipientRepository;

    private final RecipientMapper recipientMapper;

    public RecipientServiceImpl(RecipientRepository recipientRepository, RecipientMapper recipientMapper) {
        this.recipientRepository = recipientRepository;
        this.recipientMapper = recipientMapper;
    }

    @Override
    public RecipientDTO save(RecipientDTO recipientDTO) {
        log.debug("Request to save Recipient : {}", recipientDTO);
        Recipient recipient = recipientMapper.toEntity(recipientDTO);
        recipient = recipientRepository.save(recipient);
        return recipientMapper.toDto(recipient);
    }

    @Override
    public Optional<RecipientDTO> partialUpdate(RecipientDTO recipientDTO) {
        log.debug("Request to partially update Recipient : {}", recipientDTO);

        return recipientRepository
            .findById(recipientDTO.getId())
            .map(
                existingRecipient -> {
                    recipientMapper.partialUpdate(existingRecipient, recipientDTO);

                    return existingRecipient;
                }
            )
            .map(recipientRepository::save)
            .map(recipientMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<RecipientDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Recipients");
        return recipientRepository.findAll(pageable).map(recipientMapper::toDto);
    }

    /**
     *  Get all the recipients where Pension is {@code null}.
     *  @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<RecipientDTO> findAllWherePensionIsNull() {
        log.debug("Request to get all recipients where Pension is null");
        return StreamSupport
            .stream(recipientRepository.findAll().spliterator(), false)
            .filter(recipient -> recipient.getPension() == null)
            .map(recipientMapper::toDto)
            .collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     *  Get all the recipients where Payment is {@code null}.
     *  @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<RecipientDTO> findAllWherePaymentIsNull() {
        log.debug("Request to get all recipients where Payment is null");
        return StreamSupport
            .stream(recipientRepository.findAll().spliterator(), false)
            .filter(recipient -> recipient.getPayment() == null)
            .map(recipientMapper::toDto)
            .collect(Collectors.toCollection(LinkedList::new));
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<RecipientDTO> findOne(Long id) {
        log.debug("Request to get Recipient : {}", id);
        return recipientRepository.findById(id).map(recipientMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Recipient : {}", id);
        recipientRepository.deleteById(id);
    }
}
