import { Page } from '@playwright/test';

import { ADMIN_URL } from '../config';

export const goToPage = async (page: Page) => {
  await page.goto(`${ADMIN_URL}/core/group/`);
};

export const showLatestGroups = async (page: Page) => {
  await page
    .getByRole('link', {
      name: /created at/i,
    })
    .click();
};

export const openGroup = async (page: Page, groupName: string) => {
  await page.getByRole('link', { name: groupName }).click();
};
