import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { RecipientComponentsPage, RecipientDeleteDialog, RecipientUpdatePage } from './recipient.page-object';

const expect = chai.expect;

describe('Recipient e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let recipientComponentsPage: RecipientComponentsPage;
  let recipientUpdatePage: RecipientUpdatePage;
  let recipientDeleteDialog: RecipientDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Recipients', async () => {
    await navBarPage.goToEntity('recipient');
    recipientComponentsPage = new RecipientComponentsPage();
    await browser.wait(ec.visibilityOf(recipientComponentsPage.title), 5000);
    expect(await recipientComponentsPage.getTitle()).to.eq('pensionsApp.recipient.home.title');
    await browser.wait(ec.or(ec.visibilityOf(recipientComponentsPage.entities), ec.visibilityOf(recipientComponentsPage.noResult)), 1000);
  });

  it('should load create Recipient page', async () => {
    await recipientComponentsPage.clickOnCreateButton();
    recipientUpdatePage = new RecipientUpdatePage();
    expect(await recipientUpdatePage.getPageTitle()).to.eq('pensionsApp.recipient.home.createOrEditLabel');
    await recipientUpdatePage.cancel();
  });

  it('should create and save Recipients', async () => {
    const nbButtonsBeforeCreate = await recipientComponentsPage.countDeleteButtons();

    await recipientComponentsPage.clickOnCreateButton();

    await promise.all([
      recipientUpdatePage.setFirstNameInput('firstName'),
      recipientUpdatePage.setLastNameInput('lastName'),
      recipientUpdatePage.setBirthDateInput('2000-12-31'),
      recipientUpdatePage.genderSelectLastOption(),
    ]);

    await recipientUpdatePage.save();
    expect(await recipientUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await recipientComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Recipient', async () => {
    const nbButtonsBeforeDelete = await recipientComponentsPage.countDeleteButtons();
    await recipientComponentsPage.clickOnLastDeleteButton();

    recipientDeleteDialog = new RecipientDeleteDialog();
    expect(await recipientDeleteDialog.getDialogTitle()).to.eq('pensionsApp.recipient.delete.question');
    await recipientDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(recipientComponentsPage.title), 5000);

    expect(await recipientComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
