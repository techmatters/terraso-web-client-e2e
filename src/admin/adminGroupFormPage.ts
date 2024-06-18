import { Page } from '@playwright/test';

import * as groupListPage from './adminGroupListPage';

export const remove = async (page: Page) => {
  await page.getByRole('link', { name: 'Delete', exact: true }).click();
};

export const confirmRemove = async (page: Page) => {
  await page.getByRole('button', { name: 'Yes, I’m sure' }).click();
};

export const removeGroup = async (page: Page, groupName: string) => {
  await groupListPage.goToPage(page);
  await groupListPage.showAllGroups(page);
  await groupListPage.openGroup(page, groupName);
  await remove(page);
  await confirmRemove(page);
};
