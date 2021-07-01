package com.dsirc.tests.domain;

import com.dsirc.tests.domain.enumeration.PaymentStatus;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModel;
import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * Pension Payment
 */
@ApiModel(description = "Pension Payment")
@Entity
@Table(name = "payment")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Payment implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "payments_status", nullable = false)
    private PaymentStatus paymentsStatus;

    @NotNull
    @Column(name = "payment_date", nullable = false)
    private LocalDate paymentDate;

    @JsonIgnoreProperties(value = { "recipient" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Pension pension;

    @JsonIgnoreProperties(value = { "addresses", "contacts", "pension" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Recipient receipient;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Payment id(Long id) {
        this.id = id;
        return this;
    }

    public PaymentStatus getPaymentsStatus() {
        return this.paymentsStatus;
    }

    public Payment paymentsStatus(PaymentStatus paymentsStatus) {
        this.paymentsStatus = paymentsStatus;
        return this;
    }

    public void setPaymentsStatus(PaymentStatus paymentsStatus) {
        this.paymentsStatus = paymentsStatus;
    }

    public LocalDate getPaymentDate() {
        return this.paymentDate;
    }

    public Payment paymentDate(LocalDate paymentDate) {
        this.paymentDate = paymentDate;
        return this;
    }

    public void setPaymentDate(LocalDate paymentDate) {
        this.paymentDate = paymentDate;
    }

    public Pension getPension() {
        return this.pension;
    }

    public Payment pension(Pension pension) {
        this.setPension(pension);
        return this;
    }

    public void setPension(Pension pension) {
        this.pension = pension;
    }

    public Recipient getReceipient() {
        return this.receipient;
    }

    public Payment receipient(Recipient recipient) {
        this.setReceipient(recipient);
        return this;
    }

    public void setReceipient(Recipient recipient) {
        this.receipient = recipient;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Payment)) {
            return false;
        }
        return id != null && id.equals(((Payment) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Payment{" +
            "id=" + getId() +
            ", paymentsStatus='" + getPaymentsStatus() + "'" +
            ", paymentDate='" + getPaymentDate() + "'" +
            "}";
    }
}
