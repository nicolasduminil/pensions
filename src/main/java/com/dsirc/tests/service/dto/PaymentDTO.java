package com.dsirc.tests.service.dto;

import com.dsirc.tests.domain.enumeration.PaymentStatus;
import io.swagger.annotations.ApiModel;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;
import javax.validation.constraints.*;

/**
 * A DTO for the {@link com.dsirc.tests.domain.Payment} entity.
 */
@ApiModel(description = "Pension Payment")
public class PaymentDTO implements Serializable {

    private Long id;

    @NotNull
    private PaymentStatus paymentsStatus;

    @NotNull
    private LocalDate paymentDate;

    private PensionDTO pension;

    private RecipientDTO recipient;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public PaymentStatus getPaymentsStatus() {
        return paymentsStatus;
    }

    public void setPaymentsStatus(PaymentStatus paymentsStatus) {
        this.paymentsStatus = paymentsStatus;
    }

    public LocalDate getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(LocalDate paymentDate) {
        this.paymentDate = paymentDate;
    }

    public PensionDTO getPension() {
        return pension;
    }

    public void setPension(PensionDTO pension) {
        this.pension = pension;
    }

    public RecipientDTO getRecipient() {
        return recipient;
    }

    public void setRecipient(RecipientDTO recipient) {
        this.recipient = recipient;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof PaymentDTO)) {
            return false;
        }

        PaymentDTO paymentDTO = (PaymentDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, paymentDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "PaymentDTO{" +
            "id=" + getId() +
            ", paymentsStatus='" + getPaymentsStatus() + "'" +
            ", paymentDate='" + getPaymentDate() + "'" +
            ", pension=" + getPension() +
            ", recipient=" + getRecipient() +
            "}";
    }
}
