package com.dsirc.tests.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.dsirc.tests.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class RecipientDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(RecipientDTO.class);
        RecipientDTO recipientDTO1 = new RecipientDTO();
        recipientDTO1.setId(1L);
        RecipientDTO recipientDTO2 = new RecipientDTO();
        assertThat(recipientDTO1).isNotEqualTo(recipientDTO2);
        recipientDTO2.setId(recipientDTO1.getId());
        assertThat(recipientDTO1).isEqualTo(recipientDTO2);
        recipientDTO2.setId(2L);
        assertThat(recipientDTO1).isNotEqualTo(recipientDTO2);
        recipientDTO1.setId(null);
        assertThat(recipientDTO1).isNotEqualTo(recipientDTO2);
    }
}
