package com.dsirc.tests.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.dsirc.tests.IntegrationTest;
import com.dsirc.tests.domain.Recipient;
import com.dsirc.tests.domain.enumeration.Gender;
import com.dsirc.tests.repository.RecipientRepository;
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
 * Integration tests for the {@link RecipientResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class RecipientResourceIT {

    private static final String DEFAULT_FIRST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_FIRST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_LAST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_LAST_NAME = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_BIRTH_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_BIRTH_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final Gender DEFAULT_GENDER = Gender.MALE;
    private static final Gender UPDATED_GENDER = Gender.FEMALE;

    private static final String ENTITY_API_URL = "/api/recipients";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private RecipientRepository recipientRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restRecipientMockMvc;

    private Recipient recipient;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Recipient createEntity(EntityManager em) {
        Recipient recipient = new Recipient()
            .firstName(DEFAULT_FIRST_NAME)
            .lastName(DEFAULT_LAST_NAME)
            .birthDate(DEFAULT_BIRTH_DATE)
            .gender(DEFAULT_GENDER);
        return recipient;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Recipient createUpdatedEntity(EntityManager em) {
        Recipient recipient = new Recipient()
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .birthDate(UPDATED_BIRTH_DATE)
            .gender(UPDATED_GENDER);
        return recipient;
    }

    @BeforeEach
    public void initTest() {
        recipient = createEntity(em);
    }

    @Test
    @Transactional
    void createRecipient() throws Exception {
        int databaseSizeBeforeCreate = recipientRepository.findAll().size();
        // Create the Recipient
        restRecipientMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(recipient)))
            .andExpect(status().isCreated());

        // Validate the Recipient in the database
        List<Recipient> recipientList = recipientRepository.findAll();
        assertThat(recipientList).hasSize(databaseSizeBeforeCreate + 1);
        Recipient testRecipient = recipientList.get(recipientList.size() - 1);
        assertThat(testRecipient.getFirstName()).isEqualTo(DEFAULT_FIRST_NAME);
        assertThat(testRecipient.getLastName()).isEqualTo(DEFAULT_LAST_NAME);
        assertThat(testRecipient.getBirthDate()).isEqualTo(DEFAULT_BIRTH_DATE);
        assertThat(testRecipient.getGender()).isEqualTo(DEFAULT_GENDER);
    }

    @Test
    @Transactional
    void createRecipientWithExistingId() throws Exception {
        // Create the Recipient with an existing ID
        recipient.setId(1L);

        int databaseSizeBeforeCreate = recipientRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restRecipientMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(recipient)))
            .andExpect(status().isBadRequest());

        // Validate the Recipient in the database
        List<Recipient> recipientList = recipientRepository.findAll();
        assertThat(recipientList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkFirstNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = recipientRepository.findAll().size();
        // set the field null
        recipient.setFirstName(null);

        // Create the Recipient, which fails.

        restRecipientMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(recipient)))
            .andExpect(status().isBadRequest());

        List<Recipient> recipientList = recipientRepository.findAll();
        assertThat(recipientList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkLastNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = recipientRepository.findAll().size();
        // set the field null
        recipient.setLastName(null);

        // Create the Recipient, which fails.

        restRecipientMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(recipient)))
            .andExpect(status().isBadRequest());

        List<Recipient> recipientList = recipientRepository.findAll();
        assertThat(recipientList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkBirthDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = recipientRepository.findAll().size();
        // set the field null
        recipient.setBirthDate(null);

        // Create the Recipient, which fails.

        restRecipientMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(recipient)))
            .andExpect(status().isBadRequest());

        List<Recipient> recipientList = recipientRepository.findAll();
        assertThat(recipientList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkGenderIsRequired() throws Exception {
        int databaseSizeBeforeTest = recipientRepository.findAll().size();
        // set the field null
        recipient.setGender(null);

        // Create the Recipient, which fails.

        restRecipientMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(recipient)))
            .andExpect(status().isBadRequest());

        List<Recipient> recipientList = recipientRepository.findAll();
        assertThat(recipientList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllRecipients() throws Exception {
        // Initialize the database
        recipientRepository.saveAndFlush(recipient);

        // Get all the recipientList
        restRecipientMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(recipient.getId().intValue())))
            .andExpect(jsonPath("$.[*].firstName").value(hasItem(DEFAULT_FIRST_NAME)))
            .andExpect(jsonPath("$.[*].lastName").value(hasItem(DEFAULT_LAST_NAME)))
            .andExpect(jsonPath("$.[*].birthDate").value(hasItem(DEFAULT_BIRTH_DATE.toString())))
            .andExpect(jsonPath("$.[*].gender").value(hasItem(DEFAULT_GENDER.toString())));
    }

    @Test
    @Transactional
    void getRecipient() throws Exception {
        // Initialize the database
        recipientRepository.saveAndFlush(recipient);

        // Get the recipient
        restRecipientMockMvc
            .perform(get(ENTITY_API_URL_ID, recipient.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(recipient.getId().intValue()))
            .andExpect(jsonPath("$.firstName").value(DEFAULT_FIRST_NAME))
            .andExpect(jsonPath("$.lastName").value(DEFAULT_LAST_NAME))
            .andExpect(jsonPath("$.birthDate").value(DEFAULT_BIRTH_DATE.toString()))
            .andExpect(jsonPath("$.gender").value(DEFAULT_GENDER.toString()));
    }

    @Test
    @Transactional
    void getNonExistingRecipient() throws Exception {
        // Get the recipient
        restRecipientMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewRecipient() throws Exception {
        // Initialize the database
        recipientRepository.saveAndFlush(recipient);

        int databaseSizeBeforeUpdate = recipientRepository.findAll().size();

        // Update the recipient
        Recipient updatedRecipient = recipientRepository.findById(recipient.getId()).get();
        // Disconnect from session so that the updates on updatedRecipient are not directly saved in db
        em.detach(updatedRecipient);
        updatedRecipient.firstName(UPDATED_FIRST_NAME).lastName(UPDATED_LAST_NAME).birthDate(UPDATED_BIRTH_DATE).gender(UPDATED_GENDER);

        restRecipientMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedRecipient.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedRecipient))
            )
            .andExpect(status().isOk());

        // Validate the Recipient in the database
        List<Recipient> recipientList = recipientRepository.findAll();
        assertThat(recipientList).hasSize(databaseSizeBeforeUpdate);
        Recipient testRecipient = recipientList.get(recipientList.size() - 1);
        assertThat(testRecipient.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testRecipient.getLastName()).isEqualTo(UPDATED_LAST_NAME);
        assertThat(testRecipient.getBirthDate()).isEqualTo(UPDATED_BIRTH_DATE);
        assertThat(testRecipient.getGender()).isEqualTo(UPDATED_GENDER);
    }

    @Test
    @Transactional
    void putNonExistingRecipient() throws Exception {
        int databaseSizeBeforeUpdate = recipientRepository.findAll().size();
        recipient.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRecipientMockMvc
            .perform(
                put(ENTITY_API_URL_ID, recipient.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(recipient))
            )
            .andExpect(status().isBadRequest());

        // Validate the Recipient in the database
        List<Recipient> recipientList = recipientRepository.findAll();
        assertThat(recipientList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchRecipient() throws Exception {
        int databaseSizeBeforeUpdate = recipientRepository.findAll().size();
        recipient.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRecipientMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(recipient))
            )
            .andExpect(status().isBadRequest());

        // Validate the Recipient in the database
        List<Recipient> recipientList = recipientRepository.findAll();
        assertThat(recipientList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamRecipient() throws Exception {
        int databaseSizeBeforeUpdate = recipientRepository.findAll().size();
        recipient.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRecipientMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(recipient)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Recipient in the database
        List<Recipient> recipientList = recipientRepository.findAll();
        assertThat(recipientList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateRecipientWithPatch() throws Exception {
        // Initialize the database
        recipientRepository.saveAndFlush(recipient);

        int databaseSizeBeforeUpdate = recipientRepository.findAll().size();

        // Update the recipient using partial update
        Recipient partialUpdatedRecipient = new Recipient();
        partialUpdatedRecipient.setId(recipient.getId());

        restRecipientMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRecipient.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRecipient))
            )
            .andExpect(status().isOk());

        // Validate the Recipient in the database
        List<Recipient> recipientList = recipientRepository.findAll();
        assertThat(recipientList).hasSize(databaseSizeBeforeUpdate);
        Recipient testRecipient = recipientList.get(recipientList.size() - 1);
        assertThat(testRecipient.getFirstName()).isEqualTo(DEFAULT_FIRST_NAME);
        assertThat(testRecipient.getLastName()).isEqualTo(DEFAULT_LAST_NAME);
        assertThat(testRecipient.getBirthDate()).isEqualTo(DEFAULT_BIRTH_DATE);
        assertThat(testRecipient.getGender()).isEqualTo(DEFAULT_GENDER);
    }

    @Test
    @Transactional
    void fullUpdateRecipientWithPatch() throws Exception {
        // Initialize the database
        recipientRepository.saveAndFlush(recipient);

        int databaseSizeBeforeUpdate = recipientRepository.findAll().size();

        // Update the recipient using partial update
        Recipient partialUpdatedRecipient = new Recipient();
        partialUpdatedRecipient.setId(recipient.getId());

        partialUpdatedRecipient
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .birthDate(UPDATED_BIRTH_DATE)
            .gender(UPDATED_GENDER);

        restRecipientMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRecipient.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRecipient))
            )
            .andExpect(status().isOk());

        // Validate the Recipient in the database
        List<Recipient> recipientList = recipientRepository.findAll();
        assertThat(recipientList).hasSize(databaseSizeBeforeUpdate);
        Recipient testRecipient = recipientList.get(recipientList.size() - 1);
        assertThat(testRecipient.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testRecipient.getLastName()).isEqualTo(UPDATED_LAST_NAME);
        assertThat(testRecipient.getBirthDate()).isEqualTo(UPDATED_BIRTH_DATE);
        assertThat(testRecipient.getGender()).isEqualTo(UPDATED_GENDER);
    }

    @Test
    @Transactional
    void patchNonExistingRecipient() throws Exception {
        int databaseSizeBeforeUpdate = recipientRepository.findAll().size();
        recipient.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRecipientMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, recipient.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(recipient))
            )
            .andExpect(status().isBadRequest());

        // Validate the Recipient in the database
        List<Recipient> recipientList = recipientRepository.findAll();
        assertThat(recipientList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchRecipient() throws Exception {
        int databaseSizeBeforeUpdate = recipientRepository.findAll().size();
        recipient.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRecipientMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(recipient))
            )
            .andExpect(status().isBadRequest());

        // Validate the Recipient in the database
        List<Recipient> recipientList = recipientRepository.findAll();
        assertThat(recipientList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamRecipient() throws Exception {
        int databaseSizeBeforeUpdate = recipientRepository.findAll().size();
        recipient.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRecipientMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(recipient))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Recipient in the database
        List<Recipient> recipientList = recipientRepository.findAll();
        assertThat(recipientList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteRecipient() throws Exception {
        // Initialize the database
        recipientRepository.saveAndFlush(recipient);

        int databaseSizeBeforeDelete = recipientRepository.findAll().size();

        // Delete the recipient
        restRecipientMockMvc
            .perform(delete(ENTITY_API_URL_ID, recipient.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Recipient> recipientList = recipientRepository.findAll();
        assertThat(recipientList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
