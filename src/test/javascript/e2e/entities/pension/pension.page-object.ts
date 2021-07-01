import { element, by, ElementFinder } from 'protractor';

export class PensionComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-pension div table .btn-danger'));
  title = element.all(by.css('jhi-pension div h2#page-heading span')).first();
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

export class PensionUpdatePage {
  pageTitle = element(by.id('jhi-pension-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  pensionTypeSelect = element(by.id('field_pensionType'));
  startingDateInput = element(by.id('field_startingDate'));
  paymentMethodSelect = element(by.id('field_paymentMethod'));
  amountInput = element(by.id('field_amount'));

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

  async setPensionTypeSelect(pensionType: string): Promise<void> {
    await this.pensionTypeSelect.sendKeys(pensionType);
  }

  async getPensionTypeSelect(): Promise<string> {
    return await this.pensionTypeSelect.element(by.css('option:checked')).getText();
  }

  async pensionTypeSelectLastOption(): Promise<void> {
    await this.pensionTypeSelect.all(by.tagName('option')).last().click();
  }

  async setStartingDateInput(startingDate: string): Promise<void> {
    await this.startingDateInput.sendKeys(startingDate);
  }

  async getStartingDateInput(): Promise<string> {
    return await this.startingDateInput.getAttribute('value');
  }

  async setPaymentMethodSelect(paymentMethod: string): Promise<void> {
    await this.paymentMethodSelect.sendKeys(paymentMethod);
  }

  async getPaymentMethodSelect(): Promise<string> {
    return await this.paymentMethodSelect.element(by.css('option:checked')).getText();
  }

  async paymentMethodSelectLastOption(): Promise<void> {
    await this.paymentMethodSelect.all(by.tagName('option')).last().click();
  }

  async setAmountInput(amount: string): Promise<void> {
    await this.amountInput.sendKeys(amount);
  }

  async getAmountInput(): Promise<string> {
    return await this.amountInput.getAttribute('value');
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

export class PensionDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-pension-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-pension'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
