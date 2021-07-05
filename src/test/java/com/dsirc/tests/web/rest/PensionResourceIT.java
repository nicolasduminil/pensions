package com.dsirc.tests.web.rest;

import static com.dsirc.tests.web.rest.TestUtil.sameNumber;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.dsirc.tests.IntegrationTest;
import com.dsirc.tests.domain.Pension;
import com.dsirc.tests.domain.enumeration.PaymentMethod;
import com.dsirc.tests.domain.enumeration.PensionType;
import com.dsirc.tests.repository.PensionRepository;
import com.dsirc.tests.service.dto.PensionDTO;
import com.dsirc.tests.service.mapper.PensionMapper;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link PensionResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PensionResourceIT {

    private static final PensionType DEFAULT_PENSION_TYPE = PensionType.TYPE1;
    private static final PensionType UPDATED_PENSION_TYPE = PensionType.TYPE2;

    private static final LocalDate DEFAULT_STARTING_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_STARTING_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final PaymentMethod DEFAULT_PAYMENT_METHOD = PaymentMethod.BANK_TRANSFER;
    private static final PaymentMethod UPDATED_PAYMENT_METHOD = PaymentMethod.POSTAL_ORDER;

    private static final BigDecimal DEFAULT_AMOUNT = new BigDecimal(1);
    private static final BigDecimal UPDATED_AMOUNT = new BigDecimal(2);

    private static final String ENTITY_API_URL = "/api/pensions";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PensionRepository pensionRepository;

    @Autowired
    private PensionMapper pensionMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPensionMockMvc;

    private Pension pension;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Pension createEntity(EntityManager em) {
        Pension pension = new Pension()
            .pensionType(DEFAULT_PENSION_TYPE)
            .startingDate(DEFAULT_STARTING_DATE)
            .paymentMethod(DEFAULT_PAYMENT_METHOD)
            .amount(DEFAULT_AMOUNT);
        return pension;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Pension createUpdatedEntity(EntityManager em) {
        Pension pension = new Pension()
            .pensionType(UPDATED_PENSION_TYPE)
            .startingDate(UPDATED_STARTING_DATE)
            .paymentMethod(UPDATED_PAYMENT_METHOD)
            .amount(UPDATED_AMOUNT);
        return pension;
    }

    @BeforeEach
    public void initTest() {
        pension = createEntity(em);
    }

    @Test
    @Transactional
    void createPension() throws Exception {
        int databaseSizeBeforeCreate = pensionRepository.findAll().size();
        // Create the Pension
        PensionDTO pensionDTO = pensionMapper.toDto(pension);
        restPensionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(pensionDTO)))
            .andExpect(status().isCreated());

        // Validate the Pension in the database
        List<Pension> pensionList = pensionRepository.findAll();
        assertThat(pensionList).hasSize(databaseSizeBeforeCreate + 1);
        Pension testPension = pensionList.get(pensionList.size() - 1);
        assertThat(testPension.getPensionType()).isEqualTo(DEFAULT_PENSION_TYPE);
        assertThat(testPension.getStartingDate()).isEqualTo(DEFAULT_STARTING_DATE);
        assertThat(testPension.getPaymentMethod()).isEqualTo(DEFAULT_PAYMENT_METHOD);
        assertThat(testPension.getAmount()).isEqualByComparingTo(DEFAULT_AMOUNT);
    }

    @Test
    @Transactional
    void createPensionWithExistingId() throws Exception {
        // Create the Pension with an existing ID
        pension.setId(1L);
        PensionDTO pensionDTO = pensionMapper.toDto(pension);

        int databaseSizeBeforeCreate = pensionRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPensionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(pensionDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Pension in the database
        List<Pension> pensionList = pensionRepository.findAll();
        assertThat(pensionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkPensionTypeIsRequired() throws Exception {
        int databaseSizeBeforeTest = pensionRepository.findAll().size();
        // set the field null
        pension.setPensionType(null);

        // Create the Pension, which fails.
        PensionDTO pensionDTO = pensionMapper.toDto(pension);

        restPensionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(pensionDTO)))
            .andExpect(status().isBadRequest());

        List<Pension> pensionList = pensionRepository.findAll();
        assertThat(pensionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkStartingDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = pensionRepository.findAll().size();
        // set the field null
        pension.setStartingDate(null);

        // Create the Pension, which fails.
        PensionDTO pensionDTO = pensionMapper.toDto(pension);

        restPensionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(pensionDTO)))
            .andExpect(status().isBadRequest());

        List<Pension> pensionList = pensionRepository.findAll();
        assertThat(pensionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkPaymentMethodIsRequired() throws Exception {
        int databaseSizeBeforeTest = pensionRepository.findAll().size();
        // set the field null
        pension.setPaymentMethod(null);

        // Create the Pension, which fails.
        PensionDTO pensionDTO = pensionMapper.toDto(pension);

        restPensionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(pensionDTO)))
            .andExpect(status().isBadRequest());

        List<Pension> pensionList = pensionRepository.findAll();
        assertThat(pensionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkAmountIsRequired() throws Exception {
        int databaseSizeBeforeTest = pensionRepository.findAll().size();
        // set the field null
        pension.setAmount(null);

        // Create the Pension, which fails.
        PensionDTO pensionDTO = pensionMapper.toDto(pension);

        restPensionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(pensionDTO)))
            .andExpect(status().isBadRequest());

        List<Pension> pensionList = pensionRepository.findAll();
        assertThat(pensionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllPensions() throws Exception {
        // Initialize the database
        pensionRepository.saveAndFlush(pension);

        // Get all the pensionList
        restPensionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(pension.getId().intValue())))
            .andExpect(jsonPath("$.[*].pensionType").value(hasItem(DEFAULT_PENSION_TYPE.toString())))
            .andExpect(jsonPath("$.[*].startingDate").value(hasItem(DEFAULT_STARTING_DATE.toString())))
            .andExpect(jsonPath("$.[*].paymentMethod").value(hasItem(DEFAULT_PAYMENT_METHOD.toString())))
            .andExpect(jsonPath("$.[*].amount").value(hasItem(sameNumber(DEFAULT_AMOUNT))));
    }

    @Test
    @Transactional
    void getPension() throws Exception {
        // Initialize the database
        pensionRepository.saveAndFlush(pension);

        // Get the pension
        restPensionMockMvc
            .perform(get(ENTITY_API_URL_ID, pension.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(pension.getId().intValue()))
            .andExpect(jsonPath("$.pensionType").value(DEFAULT_PENSION_TYPE.toString()))
            .andExpect(jsonPath("$.startingDate").value(DEFAULT_STARTING_DATE.toString()))
            .andExpect(jsonPath("$.paymentMethod").value(DEFAULT_PAYMENT_METHOD.toString()))
            .andExpect(jsonPath("$.amount").value(sameNumber(DEFAULT_AMOUNT)));
    }

    @Test
    @Transactional
    void getNonExistingPension() throws Exception {
        // Get the pension
        restPensionMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewPension() throws Exception {
        // Initialize the database
        pensionRepository.saveAndFlush(pension);

        int databaseSizeBeforeUpdate = pensionRepository.findAll().size();

        // Update the pension
        Pension updatedPension = pensionRepository.findById(pension.getId()).get();
        // Disconnect from session so that the updates on updatedPension are not directly saved in db
        em.detach(updatedPension);
        updatedPension
            .pensionType(UPDATED_PENSION_TYPE)
            .startingDate(UPDATED_STARTING_DATE)
            .paymentMethod(UPDATED_PAYMENT_METHOD)
            .amount(UPDATED_AMOUNT);
        PensionDTO pensionDTO = pensionMapper.toDto(updatedPension);

        restPensionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, pensionDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(pensionDTO))
            )
            .andExpect(status().isOk());

        // Validate the Pension in the database
        List<Pension> pensionList = pensionRepository.findAll();
        assertThat(pensionList).hasSize(databaseSizeBeforeUpdate);
        Pension testPension = pensionList.get(pensionList.size() - 1);
        assertThat(testPension.getPensionType()).isEqualTo(UPDATED_PENSION_TYPE);
        assertThat(testPension.getStartingDate()).isEqualTo(UPDATED_STARTING_DATE);
        assertThat(testPension.getPaymentMethod()).isEqualTo(UPDATED_PAYMENT_METHOD);
        assertThat(testPension.getAmount()).isEqualTo(UPDATED_AMOUNT);
    }

    @Test
    @Transactional
    void putNonExistingPension() throws Exception {
        int databaseSizeBeforeUpdate = pensionRepository.findAll().size();
        pension.setId(count.incrementAndGet());

        // Create the Pension
        PensionDTO pensionDTO = pensionMapper.toDto(pension);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPensionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, pensionDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(pensionDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Pension in the database
        List<Pension> pensionList = pensionRepository.findAll();
        assertThat(pensionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPension() throws Exception {
        int databaseSizeBeforeUpdate = pensionRepository.findAll().size();
        pension.setId(count.incrementAndGet());

        // Create the Pension
        PensionDTO pensionDTO = pensionMapper.toDto(pension);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPensionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(pensionDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Pension in the database
        List<Pension> pensionList = pensionRepository.findAll();
        assertThat(pensionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPension() throws Exception {
        int databaseSizeBeforeUpdate = pensionRepository.findAll().size();
        pension.setId(count.incrementAndGet());

        // Create the Pension
        PensionDTO pensionDTO = pensionMapper.toDto(pension);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPensionMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(pensionDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Pension in the database
        List<Pension> pensionList = pensionRepository.findAll();
        assertThat(pensionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePensionWithPatch() throws Exception {
        // Initialize the database
        pensionRepository.saveAndFlush(pension);

        int databaseSizeBeforeUpdate = pensionRepository.findAll().size();

        // Update the pension using partial update
        Pension partialUpdatedPension = new Pension();
        partialUpdatedPension.setId(pension.getId());

        partialUpdatedPension.pensionType(UPDATED_PENSION_TYPE).amount(UPDATED_AMOUNT);

        restPensionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPension.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPension))
            )
            .andExpect(status().isOk());

        // Validate the Pension in the database
        List<Pension> pensionList = pensionRepository.findAll();
        assertThat(pensionList).hasSize(databaseSizeBeforeUpdate);
        Pension testPension = pensionList.get(pensionList.size() - 1);
        assertThat(testPension.getPensionType()).isEqualTo(UPDATED_PENSION_TYPE);
        assertThat(testPension.getStartingDate()).isEqualTo(DEFAULT_STARTING_DATE);
        assertThat(testPension.getPaymentMethod()).isEqualTo(DEFAULT_PAYMENT_METHOD);
        assertThat(testPension.getAmount()).isEqualByComparingTo(UPDATED_AMOUNT);
    }

    @Test
    @Transactional
    void fullUpdatePensionWithPatch() throws Exception {
        // Initialize the database
        pensionRepository.saveAndFlush(pension);

        int databaseSizeBeforeUpdate = pensionRepository.findAll().size();

        // Update the pension using partial update
        Pension partialUpdatedPension = new Pension();
        partialUpdatedPension.setId(pension.getId());

        partialUpdatedPension
            .pensionType(UPDATED_PENSION_TYPE)
            .startingDate(UPDATED_STARTING_DATE)
            .paymentMethod(UPDATED_PAYMENT_METHOD)
            .amount(UPDATED_AMOUNT);

        restPensionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPension.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPension))
            )
            .andExpect(status().isOk());

        // Validate the Pension in the database
        List<Pension> pensionList = pensionRepository.findAll();
        assertThat(pensionList).hasSize(databaseSizeBeforeUpdate);
        Pension testPension = pensionList.get(pensionList.size() - 1);
        assertThat(testPension.getPensionType()).isEqualTo(UPDATED_PENSION_TYPE);
        assertThat(testPension.getStartingDate()).isEqualTo(UPDATED_STARTING_DATE);
        assertThat(testPension.getPaymentMethod()).isEqualTo(UPDATED_PAYMENT_METHOD);
        assertThat(testPension.getAmount()).isEqualByComparingTo(UPDATED_AMOUNT);
    }

    @Test
    @Transactional
    void patchNonExistingPension() throws Exception {
        int databaseSizeBeforeUpdate = pensionRepository.findAll().size();
        pension.setId(count.incrementAndGet());

        // Create the Pension
        PensionDTO pensionDTO = pensionMapper.toDto(pension);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPensionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, pensionDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(pensionDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Pension in the database
        List<Pension> pensionList = pensionRepository.findAll();
        assertThat(pensionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPension() throws Exception {
        int databaseSizeBeforeUpdate = pensionRepository.findAll().size();
        pension.setId(count.incrementAndGet());

        // Create the Pension
        PensionDTO pensionDTO = pensionMapper.toDto(pension);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPensionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(pensionDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Pension in the database
        List<Pension> pensionList = pensionRepository.findAll();
        assertThat(pensionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPension() throws Exception {
        int databaseSizeBeforeUpdate = pensionRepository.findAll().size();
        pension.setId(count.incrementAndGet());

        // Create the Pension
        PensionDTO pensionDTO = pensionMapper.toDto(pension);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPensionMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(pensionDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Pension in the database
        List<Pension> pensionList = pensionRepository.findAll();
        assertThat(pensionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePension() throws Exception {
        // Initialize the database
        pensionRepository.saveAndFlush(pension);

        int databaseSizeBeforeDelete = pensionRepository.findAll().size();

        // Delete the pension
        restPensionMockMvc
            .perform(delete(ENTITY_API_URL_ID, pension.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Pension> pensionList = pensionRepository.findAll();
        assertThat(pensionList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
