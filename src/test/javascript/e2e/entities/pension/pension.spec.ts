import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { PensionComponentsPage, PensionDeleteDialog, PensionUpdatePage } from './pension.page-object';

const expect = chai.expect;

describe('Pension e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let pensionComponentsPage: PensionComponentsPage;
  let pensionUpdatePage: PensionUpdatePage;
  let pensionDeleteDialog: PensionDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Pensions', async () => {
    await navBarPage.goToEntity('pension');
    pensionComponentsPage = new PensionComponentsPage();
    await browser.wait(ec.visibilityOf(pensionComponentsPage.title), 5000);
    expect(await pensionComponentsPage.getTitle()).to.eq('pensionsApp.pension.home.title');
    await browser.wait(ec.or(ec.visibilityOf(pensionComponentsPage.entities), ec.visibilityOf(pensionComponentsPage.noResult)), 1000);
  });

  it('should load create Pension page', async () => {
    await pensionComponentsPage.clickOnCreateButton();
    pensionUpdatePage = new PensionUpdatePage();
    expect(await pensionUpdatePage.getPageTitle()).to.eq('pensionsApp.pension.home.createOrEditLabel');
    await pensionUpdatePage.cancel();
  });

  it('should create and save Pensions', async () => {
    const nbButtonsBeforeCreate = await pensionComponentsPage.countDeleteButtons();

    await pensionComponentsPage.clickOnCreateButton();

    await promise.all([
      pensionUpdatePage.pensionTypeSelectLastOption(),
      pensionUpdatePage.setStartingDateInput('2000-12-31'),
      pensionUpdatePage.paymentMethodSelectLastOption(),
      pensionUpdatePage.setAmountInput('5'),
      pensionUpdatePage.recipientSelectLastOption(),
    ]);

    await pensionUpdatePage.save();
    expect(await pensionUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await pensionComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Pension', async () => {
    const nbButtonsBeforeDelete = await pensionComponentsPage.countDeleteButtons();
    await pensionComponentsPage.clickOnLastDeleteButton();

    pensionDeleteDialog = new PensionDeleteDialog();
    expect(await pensionDeleteDialog.getDialogTitle()).to.eq('pensionsApp.pension.delete.question');
    await pensionDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(pensionComponentsPage.title), 5000);

    expect(await pensionComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
