package com.dsirc.tests.service.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class PensionMapperTest {

    private PensionMapper pensionMapper;

    @BeforeEach
    public void setUp() {
        pensionMapper = new PensionMapperImpl();
    }
}
