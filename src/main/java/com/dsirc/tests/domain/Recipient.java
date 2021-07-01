package com.dsirc.tests.domain;

import com.dsirc.tests.domain.enumeration.Gender;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModel;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * Recipient entitled to Pension
 */
@ApiModel(description = "Recipient entitled to Pension")
@Entity
@Table(name = "recipient")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Recipient implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "first_name", nullable = false)
    private String firstName;

    @NotNull
    @Column(name = "last_name", nullable = false)
    private String lastName;

    @NotNull
    @Column(name = "birth_date", nullable = false)
    private LocalDate birthDate;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "gender", nullable = false)
    private Gender gender;

    @OneToMany(mappedBy = "recipient")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "recipient" }, allowSetters = true)
    private Set<Address> addresses = new HashSet<>();

    @OneToMany(mappedBy = "recipient")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "recipient" }, allowSetters = true)
    private Set<Contact> contacts = new HashSet<>();

    @JsonIgnoreProperties(value = { "recipient" }, allowSetters = true)
    @OneToOne(mappedBy = "recipient")
    private Pension pension;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Recipient id(Long id) {
        this.id = id;
        return this;
    }

    public String getFirstName() {
        return this.firstName;
    }

    public Recipient firstName(String firstName) {
        this.firstName = firstName;
        return this;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return this.lastName;
    }

    public Recipient lastName(String lastName) {
        this.lastName = lastName;
        return this;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public LocalDate getBirthDate() {
        return this.birthDate;
    }

    public Recipient birthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
        return this;
    }

    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }

    public Gender getGender() {
        return this.gender;
    }

    public Recipient gender(Gender gender) {
        this.gender = gender;
        return this;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public Set<Address> getAddresses() {
        return this.addresses;
    }

    public Recipient addresses(Set<Address> addresses) {
        this.setAddresses(addresses);
        return this;
    }

    public Recipient addAddress(Address address) {
        this.addresses.add(address);
        address.setRecipient(this);
        return this;
    }

    public Recipient removeAddress(Address address) {
        this.addresses.remove(address);
        address.setRecipient(null);
        return this;
    }

    public void setAddresses(Set<Address> addresses) {
        if (this.addresses != null) {
            this.addresses.forEach(i -> i.setRecipient(null));
        }
        if (addresses != null) {
            addresses.forEach(i -> i.setRecipient(this));
        }
        this.addresses = addresses;
    }

    public Set<Contact> getContacts() {
        return this.contacts;
    }

    public Recipient contacts(Set<Contact> contacts) {
        this.setContacts(contacts);
        return this;
    }

    public Recipient addContact(Contact contact) {
        this.contacts.add(contact);
        contact.setRecipient(this);
        return this;
    }

    public Recipient removeContact(Contact contact) {
        this.contacts.remove(contact);
        contact.setRecipient(null);
        return this;
    }

    public void setContacts(Set<Contact> contacts) {
        if (this.contacts != null) {
            this.contacts.forEach(i -> i.setRecipient(null));
        }
        if (contacts != null) {
            contacts.forEach(i -> i.setRecipient(this));
        }
        this.contacts = contacts;
    }

    public Pension getPension() {
        return this.pension;
    }

    public Recipient pension(Pension pension) {
        this.setPension(pension);
        return this;
    }

    public void setPension(Pension pension) {
        if (this.pension != null) {
            this.pension.setRecipient(null);
        }
        if (pension != null) {
            pension.setRecipient(this);
        }
        this.pension = pension;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Recipient)) {
            return false;
        }
        return id != null && id.equals(((Recipient) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Recipient{" +
            "id=" + getId() +
            ", firstName='" + getFirstName() + "'" +
            ", lastName='" + getLastName() + "'" +
            ", birthDate='" + getBirthDate() + "'" +
            ", gender='" + getGender() + "'" +
            "}";
    }
}
