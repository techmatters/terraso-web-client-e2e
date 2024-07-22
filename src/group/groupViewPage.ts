import { Page } from '@playwright/test';

export const goToPage = async (page: Page, slug: string) => {
  await page.goto(`/groups/${slug}`);
};

export const deleteSharedData = async (
  page: Page,
  groupSlug: string,
  name: string,
) => {
  await goToPage(page, groupSlug);
  await page.getByRole('button', { name: `Delete file “${name}”.` }).click();
  await page.getByRole('button', { name: 'Delete File' }).click();
};
