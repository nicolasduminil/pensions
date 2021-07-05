package com.dsirc.tests.service.dto;

import com.dsirc.tests.domain.enumeration.PaymentMethod;
import com.dsirc.tests.domain.enumeration.PensionType;
import io.swagger.annotations.ApiModel;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Objects;
import javax.validation.constraints.*;

/**
 * A DTO for the {@link com.dsirc.tests.domain.Pension} entity.
 */
@ApiModel(description = "Recipient Pension")
public class PensionDTO implements Serializable {

    private Long id;

    @NotNull
    private PensionType pensionType;

    @NotNull
    private LocalDate startingDate;

    @NotNull
    private PaymentMethod paymentMethod;

    @NotNull
    private BigDecimal amount;

    private RecipientDTO recipient;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public PensionType getPensionType() {
        return pensionType;
    }

    public void setPensionType(PensionType pensionType) {
        this.pensionType = pensionType;
    }

    public LocalDate getStartingDate() {
        return startingDate;
    }

    public void setStartingDate(LocalDate startingDate) {
        this.startingDate = startingDate;
    }

    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
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
        if (!(o instanceof PensionDTO)) {
            return false;
        }

        PensionDTO pensionDTO = (PensionDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, pensionDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "PensionDTO{" +
            "id=" + getId() +
            ", pensionType='" + getPensionType() + "'" +
            ", startingDate='" + getStartingDate() + "'" +
            ", paymentMethod='" + getPaymentMethod() + "'" +
            ", amount=" + getAmount() +
            ", recipient=" + getRecipient() +
            "}";
    }
}
