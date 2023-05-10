import { test as baseTest, expect } from '@playwright/test';
import { setAuthCookie } from '../auth';
import { EXECUTION_ID } from '../config';
import {
  addChapter,
  changeStoryMapTitle,
  deleteStoryMap,
  goToCreatePage,
  goToPreview,
  saveDraft,
  setMapLocation,
} from './storyMapFormPage';

const test = baseTest.extend({
  storyMap: async ({ page }, use) => {
    const storyMapTitle = `PW - Title test ${EXECUTION_ID}`;
    await goToCreatePage(page);
    await changeStoryMapTitle(page, { title: storyMapTitle });
    await saveDraft(page);
    await expect(
      page.getByText(`${storyMapTitle} story map has been saved.`)
    ).toBeVisible();
    await use({ title: storyMapTitle });
    await deleteStoryMap(page, storyMapTitle);
  },
  chapter: async ({ page, storyMap }, use) => {
    const storyMapTitle = storyMap.title;
    const chapterTitle = `PW - Chapter test ${EXECUTION_ID}`;
    await addChapter(page, { title: chapterTitle });
    await saveDraft(page);
    await expect(
      page.getByText(`${storyMapTitle} story map has been updated.`)
    ).toBeVisible();
    await use({ storyMapTitle, chapterTitle });
  },
});

test.beforeEach(async ({ context }) => {
  await setAuthCookie(context);
});

test('Story Map: Edit title section', async ({ page, storyMap }) => {
  await expect(
    page
      .getByRole('region', { name: 'Chapters' })
      .getByRole('heading', { name: storyMap.title })
  ).toBeVisible();
  await changeStoryMapTitle(page, { subtitle: `Subtitle - edited` });
  await goToPreview(page);
  await expect(
    page.getByRole('heading', { name: 'Subtitle - edited' })
  ).toBeVisible();
});

test('Story Map: Add chapter section', async ({ page, storyMap }) => {
  await expect(
    page
      .getByRole('region', { name: 'Chapters' })
      .getByRole('heading', { name: storyMap.title })
  ).toBeVisible();
  await addChapter(page, { title: 'Chapter 2' });
  await expect(page.getByRole('heading', { name: 'Chapter 2' })).toBeVisible();
});

test('Story Map: Set map location', async ({ page, chapter }) => {
  await expect(
    page
      .getByRole('region', { name: 'Chapters' })
      .getByRole('heading', { name: chapter.chapterTitle })
  ).toBeVisible();
  await setMapLocation(page, chapter.chapterTitle, 'Quito Pichincha, Ecuador');
  await expect(
    page.getByRole('heading', { name: chapter.chapterTitle })
  ).toBeVisible();
});
