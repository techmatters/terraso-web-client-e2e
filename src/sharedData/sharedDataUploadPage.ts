import { Page } from '@playwright/test';
import path from 'path';

const FILE_FORMATS = [
  'csv',
  'doc',
  'docx',
  'geojson',
  'gpx',
  'jpeg',
  'jpg',
  'json',
  'kml',
  'kmz',
  'pdf',
  'png',
  'ppt',
  'pptx',
  'xls',
  'xlsx',
  'zip',
];
const FILE_FORMATS_TEXT = FILE_FORMATS.map(format => `*.${format}`).join(', ');

export const goToGroupPage = async (page: Page, slug: string) => {
  await page.goto(`/groups/${slug}/upload`);
};

export const addFile = async (page: Page, url: string, name: string) => {
  const dropZone = page.getByRole('button', {
    name: `Accepted file formats: ${FILE_FORMATS_TEXT} Maximum file size: 50 MB`,
  });
  const input = dropZone.locator('input[type=file]');
  await input.setInputFiles(path.join(__dirname, url));

  const nameField = page.getByLabel('File Name');
  await nameField.click();
  await nameField.fill(name);

  await page.getByRole('button', { name: 'Share Files and Links' }).click();
};
