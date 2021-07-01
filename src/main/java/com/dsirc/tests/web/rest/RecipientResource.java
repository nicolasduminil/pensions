package com.dsirc.tests.web.rest;

import com.dsirc.tests.domain.Recipient;
import com.dsirc.tests.repository.RecipientRepository;
import com.dsirc.tests.service.RecipientService;
import com.dsirc.tests.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.StreamSupport;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.dsirc.tests.domain.Recipient}.
 */
@RestController
@RequestMapping("/api")
public class RecipientResource {

    private final Logger log = LoggerFactory.getLogger(RecipientResource.class);

    private static final String ENTITY_NAME = "recipient";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final RecipientService recipientService;

    private final RecipientRepository recipientRepository;

    public RecipientResource(RecipientService recipientService, RecipientRepository recipientRepository) {
        this.recipientService = recipientService;
        this.recipientRepository = recipientRepository;
    }

    /**
     * {@code POST  /recipients} : Create a new recipient.
     *
     * @param recipient the recipient to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new recipient, or with status {@code 400 (Bad Request)} if the recipient has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/recipients")
    public ResponseEntity<Recipient> createRecipient(@Valid @RequestBody Recipient recipient) throws URISyntaxException {
        log.debug("REST request to save Recipient : {}", recipient);
        if (recipient.getId() != null) {
            throw new BadRequestAlertException("A new recipient cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Recipient result = recipientService.save(recipient);
        return ResponseEntity
            .created(new URI("/api/recipients/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /recipients/:id} : Updates an existing recipient.
     *
     * @param id the id of the recipient to save.
     * @param recipient the recipient to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated recipient,
     * or with status {@code 400 (Bad Request)} if the recipient is not valid,
     * or with status {@code 500 (Internal Server Error)} if the recipient couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/recipients/{id}")
    public ResponseEntity<Recipient> updateRecipient(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Recipient recipient
    ) throws URISyntaxException {
        log.debug("REST request to update Recipient : {}, {}", id, recipient);
        if (recipient.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, recipient.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!recipientRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Recipient result = recipientService.save(recipient);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, recipient.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /recipients/:id} : Partial updates given fields of an existing recipient, field will ignore if it is null
     *
     * @param id the id of the recipient to save.
     * @param recipient the recipient to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated recipient,
     * or with status {@code 400 (Bad Request)} if the recipient is not valid,
     * or with status {@code 404 (Not Found)} if the recipient is not found,
     * or with status {@code 500 (Internal Server Error)} if the recipient couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/recipients/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Recipient> partialUpdateRecipient(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Recipient recipient
    ) throws URISyntaxException {
        log.debug("REST request to partial update Recipient partially : {}, {}", id, recipient);
        if (recipient.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, recipient.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!recipientRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Recipient> result = recipientService.partialUpdate(recipient);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, recipient.getId().toString())
        );
    }

    /**
     * {@code GET  /recipients} : get all the recipients.
     *
     * @param pageable the pagination information.
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of recipients in body.
     */
    @GetMapping("/recipients")
    public ResponseEntity<List<Recipient>> getAllRecipients(Pageable pageable, @RequestParam(required = false) String filter) {
        if ("pension-is-null".equals(filter)) {
            log.debug("REST request to get all Recipients where pension is null");
            return new ResponseEntity<>(recipientService.findAllWherePensionIsNull(), HttpStatus.OK);
        }
        log.debug("REST request to get a page of Recipients");
        Page<Recipient> page = recipientService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /recipients/:id} : get the "id" recipient.
     *
     * @param id the id of the recipient to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the recipient, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/recipients/{id}")
    public ResponseEntity<Recipient> getRecipient(@PathVariable Long id) {
        log.debug("REST request to get Recipient : {}", id);
        Optional<Recipient> recipient = recipientService.findOne(id);
        return ResponseUtil.wrapOrNotFound(recipient);
    }

    /**
     * {@code DELETE  /recipients/:id} : delete the "id" recipient.
     *
     * @param id the id of the recipient to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/recipients/{id}")
    public ResponseEntity<Void> deleteRecipient(@PathVariable Long id) {
        log.debug("REST request to delete Recipient : {}", id);
        recipientService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
