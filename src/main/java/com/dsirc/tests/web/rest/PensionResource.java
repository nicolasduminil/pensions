package com.dsirc.tests.web.rest;

import com.dsirc.tests.repository.PensionRepository;
import com.dsirc.tests.service.PensionService;
import com.dsirc.tests.service.dto.PensionDTO;
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
 * REST controller for managing {@link com.dsirc.tests.domain.Pension}.
 */
@RestController
@RequestMapping("/api")
public class PensionResource {

    private final Logger log = LoggerFactory.getLogger(PensionResource.class);

    private static final String ENTITY_NAME = "pension";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PensionService pensionService;

    private final PensionRepository pensionRepository;

    public PensionResource(PensionService pensionService, PensionRepository pensionRepository) {
        this.pensionService = pensionService;
        this.pensionRepository = pensionRepository;
    }

    /**
     * {@code POST  /pensions} : Create a new pension.
     *
     * @param pensionDTO the pensionDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new pensionDTO, or with status {@code 400 (Bad Request)} if the pension has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/pensions")
    public ResponseEntity<PensionDTO> createPension(@Valid @RequestBody PensionDTO pensionDTO) throws URISyntaxException {
        log.debug("REST request to save Pension : {}", pensionDTO);
        if (pensionDTO.getId() != null) {
            throw new BadRequestAlertException("A new pension cannot already have an ID", ENTITY_NAME, "idexists");
        }
        PensionDTO result = pensionService.save(pensionDTO);
        return ResponseEntity
            .created(new URI("/api/pensions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /pensions/:id} : Updates an existing pension.
     *
     * @param id the id of the pensionDTO to save.
     * @param pensionDTO the pensionDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated pensionDTO,
     * or with status {@code 400 (Bad Request)} if the pensionDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the pensionDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/pensions/{id}")
    public ResponseEntity<PensionDTO> updatePension(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody PensionDTO pensionDTO
    ) throws URISyntaxException {
        log.debug("REST request to update Pension : {}, {}", id, pensionDTO);
        if (pensionDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, pensionDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!pensionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        PensionDTO result = pensionService.save(pensionDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, pensionDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /pensions/:id} : Partial updates given fields of an existing pension, field will ignore if it is null
     *
     * @param id the id of the pensionDTO to save.
     * @param pensionDTO the pensionDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated pensionDTO,
     * or with status {@code 400 (Bad Request)} if the pensionDTO is not valid,
     * or with status {@code 404 (Not Found)} if the pensionDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the pensionDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/pensions/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<PensionDTO> partialUpdatePension(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody PensionDTO pensionDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update Pension partially : {}, {}", id, pensionDTO);
        if (pensionDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, pensionDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!pensionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<PensionDTO> result = pensionService.partialUpdate(pensionDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, pensionDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /pensions} : get all the pensions.
     *
     * @param pageable the pagination information.
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of pensions in body.
     */
    @GetMapping("/pensions")
    public ResponseEntity<List<PensionDTO>> getAllPensions(Pageable pageable, @RequestParam(required = false) String filter) {
        if ("payment-is-null".equals(filter)) {
            log.debug("REST request to get all Pensions where payment is null");
            return new ResponseEntity<>(pensionService.findAllWherePaymentIsNull(), HttpStatus.OK);
        }
        log.debug("REST request to get a page of Pensions");
        Page<PensionDTO> page = pensionService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /pensions/:id} : get the "id" pension.
     *
     * @param id the id of the pensionDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the pensionDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/pensions/{id}")
    public ResponseEntity<PensionDTO> getPension(@PathVariable Long id) {
        log.debug("REST request to get Pension : {}", id);
        Optional<PensionDTO> pensionDTO = pensionService.findOne(id);
        return ResponseUtil.wrapOrNotFound(pensionDTO);
    }

    /**
     * {@code DELETE  /pensions/:id} : delete the "id" pension.
     *
     * @param id the id of the pensionDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/pensions/{id}")
    public ResponseEntity<Void> deletePension(@PathVariable Long id) {
        log.debug("REST request to delete Pension : {}", id);
        pensionService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
