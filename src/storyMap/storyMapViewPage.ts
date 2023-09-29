import { Page } from '@playwright/test';

export const editStoryMap = async (page: Page) => {
  await page.getByRole('link', { name: 'Edit Story Map' }).click();
};
