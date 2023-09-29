import { Page } from '@playwright/test';

export const getMainNavigation = async (page: Page) => {
  return page.getByRole('navigation', { name: 'Main' });
};

export const goToLandscapes = async (page: Page) => {
  const main = await getMainNavigation(page);
  await main.getByRole('link', { name: 'Landscapes' }).click();
};
