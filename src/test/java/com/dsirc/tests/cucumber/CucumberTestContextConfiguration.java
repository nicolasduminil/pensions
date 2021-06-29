package com.dsirc.tests.cucumber;

import com.dsirc.tests.PensionsApp;
import io.cucumber.spring.CucumberContextConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.web.WebAppConfiguration;

@CucumberContextConfiguration
@SpringBootTest(classes = PensionsApp.class)
@WebAppConfiguration
public class CucumberTestContextConfiguration {}
