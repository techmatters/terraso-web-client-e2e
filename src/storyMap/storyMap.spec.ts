import { test as baseTest, expect } from '@playwright/test';
import { setAuthCookie } from '../auth';
import { EXECUTION_ID } from '../config';
import {
  addChapter,
  addMedia,
  cancelStoryMapLocation,
  changeChapterAlignment,
  changeChapterDescription,
  changeChapterTitle,
  changeStoryMapTitle,
  deleteStoryMap,
  dragChapter,
  exitPreview,
  getChapter,
  getChapterContextMenu,
  getChaptersNavigation,
  getTitleSection,
  goToChapter,
  goToPreview,
  moveChapterDown,
  publish,
  saveDraft,
  setStoryMapLocation,
} from './storyMapFormPage';
import * as homePage from '../home/homePage';
import * as mainNavigation from '../mainNavigation';
import * as storyMapViewPage from './storyMapViewPage';

const test = baseTest.extend({
  storyMap: async ({ page }, use) => {
    const storyMapTitle = `PW - Title test ${EXECUTION_ID}`;

    await homePage.goToHome(page);
    await homePage.createNewStoryMap(page);
    await expect(page).toHaveTitle('Create Story Map | Terraso');

    await changeStoryMapTitle(page, { title: storyMapTitle });
    const titleSection = await getTitleSection(page);
    await expect(
      titleSection.getByRole('heading', { name: storyMapTitle }),
    ).toBeVisible();

    await saveDraft(page);
    await expect(
      page.getByText(`${storyMapTitle} story map has been saved.`),
    ).toBeVisible();
    await use({ title: storyMapTitle });
    await deleteStoryMap(page, storyMapTitle);
  },
});

test.beforeEach(async ({ context }) => {
  await setAuthCookie(context);
});

// See: https://docs.google.com/spreadsheets/d/1ndq6FWlwdP36Dm0BpcUdK4Lk7vLQODsocrQOT4t7x1A/edit#gid=0
test('Story Map: Create a story map', async ({ page, storyMap }) => {
  // User sets a location
  await setStoryMapLocation(page, 'Quito Pichincha, Ecuador');
  const mapRegion = page.getByRole('region', { name: 'Map' });
  const mapRegionBoundingBox = await mapRegion.boundingBox();
  expect(mapRegionBoundingBox).not.toBeNull();

  await expect(page).toHaveScreenshot(
    'Story-Map-Create-a-story-map-set-map.png',
    {
      maxDiffPixelRatio: 0.02,
      clip: mapRegionBoundingBox,
    },
  );
  // User aborts seting a location
  await cancelStoryMapLocation(page);

  // User adds a chapter
  await addChapter(page);
  const chaptersNavigation = await getChaptersNavigation(page);
  await expect(
    chaptersNavigation.getByRole('button', { name: 'Untitled' }),
  ).toBeVisible();

  // Add title to chapter
  await changeChapterTitle(page, 'Untitled', 'Chapter 1');
  await expect(
    chaptersNavigation.getByRole('button', { name: 'Chapter 1' }),
  ).toBeVisible();

  // Add picture, movie, audio to chapter
  await addMedia(page, 'Chapter 1', 'files/quito.jpeg');
  await expect(
    (await getChapter(page, 'Chapter 1')).getByRole('img', {
      name: 'Chapter media',
    }),
  ).toBeVisible();

  // Add text to chapter
  await changeChapterDescription(
    page,
    'Chapter 1',
    'This is a test description',
  );
  await expect(
    (await getChapter(page, 'Chapter 1')).getByRole('textbox', {
      name: 'Chapter description',
    }),
  ).toBeVisible();

  // Add alignment to chapter
  await changeChapterAlignment(page, 'Chapter 1', 'Center');
  const centerBoundingBox = await (await getChapter(page, 'Chapter 1'))
    .getByRole('heading', { name: 'Chapter 1' })
    .boundingBox();
  expect(centerBoundingBox).not.toBeNull();

  await changeChapterAlignment(page, 'Chapter 1', 'Left');
  const leftBoundingBox = await (await getChapter(page, 'Chapter 1'))
    .getByRole('heading', { name: 'Chapter 1' })
    .boundingBox();
  expect(leftBoundingBox).not.toBeNull();
  expect(centerBoundingBox.x).toBeGreaterThan(leftBoundingBox.x);

  await changeChapterAlignment(page, 'Chapter 1', 'Right');
  const rightBoundingBox = await (await getChapter(page, 'Chapter 1'))
    .getByRole('heading', { name: 'Chapter 1' })
    .boundingBox();
  expect(rightBoundingBox).not.toBeNull();
  expect(rightBoundingBox.x).toBeGreaterThan(centerBoundingBox.x);

  // Prompt to save
  await mainNavigation.goToLandscapes(page);
  const pendingChangesDialog = page.getByRole('dialog', {
    name: 'Leave Story Map?',
  });
  await expect(pendingChangesDialog).toBeVisible();
  await pendingChangesDialog.getByRole('button', { name: 'Cancel' }).click();

  // User saves draft
  await saveDraft(page);
  await expect(
    page.getByText(`${storyMap.title} story map has been updated.`),
  ).toBeVisible();

  // User Previews story map
  await goToPreview(page);
  await expect(await getChaptersNavigation(page)).toBeHidden();
  await expect(page).toHaveScreenshot(
    'Story-Map-Create-a-story-map-preview-page.png',
    {
      maxDiffPixelRatio: 0.02,
    },
  );
  await exitPreview(page);

  // User Publishes story map
  await publish(page);
  await expect(await getChaptersNavigation(page)).toBeHidden();
  await storyMapViewPage.editStoryMap(page);

  // User reorders chapter - contextual menu
  await addChapter(page);
  await changeChapterTitle(page, 'Untitled', 'Chapter 2');
  await moveChapterDown(page, 'Chapter 1');
  const list = (await getChaptersNavigation(page)).getByRole('list');
  await expect(
    list
      .getByRole('listitem')
      .nth(0)
      .getByRole('button', { name: 'Chapter 2' }),
  ).toBeVisible();
  await expect(
    list
      .getByRole('listitem')
      .nth(1)
      .getByRole('button', { name: 'Chapter 1' }),
  ).toBeVisible();

  // User reorders chapter - drag and drop
  await dragChapter(page, 'Chapter 2', 'Chapter 1');
  await expect(
    list
      .getByRole('listitem')
      .nth(0)
      .getByRole('button', { name: 'Chapter 1' }),
  ).toBeVisible();
  await expect(
    list
      .getByRole('listitem')
      .nth(1)
      .getByRole('button', { name: 'Chapter 2' }),
  ).toBeVisible();

  // User tries to move chapter beyond title card
  const chapter1Menu = await getChapterContextMenu(page, 'Chapter 1');
  await expect(
    chapter1Menu.getByRole('menuitem', { name: 'Move Chapter Up' }),
  ).toBeHidden();
  await page.click('body');

  // User tries to move chapter beyond the end
  await goToChapter(page, 'Chapter 2');
  const chapter2Menu = await getChapterContextMenu(page, 'Chapter 2');
  await expect(
    chapter2Menu.getByRole('menuitem', { name: 'Move Chapter Down' }),
  ).toBeHidden();
});
