package com.dsirc.tests.domain;

import com.dsirc.tests.domain.enumeration.PaymentMethod;
import com.dsirc.tests.domain.enumeration.PensionType;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModel;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * Recipient Pension
 */
@ApiModel(description = "Recipient Pension")
@Entity
@Table(name = "pension")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Pension implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "pension_type", nullable = false)
    private PensionType pensionType;

    @NotNull
    @Column(name = "starting_date", nullable = false)
    private LocalDate startingDate;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", nullable = false)
    private PaymentMethod paymentMethod;

    @NotNull
    @Column(name = "amount", precision = 21, scale = 2, nullable = false)
    private BigDecimal amount;

    @JsonIgnoreProperties(value = { "addresses", "contacts", "pension" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Recipient recipient;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Pension id(Long id) {
        this.id = id;
        return this;
    }

    public PensionType getPensionType() {
        return this.pensionType;
    }

    public Pension pensionType(PensionType pensionType) {
        this.pensionType = pensionType;
        return this;
    }

    public void setPensionType(PensionType pensionType) {
        this.pensionType = pensionType;
    }

    public LocalDate getStartingDate() {
        return this.startingDate;
    }

    public Pension startingDate(LocalDate startingDate) {
        this.startingDate = startingDate;
        return this;
    }

    public void setStartingDate(LocalDate startingDate) {
        this.startingDate = startingDate;
    }

    public PaymentMethod getPaymentMethod() {
        return this.paymentMethod;
    }

    public Pension paymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
        return this;
    }

    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public BigDecimal getAmount() {
        return this.amount;
    }

    public Pension amount(BigDecimal amount) {
        this.amount = amount;
        return this;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public Recipient getRecipient() {
        return this.recipient;
    }

    public Pension recipient(Recipient recipient) {
        this.setRecipient(recipient);
        return this;
    }

    public void setRecipient(Recipient recipient) {
        this.recipient = recipient;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Pension)) {
            return false;
        }
        return id != null && id.equals(((Pension) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Pension{" +
            "id=" + getId() +
            ", pensionType='" + getPensionType() + "'" +
            ", startingDate='" + getStartingDate() + "'" +
            ", paymentMethod='" + getPaymentMethod() + "'" +
            ", amount=" + getAmount() +
            "}";
    }
}
