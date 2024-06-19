import { test as baseTest, expect } from '@playwright/test';
import fs from 'fs';
import { setAuthCookie } from '../../auth';
import { EXECUTION_ID } from '../../config';
import * as groupFormPage from '../../group/groupFormPage';
import * as groupViewPage from '../../group/groupViewPage';
import * as sharedDataUploadPage from '../../sharedData/sharedDataUploadPage';
import * as adminLoginPage from '../../admin/adminLoginPage';
import * as adminGroupFormPage from '../../admin/adminGroupFormPage';
import * as visualizationFormPage from '../visualization/visualizationFormPage';

const test = baseTest.extend({
  group: async ({ page }, use) => {
    const name = `PW - Group Test ${EXECUTION_ID}`;
    const slug = `pw-group-test-${EXECUTION_ID}`;

    await groupFormPage.goToCreatePage(page);
    await groupFormPage.changeTextField(page, 'Name', name);
    await groupFormPage.changeTextField(
      page,
      'Description',
      'Test Description'
    );
    await groupFormPage.createGroup(page);

    await use({ name, slug });
    await adminLoginPage.login(page);
    await adminGroupFormPage.removeGroup(page, name);
  },
  sharedDataGis: async ({ page, group }, use) => {
    const name = `PW - SharedData GIS Test ${EXECUTION_ID}`;
    await sharedDataUploadPage.goToGroupPage(page, group.slug);
    await sharedDataUploadPage.addFile(
      page,
      'files/BARRANCOS_MANCHENO.kmz',
      name
    );
    await use({ name, filename: `${name}.kmz`, fileSize: 3121, group });
    await groupViewPage.deleteSharedData(page, group.slug, name);
  },
  sharedDataDataSet: async ({ page, group }, use) => {
    const name = `PW - SharedData DataSet Test ${EXECUTION_ID}`;
    await sharedDataUploadPage.goToGroupPage(page, group.slug);
    await sharedDataUploadPage.addFile(page, 'files/test-file.xlsx', name);
    await use({ name, filename: `${name}.xlsx`, fileSize: 30453, group });
    await groupViewPage.deleteSharedData(page, group.slug, name);
  },
});

test.beforeEach(async ({ context }) => {
  await setAuthCookie(context);
});

test('Visualization: Create a map (GIS)', async ({
  page,
  sharedDataGis: sharedData,
}) => {
  const { group } = sharedData;
  const visiualizationTitle = `PW - Map ${EXECUTION_ID}`;
  const visualizationSlug = `pw-map-${EXECUTION_ID}`;
  await groupViewPage.goToPage(page, group.slug);

  await visualizationFormPage.goToPage(page, group.slug);

  // Select File
  await visualizationFormPage.selectFile(page, sharedData.name);

  // Appereance
  await visualizationFormPage.setAppereance(
    page,
    'Hexagon',
    '20',
    '#0fff83',
    '70'
  );
  await visualizationFormPage.changeBaseMap(page, 'Streets and topography');
  const previewRegion = await page.getByRole('region', { name: 'Preview' });
  const mapRegion = await previewRegion.getByRole('region', { name: 'Map' });
  const mapRegionBoundingBox = await mapRegion.boundingBox();
  expect(mapRegionBoundingBox).not.toBeNull();
  await expect(page).toHaveScreenshot(
    'Visualization-Create-a-map-appereance.png',
    {
      maxDiffPixelRatio: 0.02,
      clip: mapRegionBoundingBox,
    }
  );
  await page.getByRole('button', { name: 'Next' }).click();

  // Annotations
  await visualizationFormPage.setTitle(page, visiualizationTitle);
  await visualizationFormPage.setDescription(page, 'Test description');
  await page.getByRole('button', { name: 'Next' }).click();

  // Preview
  await expect(page).toHaveScreenshot(
    'Visualization-Create-a-map-preview.png',
    {
      maxDiffPixelRatio: 0.02,
      clip: await page.getByRole('main').boundingBox(),
    }
  );

  // Change viewport
  await visualizationFormPage.zoomIn(page);
  await visualizationFormPage.zoomIn(page);
  await visualizationFormPage.zoomIn(page);
  await expect(page).toHaveScreenshot(
    'Visualization-Create-a-map-preview-zoom-change.png',
    {
      maxDiffPixelRatio: 0.02,
      clip: await page.getByRole('region', { name: 'Map' }).boundingBox(),
    }
  );

  // Publish
  await page.getByRole('button', { name: 'Publish' }).click();
  await expect(
    page.getByText(`The map for ${sharedData.name} file has been published.`)
  ).toBeVisible();

  // View page
  const url = new URL(page.url());
  const expectedPathname = `/groups/${group.slug}/map/${visualizationSlug}`;
  expect(url.pathname).toBe(expectedPathname);
  await visualizationFormPage.changeBaseMap(page, 'Satellite');

  // Download file
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('link', { name: sharedData.filename }).click(),
  ]);
  expect(download.suggestedFilename()).toBe(sharedData.filename);
  expect((await fs.promises.stat((await download.path()) as string)).size).toBe(
    sharedData.fileSize
  );
});

test('Visualization: Create a map (Data set)', async ({
  page,
  sharedDataDataSet: sharedData,
}) => {
  const { group } = sharedData;
  const visiualizationTitle = `PW - Map ${EXECUTION_ID}`;
  const visualizationSlug = `pw-map-${EXECUTION_ID}`;
  await groupViewPage.goToPage(page, group.slug);

  await visualizationFormPage.goToPage(page, group.slug);

  // Select File
  await visualizationFormPage.selectFile(page, sharedData.name);

  // Data
  const latitude = await page.getByRole('combobox', {
    name: /latitude\(required\)/i,
  });
  const longitude = await page.getByRole('combobox', {
    name: /longitude\(required\)/i,
  });
  await expect(latitude).toHaveText('coordenadas_gps_latitud');
  await expect(longitude).toHaveText('coordenadas_gps_longitud');
  await visualizationFormPage.setDataColumnsOption(page, 'All columns');
  await page.getByRole('button', { name: 'Next' }).click();

  // Appereance
  await visualizationFormPage.setAppereance(page, 'Hexagon', '20', '#0fff83');
  await visualizationFormPage.changeBaseMap(page, 'Streets and topography');
  const previewRegion = await page.getByRole('region', { name: 'Preview' });
  const mapRegion = await previewRegion.getByRole('region', { name: 'Map' });
  const mapRegionBoundingBox = await mapRegion.boundingBox();
  expect(mapRegionBoundingBox).not.toBeNull();
  await expect(page).toHaveScreenshot(
    'Visualization-Create-a-map-Data-set-appereance.png',
    {
      maxDiffPixelRatio: 0.02,
      clip: mapRegionBoundingBox,
    }
  );
  await page.getByRole('button', { name: 'Next' }).click();

  // Annotations
  await visualizationFormPage.setTitle(page, visiualizationTitle);
  await visualizationFormPage.setDescription(page, 'Test description');
  await visualizationFormPage.setDataColumnsHeaders(page, {
    socio_clave_busqueda: 'New column label',
  });
  await expect(page.getByRole('region', { name: 'Preview' })).toContainText(
    'New column label'
  );
  await page.getByRole('button', { name: 'Next' }).click();

  // Preview
  await expect(page).toHaveScreenshot(
    'Visualization-Create-a-map-Data-set-preview.png',
    {
      maxDiffPixelRatio: 0.02,
      clip: await page.getByRole('main').boundingBox(),
    }
  );

  // Change viewport
  await visualizationFormPage.zoomIn(page);
  await visualizationFormPage.zoomIn(page);
  await visualizationFormPage.zoomIn(page);
  await expect(page).toHaveScreenshot(
    'Visualization-Create-a-map-Data-set-preview-zoom-change.png',
    {
      maxDiffPixelRatio: 0.03,
      clip: await page.getByRole('region', { name: 'Map' }).boundingBox(),
    }
  );

  // Publish
  await page.getByRole('button', { name: 'Publish' }).click();
  await expect(
    page.getByText(`The map for ${sharedData.name} file has been published.`)
  ).toBeVisible();

  // View page
  const url = new URL(page.url());
  const expectedPathname = `/groups/${group.slug}/map/${visualizationSlug}`;
  expect(url.pathname).toBe(expectedPathname);
  await visualizationFormPage.changeBaseMap(page, 'Satellite');

  // Download file
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('link', { name: sharedData.filename }).click(),
  ]);
  expect(download.suggestedFilename()).toBe(sharedData.filename);
  expect((await fs.promises.stat((await download.path()) as string)).size).toBe(
    sharedData.fileSize
  );
});
