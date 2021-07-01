package com.dsirc.tests.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.dsirc.tests.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PensionTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Pension.class);
        Pension pension1 = new Pension();
        pension1.setId(1L);
        Pension pension2 = new Pension();
        pension2.setId(pension1.getId());
        assertThat(pension1).isEqualTo(pension2);
        pension2.setId(2L);
        assertThat(pension1).isNotEqualTo(pension2);
        pension1.setId(null);
        assertThat(pension1).isNotEqualTo(pension2);
    }
}
