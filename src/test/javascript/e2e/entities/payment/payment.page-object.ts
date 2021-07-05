import { element, by, ElementFinder } from 'protractor';

export class PaymentComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-payment div table .btn-danger'));
  title = element.all(by.css('jhi-payment div h2#page-heading span')).first();
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

export class PaymentUpdatePage {
  pageTitle = element(by.id('jhi-payment-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  paymentsStatusSelect = element(by.id('field_paymentsStatus'));
  paymentDateInput = element(by.id('field_paymentDate'));

  pensionSelect = element(by.id('field_pension'));
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

  async setPaymentsStatusSelect(paymentsStatus: string): Promise<void> {
    await this.paymentsStatusSelect.sendKeys(paymentsStatus);
  }

  async getPaymentsStatusSelect(): Promise<string> {
    return await this.paymentsStatusSelect.element(by.css('option:checked')).getText();
  }

  async paymentsStatusSelectLastOption(): Promise<void> {
    await this.paymentsStatusSelect.all(by.tagName('option')).last().click();
  }

  async setPaymentDateInput(paymentDate: string): Promise<void> {
    await this.paymentDateInput.sendKeys(paymentDate);
  }

  async getPaymentDateInput(): Promise<string> {
    return await this.paymentDateInput.getAttribute('value');
  }

  async pensionSelectLastOption(): Promise<void> {
    await this.pensionSelect.all(by.tagName('option')).last().click();
  }

  async pensionSelectOption(option: string): Promise<void> {
    await this.pensionSelect.sendKeys(option);
  }

  getPensionSelect(): ElementFinder {
    return this.pensionSelect;
  }

  async getPensionSelectedOption(): Promise<string> {
    return await this.pensionSelect.element(by.css('option:checked')).getText();
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

export class PaymentDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-payment-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-payment'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
