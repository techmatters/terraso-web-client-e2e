import { Page } from '@playwright/test';

export const goToHome = async (page: Page) => {
  await page.goto('/');
};

export const createNewStoryMap = async (page: Page) => {
  await page.getByRole('link', { name: 'Create new story map' }).click();
};
