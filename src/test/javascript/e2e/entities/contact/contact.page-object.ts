import { element, by, ElementFinder } from 'protractor';

export class ContactComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-contact div table .btn-danger'));
  title = element.all(by.css('jhi-contact div h2#page-heading span')).first();
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

export class ContactUpdatePage {
  pageTitle = element(by.id('jhi-contact-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  emailInput = element(by.id('field_email'));
  phoneInput = element(by.id('field_phone'));

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

  async setEmailInput(email: string): Promise<void> {
    await this.emailInput.sendKeys(email);
  }

  async getEmailInput(): Promise<string> {
    return await this.emailInput.getAttribute('value');
  }

  async setPhoneInput(phone: string): Promise<void> {
    await this.phoneInput.sendKeys(phone);
  }

  async getPhoneInput(): Promise<string> {
    return await this.phoneInput.getAttribute('value');
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

export class ContactDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-contact-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-contact'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
