import { Page } from '@playwright/test';

export const goToCreatePage = async (page: Page) => {
  await page.goto('/groups/new');
};

export const goToUpdatePage = async (page: Page, slug: string) => {
  await page.goto(`/groups/${slug}`);
};

export const changeTextField = async (
  page: Page,
  field: string,
  value: string
) => {
  const titleField = page.getByLabel(field);
  await titleField.click();
  await titleField.fill(value);
};

export const createGroup = async (page: Page) => {
  await page.getByRole('button', { name: 'Create Group' }).click();
};
