import { Page } from '@playwright/test';
import path from 'path';

export const goToGroupPage = async (page: Page, slug: string) => {
  await page.goto(`/groups/${slug}/upload`);
};

export const addFile = async (page: Page, url: string, name: string) => {
  const dropZone = page.getByRole('button', {
    name: 'Accepted file formats: *.csv, *.doc, *.docx, *.geojson, *.gpx, *.jpeg, *.jpg, *.json, *.kml, *.kmz, *.pdf, *.png, *.ppt, *.pptx, *.xls, *.xlsx, *.zip Maximum file size: 50 MB',
  });
  const input = await dropZone.locator('input[type=file]');
  await input.setInputFiles(path.join(__dirname, url));

  const nameField = page.getByLabel('File Name');
  await nameField.click();
  await nameField.fill(name);

  await page.getByRole('button', { name: 'Share Files and Links' }).click();
};
