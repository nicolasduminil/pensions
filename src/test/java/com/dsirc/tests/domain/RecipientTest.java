package com.dsirc.tests.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.dsirc.tests.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class RecipientTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Recipient.class);
        Recipient recipient1 = new Recipient();
        recipient1.setId(1L);
        Recipient recipient2 = new Recipient();
        recipient2.setId(recipient1.getId());
        assertThat(recipient1).isEqualTo(recipient2);
        recipient2.setId(2L);
        assertThat(recipient1).isNotEqualTo(recipient2);
        recipient1.setId(null);
        assertThat(recipient1).isNotEqualTo(recipient2);
    }
}
