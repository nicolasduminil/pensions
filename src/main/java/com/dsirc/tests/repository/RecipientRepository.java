package com.dsirc.tests.repository;

import com.dsirc.tests.domain.Recipient;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Recipient entity.
 */
@SuppressWarnings("unused")
@Repository
public interface RecipientRepository extends JpaRepository<Recipient, Long> {}
