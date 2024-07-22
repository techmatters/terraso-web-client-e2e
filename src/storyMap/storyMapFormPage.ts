import { Page } from '@playwright/test';
import path from 'path';

type StoryMapTitle = {
  title?: string;
  subtitle?: string;
};

export const goToToolsPage = async (page: Page) => {
  await page.goto('/tools');
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

export const getTitleSection = async (page: Page) => {
  return page.getByRole('region', { name: /Title for:/i });
};

export const getChaptersNavigation = async (page: Page) => {
  return page.getByRole('navigation', { name: 'Chapters sidebar' });
};

export const getChapterContextMenu = async (
  page: Page,
  chapterTitle: string,
) => {
  const chaptersNavigation = await getChaptersNavigation(page);
  const chapterItem = chaptersNavigation.getByRole('button', {
    name: chapterTitle,
  });
  await chapterItem.getByRole('button', { name: 'More options' }).click();
  return page.getByRole('menu', { name: `${chapterTitle} menu` });
};

export const changeStoryMapTitle = async (
  page: Page,
  storyMapTitle: StoryMapTitle,
) => {
  if (storyMapTitle.title) {
    const titleTextbox = page.getByRole('textbox', {
      name: 'Story map title (Required)',
    });
    await titleTextbox.fill(storyMapTitle.title);
    await titleTextbox.press('Tab');
  }
  if (storyMapTitle.subtitle) {
    const subtitleTextbox = page.getByRole('textbox', {
      name: 'Story map subtitle',
    });
    await subtitleTextbox.fill(storyMapTitle.subtitle);
    await subtitleTextbox.press('Tab');
  }
};

export const setStoryMapLocation = async (page: Page, location: string) => {
  const titleSection = await getTitleSection(page);
  await titleSection.getByRole('button', { name: 'Set Map Location' }).click();
  const search = page.getByPlaceholder('Search');
  await search.focus();
  await search.type(location);
  await page.locator('a').filter({ hasText: location }).click();
  // Wait for the map to change
  await page.waitForTimeout(2000); //eslint-disable-line
};

export const acceptStoryMapLocation = async (page: Page) => {
  await page.getByRole('button', { name: 'Set Location' }).click();
};

export const cancelStoryMapLocation = async (page: Page) => {
  await page.getByRole('button', { name: 'Cancel' }).click();
};

export const addChapter = async (page: Page) => {
  await page.getByRole('button', { name: 'Add new chapter' }).click();
};

export const goToChapter = async (page: Page, chapterTitle: string) => {
  const chaptersNavigation = await getChaptersNavigation(page);
  await chaptersNavigation.getByRole('button', { name: chapterTitle }).click();
};

export const getChapter = async (page: Page, chapterTitle: string) => {
  await goToChapter(page, chapterTitle);
  return page.getByRole('region', { name: `Chapter: ${chapterTitle}` });
};

export const changeChapterTitle = async (
  page: Page,
  chapterTitle: string,
  newChapterTitle: string,
) => {
  const chapterComponent = await getChapter(page, chapterTitle);
  const titleField = chapterComponent.getByPlaceholder('Chapter title');

  await titleField.click();
  await titleField.fill(newChapterTitle);
};

export const changeChapterDescription = async (
  page: Page,
  chapterTitle: string,
  newChapterDescription: string,
) => {
  const chapterComponent = await getChapter(page, chapterTitle);
  const descriptionField = chapterComponent.getByRole('textbox', {
    name: 'Chapter description',
  });
  await descriptionField.getByRole('paragraph').click();
  await descriptionField.fill(newChapterDescription);
};

export const openMediaDialog = async (page: Page, chapterTitle: string) => {
  const chapterComponent = await getChapter(page, chapterTitle);
  const button = chapterComponent.getByRole('button', {
    name: 'Add media',
  });
  await button.click();
  // Needs 2 clicks not sure why
  await button.click();
};

export const addMedia = async (
  page: Page,
  chapterTitle: string,
  mediaUrl: string,
) => {
  await openMediaDialog(page, chapterTitle);
  const mediaDialog = page.getByRole('dialog', { name: 'Add media' });
  const dropZone = mediaDialog.getByRole('button', {
    name: 'Upload a photo or audio file Select File Accepted file formats: *.aac, *.gif, *.jpeg, *.jpg, *.mp3, *.mp4, *.png, *.wav Maximum file size: 10 MB',
  });
  const input = dropZone.locator('input[type=file]');
  await input.setInputFiles(path.join(__dirname, mediaUrl));
  await mediaDialog.getByRole('button', { name: 'Add media' }).click();
};

export const changeChapterAlignment = async (
  page: Page,
  chapterTitle: string,
  alignment: 'Left' | 'Center' | 'Right',
) => {
  const chapterComponent = await getChapter(page, chapterTitle);
  const alignmentButton = chapterComponent.getByRole('button', {
    name: alignment,
  });
  await alignmentButton.click();
};

export const setChapterMapLocation = async (
  page: Page,
  chapterTitle: string,
  location: string,
) => {
  await page
    .getByRole('region', { name: `Chapter: ${chapterTitle}` })
    .getByRole('button', { name: 'Set Map Location' })
    .click();
  const search = page.getByPlaceholder('Search');
  await search.focus();
  await search.type(location);
  await page.locator('a').filter({ hasText: location }).click();
  await page.getByRole('button', { name: 'Set Location' }).click();
};

export const moveChapterDown = async (page: Page, chapterTitle: string) => {
  const chapterMenu = await getChapterContextMenu(page, chapterTitle);
  await chapterMenu
    .getByRole('menuitem', { name: 'Move Chapter Down' })
    .click();
  // Wait for the move animation to complete
  await page.waitForTimeout(500); //eslint-disable-line
};

export const dragChapter = async (
  page: Page,
  chapterTitle: string,
  targetChapterTitle: string,
) => {
  const chaptersNavigation = await getChaptersNavigation(page);
  const chapterItem = chaptersNavigation.getByRole('button', {
    name: chapterTitle,
  });
  const targetChapterItem = chaptersNavigation.getByRole('button', {
    name: targetChapterTitle,
  });
  const targetBoundingBox = await targetChapterItem.boundingBox();
  if (!targetBoundingBox) {
    throw new Error('Target chapter not found');
  }
  await chapterItem.hover();
  await page.mouse.down();
  await page.mouse.move(
    targetBoundingBox.x + targetBoundingBox.width / 2,
    targetBoundingBox.y + targetBoundingBox.height / 2,
    { steps: 10 },
  );
  await page.mouse.up();
  // // Wait for the move animation to complete
  await page.waitForTimeout(500); //eslint-disable-line
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
