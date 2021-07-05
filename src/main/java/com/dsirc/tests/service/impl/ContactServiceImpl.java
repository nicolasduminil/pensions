package com.dsirc.tests.service.impl;

import com.dsirc.tests.domain.Contact;
import com.dsirc.tests.repository.ContactRepository;
import com.dsirc.tests.service.ContactService;
import com.dsirc.tests.service.dto.ContactDTO;
import com.dsirc.tests.service.mapper.ContactMapper;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Contact}.
 */
@Service
@Transactional
public class ContactServiceImpl implements ContactService {

    private final Logger log = LoggerFactory.getLogger(ContactServiceImpl.class);

    private final ContactRepository contactRepository;

    private final ContactMapper contactMapper;

    public ContactServiceImpl(ContactRepository contactRepository, ContactMapper contactMapper) {
        this.contactRepository = contactRepository;
        this.contactMapper = contactMapper;
    }

    @Override
    public ContactDTO save(ContactDTO contactDTO) {
        log.debug("Request to save Contact : {}", contactDTO);
        Contact contact = contactMapper.toEntity(contactDTO);
        contact = contactRepository.save(contact);
        return contactMapper.toDto(contact);
    }

    @Override
    public Optional<ContactDTO> partialUpdate(ContactDTO contactDTO) {
        log.debug("Request to partially update Contact : {}", contactDTO);

        return contactRepository
            .findById(contactDTO.getId())
            .map(
                existingContact -> {
                    contactMapper.partialUpdate(existingContact, contactDTO);

                    return existingContact;
                }
            )
            .map(contactRepository::save)
            .map(contactMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContactDTO> findAll() {
        log.debug("Request to get all Contacts");
        return contactRepository.findAll().stream().map(contactMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ContactDTO> findOne(Long id) {
        log.debug("Request to get Contact : {}", id);
        return contactRepository.findById(id).map(contactMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Contact : {}", id);
        contactRepository.deleteById(id);
    }
}
