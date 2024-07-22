import { Page } from '@playwright/test';

import { ADMIN_URL, ADMIN_USERNAME, ADMIN_PASSWORD } from '../config';

export const goToLoginPage = async (page: Page) => {
  await page.goto(`${ADMIN_URL}/login/`);
};

export const changeEmail = async (page: Page, value: string) => {
  const titleField = page.getByLabel('Email:');
  await titleField.click();
  await titleField.fill(value);
};

export const changePassword = async (page: Page, value: string) => {
  const titleField = page.getByLabel('Password:');
  await titleField.click();
  await titleField.fill(value);
};

export const login = async (page: Page) => {
  await goToLoginPage(page);
  await changeEmail(page, ADMIN_USERNAME as string);
  await changePassword(page, ADMIN_PASSWORD as string);
  await page.getByRole('button', { name: 'Log in' }).click();
};
