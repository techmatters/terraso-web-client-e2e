import { Page } from '@playwright/test';

type StoryMapTitle = {
  title?: string;
  subtitle?: string;
};

type Chapter = {
  title: string;
};

export const goToCreatePage = async (page: Page) => {
  await page.goto('/tools/story-maps/new');
};

export const goToPreview = async (page: Page) => {
  await page.getByRole('button', { name: 'Preview' }).click();
};

export const exitPreview = async (page: Page) => {
  await page.getByRole('button', { name: 'Exit Preview' }).click();
};

export const changeStoryMapTitle = async (
  page: Page,
  storyMapTitle: StoryMapTitle
) => {
  if (storyMapTitle.title) {
    const titleTextbox = await page.getByRole('textbox', {
      name: 'Story map title (Required)',
    });
    await titleTextbox.fill(storyMapTitle.title);
  }
  if (storyMapTitle.subtitle) {
    const subtitleTextbox = await page.getByRole('textbox', {
      name: 'Story map subtitle',
    });
    await subtitleTextbox.fill(storyMapTitle.subtitle);
  }
};

export const addChapter = async (page: Page, chapter: Chapter) => {
  await page.getByRole('button', { name: 'Add new chapter' }).click();
  await page.getByPlaceholder('Chapter title').click();
  await page.getByPlaceholder('Chapter title').fill(chapter.title);
  await page.getByPlaceholder('Chapter title').press('Tab');
};

export const setMapLocation = async (
  page: Page,
  chapterTitle: string,
  location: string
) => {
  await page
    .getByRole('region', { name: `Chapter: ${chapterTitle}` })
    .getByRole('button', { name: 'Set Map Location' })
    .click();
  const search = await page.getByPlaceholder('Search');
  await search.focus();
  await search.type(location);
  await page.locator('a').filter({ hasText: location }).click();
  await page.getByRole('button', { name: 'Set Location' }).click();
};

export const deleteStoryMap = async (page: Page, title: string) => {
  await page.goto('/');
  await page
    .getByRole('listitem', { name: title })
    .getByRole('button', { name: 'Delete' })
    .click();
  await page.getByRole('button', { name: 'Delete Story Map' }).click();
};

export const saveDraft = async (page: Page) => {
  await page.getByRole('button', { name: 'Save draft' }).click();
};

export const publish = async (page: Page) => {
  await page.getByRole('button', { name: 'Publish' }).click();
};
