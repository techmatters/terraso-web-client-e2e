import { Page } from '@playwright/test';

export const goToPage = async (page: Page, slug: string) => {
  await page.goto(`/groups/${slug}/map/new`);
};

export const selectFile = async (page: Page, name: string) => {
  await page.getByRole('radio', { name }).click();
  await page.getByRole('button', { name: 'Next' }).click();
};

export const setAppereance = async (
  page: Page,
  shape: string,
  size: string,
  color: string,
  opacity?: string,
) => {
  await page.getByRole('button', { name: shape }).click();

  const sizeField = page.getByRole('spinbutton', { name: 'Symbol Size:' });
  await sizeField.fill(size);

  const colorField = page.getByLabel('Color');
  await colorField.fill(color);

  if (opacity) {
    const opacityField = page.getByLabel('Opacity');
    await opacityField.fill(opacity);
  }
};

export const changeBaseMap = async (page: Page, baseMap: string) => {
  await page.getByRole('button', { name: 'Base map' }).click();
  const menu = page.getByRole('menu', { name: 'Base map' });
  await menu.getByRole('menuitem', { name: baseMap, exact: true }).click();
};

export const setTitle = async (page: Page, title: string) => {
  const field = page.getByLabel('Map Title');
  await field.fill(title);
};

export const setDescription = async (page: Page, description: string) => {
  const field = page.getByLabel('Map Description');
  await field.fill(description);
};

export const zoomIn = async (page: Page) => {
  await page.getByRole('button', { name: 'Zoom in' }).click();
};

export const setDataColumnsOption = async (page: Page, option: string) => {
  await page.getByRole('radio', { name: option }).click();
};

export const setDataColumnsHeaders = async (
  page: Page,
  headers: { [key: string]: string },
) => {
  // await page.getByPlaceholder('socio_clave_busqueda').click();
  // await page.getByPlaceholder('socio_clave_busqueda').fill('Jose');
  for (const [key, value] of Object.entries(headers)) {
    const field = page.getByPlaceholder(key);
    await field.fill(value);
  }
};
