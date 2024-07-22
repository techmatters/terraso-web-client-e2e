import { Page } from '@playwright/test';

import { ADMIN_URL } from '../config';

export const goToPage = async (page: Page) => {
  await page.goto(`${ADMIN_URL}/core/group/`);
};

export const showAllGroups = async (page: Page) => {
  const showAll = page.getByRole('link', { name: 'Show all' });
  if ((await showAll.count()) > 0) {
    await showAll.click();
  }
};

export const openGroup = async (page: Page, groupName: string) => {
  await page.getByRole('link', { name: groupName }).click();
};
