import { element, by, ElementFinder } from 'protractor';

export class AddressComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-address div table .btn-danger'));
  title = element.all(by.css('jhi-address div h2#page-heading span')).first();
  noResult = element(by.id('no-result'));
  entities = element(by.id('entities'));

  async clickOnCreateButton(): Promise<void> {
    await this.createButton.click();
  }

  async clickOnLastDeleteButton(): Promise<void> {
    await this.deleteButtons.last().click();
  }

  async countDeleteButtons(): Promise<number> {
    return this.deleteButtons.count();
  }

  async getTitle(): Promise<string> {
    return this.title.getAttribute('jhiTranslate');
  }
}

export class AddressUpdatePage {
  pageTitle = element(by.id('jhi-address-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  addressLine1Input = element(by.id('field_addressLine1'));
  addressLine2Input = element(by.id('field_addressLine2'));
  cityInput = element(by.id('field_city'));
  countryInput = element(by.id('field_country'));

  recipientSelect = element(by.id('field_recipient'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setAddressLine1Input(addressLine1: string): Promise<void> {
    await this.addressLine1Input.sendKeys(addressLine1);
  }

  async getAddressLine1Input(): Promise<string> {
    return await this.addressLine1Input.getAttribute('value');
  }

  async setAddressLine2Input(addressLine2: string): Promise<void> {
    await this.addressLine2Input.sendKeys(addressLine2);
  }

  async getAddressLine2Input(): Promise<string> {
    return await this.addressLine2Input.getAttribute('value');
  }

  async setCityInput(city: string): Promise<void> {
    await this.cityInput.sendKeys(city);
  }

  async getCityInput(): Promise<string> {
    return await this.cityInput.getAttribute('value');
  }

  async setCountryInput(country: string): Promise<void> {
    await this.countryInput.sendKeys(country);
  }

  async getCountryInput(): Promise<string> {
    return await this.countryInput.getAttribute('value');
  }

  async recipientSelectLastOption(): Promise<void> {
    await this.recipientSelect.all(by.tagName('option')).last().click();
  }

  async recipientSelectOption(option: string): Promise<void> {
    await this.recipientSelect.sendKeys(option);
  }

  getRecipientSelect(): ElementFinder {
    return this.recipientSelect;
  }

  async getRecipientSelectedOption(): Promise<string> {
    return await this.recipientSelect.element(by.css('option:checked')).getText();
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  getSaveButton(): ElementFinder {
    return this.saveButton;
  }
}

export class AddressDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-address-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-address'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
