package com.dsirc.tests.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.dsirc.tests.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PensionDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(PensionDTO.class);
        PensionDTO pensionDTO1 = new PensionDTO();
        pensionDTO1.setId(1L);
        PensionDTO pensionDTO2 = new PensionDTO();
        assertThat(pensionDTO1).isNotEqualTo(pensionDTO2);
        pensionDTO2.setId(pensionDTO1.getId());
        assertThat(pensionDTO1).isEqualTo(pensionDTO2);
        pensionDTO2.setId(2L);
        assertThat(pensionDTO1).isNotEqualTo(pensionDTO2);
        pensionDTO1.setId(null);
        assertThat(pensionDTO1).isNotEqualTo(pensionDTO2);
    }
}
