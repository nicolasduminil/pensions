package com.dsirc.tests.repository;

import com.dsirc.tests.domain.Pension;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Pension entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PensionRepository extends JpaRepository<Pension, Long> {}
