import { test as baseTest, expect } from '@playwright/test';
import { setAuthCookie } from '../auth';
import { EXECUTION_ID } from '../config';
import {
  addChapter,
  addMedia,
  changeChapterAlignment,
  changeChapterTitle,
  changeStoryMapTitle,
  deleteStoryMap,
  exitPreview,
  getChapter,
  getChaptersNavigation,
  getTitleSection,
  goToPreview,
  moveChapterDown,
  moveChapterUp,
  publish,
  saveDraft,
  setMapLocation,
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
      titleSection.getByRole('heading', { name: storyMapTitle })
    ).toBeVisible();

    await saveDraft(page);
    await expect(
      page.getByText(`${storyMapTitle} story map has been saved.`)
    ).toBeVisible();
    await use({ title: storyMapTitle });
    await deleteStoryMap(page, storyMapTitle);
  },
  // chapter: async ({ page, storyMap }, use) => {
  //   const storyMapTitle = storyMap.title;
  //   const chapterTitle = `PW - Chapter test ${EXECUTION_ID}`;
  //   await addChapter(page);
  //   await changeChapterTitle(page, 'Untitled', chapterTitle);
  //   await saveDraft(page);
  //   await expect(
  //     page.getByText(`${storyMapTitle} story map has been updated.`)
  //   ).toBeVisible();
  //   await use({ storyMapTitle, chapterTitle });
  // },
});

test.beforeEach(async ({ context }) => {
  await setAuthCookie(context);
});

// test('Story Map: Edit title section', async ({ page, storyMap }) => {
//   await expect(
//     page
//       .getByRole('region', { name: 'Chapters' })
//       .getByRole('heading', { name: storyMap.title })
//   ).toBeVisible();
//   await changeStoryMapTitle(page, { subtitle: `Subtitle - edited` });
//   await goToPreview(page);
//   await expect(
//     page.getByRole('heading', { name: 'Subtitle - edited' })
//   ).toBeVisible();
// });

// test('Story Map: Add chapter section', async ({ page, storyMap }) => {
//   await expect(
//     page
//       .getByRole('region', { name: 'Chapters' })
//       .getByRole('heading', { name: storyMap.title })
//   ).toBeVisible();
//   await addChapter(page);
//   await changeChapterTitle(page, 'Untitled', 'Chapter 2');
//   await expect(page.getByRole('heading', { name: 'Chapter 2' })).toBeVisible();
// });

// test('Story Map: Set map location', async ({ page, chapter }) => {
//   await expect(
//     page
//       .getByRole('region', { name: 'Chapters' })
//       .getByRole('heading', { name: chapter.chapterTitle })
//   ).toBeVisible();
//   await setMapLocation(page, chapter.chapterTitle, 'Quito Pichincha, Ecuador');
//   await expect(
//     page.getByRole('heading', { name: chapter.chapterTitle })
//   ).toBeVisible();
// });

test('Story Map: Create', async ({ page, storyMap }) => {
  // User adds a title	"start a story map
  // select the title field
  // enter a title"	story map shows title, large and centered

  // User sets a location	"start a story map
  // select ""set map location"" button on title screen or chapter
  // update map, change location, pitch, bearing
  // select ""set location"" button"	map background updates to location, pitch, and bearing selected by the user

  // User aborts seting a location	"start a story map
  // select ""set map location"" button on title screen or chapter
  // update map, change location, pitch, bearing
  // select cancel"	map background does not update

  // User adds a chapter	"start a story map
  // Select the ""new chapter"" button"	The there should be a new chapter at the bottom of the chapter list
  await addChapter(page);
  const chaptersNavigation = await getChaptersNavigation(page);
  await expect(
    chaptersNavigation.getByRole('button', { name: 'Untitled' })
  ).toBeVisible();

  // Add title to chapter	"start a story map
  // create a chapter
  // User views a chapter and adds text
  // User adds a title chapter"	"Chapter title should update
  // Chapter title should be visible in slide list"
  await changeChapterTitle(page, 'Untitled', 'Chapter 1');
  await expect(
    chaptersNavigation.getByRole('button', { name: 'Chapter 1' })
  ).toBeVisible();

  // Add picture, movie, audio to chapter	"start a story map
  // create a chapter
  // User views a chapter, selects ""add media""
  // user selects a file from a file picker and uploads"	Media file should be visible in chapter
  await addMedia(page, 'Chapter 1', 'files/quito.jpeg');
  await expect(
    (
      await getChapter(page, 'Chapter 1')
    ).getByRole('img', { name: 'Chapter media' })
  ).toBeVisible();

  // Add text to chapter	"start a story map
  // create a chapter
  // User views a chapter, selects text box
  // Adds content with bold, italic, and hyperlinked text"	rich text should be visible, hyperlinks should direct user to new page in a new tab

  // Add alignment to chapter	"start a story map
  // create a chapter
  // User selects the ""left"", ""center"", and ""right"" buttons"	Chapter aligns as selected by the user.
  await changeChapterAlignment(page, 'Chapter 1', 'Center');
  const centerBoundingBox = await (await getChapter(page, 'Chapter 1'))
    .getByRole('heading', { name: 'Chapter 1' })
    .boundingBox();
  if (!centerBoundingBox) {
    throw new Error('centerBoundingBox is null');
  }

  await changeChapterAlignment(page, 'Chapter 1', 'Left');
  const leftBoundingBox = await (await getChapter(page, 'Chapter 1'))
    .getByRole('heading', { name: 'Chapter 1' })
    .boundingBox();
  if(!leftBoundingBox) {
    throw new Error('leftBoundingBox is null');
  }
  expect(centerBoundingBox.x).toBeGreaterThan(leftBoundingBox.x);

  await changeChapterAlignment(page, 'Chapter 1', 'Right');
  const rightBoundingBox = await (await getChapter(page, 'Chapter 1'))
    .getByRole('heading', { name: 'Chapter 1' })
    .boundingBox();
  if(!rightBoundingBox) {
    throw new Error('rightBoundingBox is null');
  }
  expect(rightBoundingBox.x).toBeGreaterThan(centerBoundingBox.x);

  // Prompt to save	"start a story map
  // change the story map
  // User navigates away from story map without saving draft"	User should receive a pop-up prompting them to save
  await mainNavigation.goToLandscapes(page);
  const pendingChangesDialog = page.getByRole('dialog', { name: 'Leave Story Map?' })
  await expect(
    pendingChangesDialog
  ).toBeVisible();
  await pendingChangesDialog.getByRole('button', { name: 'Cancel' }).click(); 

  // User saves draft	"start a story map
  // add a title
  // add a chapter with title, location, and content
  // select the save draft button"	"story map url matches title
  // changes are saved"
  await saveDraft(page);
  await expect(
    page.getByText(`${storyMap.title} story map has been updated.`)
  ).toBeVisible();

  // User Previews story map	"start a story map
  // add a title
  // select the ""preview"" button"	User sees the story map as it would be viewed by a Terraso user once published
  
  // TODO
  
  await goToPreview(page);
  await expect(
    await getChaptersNavigation(page)
  ).not.toBeVisible();
  await exitPreview(page);

  // User Publishes story map	"start a story map
  // add a title
  // select the ""Publish"" button"	User sees the story map without edit controls
  await publish(page);
  await expect(
    await getChaptersNavigation(page)
  ).not.toBeVisible();
  await storyMapViewPage.editStoryMap(page);

  // User reorders chapter - contextual menue	"start a story map
  // add two chapters
  // select contextual menu, chapter 1
  // move chapter down"	User sees the selected chapter exchange places with the following chapter
  await addChapter(page);
  await changeChapterTitle(page, 'Untitled', 'Chapter 2');
  // await addChapter(page);
  // await changeChapterTitle(page, 'Untitled', 'Chapter 3');

  await moveChapterDown(page, 'Chapter 1');
  // Wait for the move animation to complete
  await page.waitForTimeout(500);

  const list = (await getChaptersNavigation(page)).getByRole('list');
  expect(await list.getByRole('listitem').nth(0).textContent()).toBe('1Chapter 2');
  expect(await list.getByRole('listitem').nth(1).textContent()).toBe('2Chapter 1');

  // User reorders chapter - drag and drop	"start a story map
  // add two chapters
  // click and drag first chapter beyond the scond chapter"	User sees the selected chapter exchange places with the following chapter

  // User tries to move chapter beyond title card	"start a story map
  // add two chapters
  // select contextual menu, chapter 1"	User should not see the option to move a chapter up

  // User tries to move chapter beyond the end	"start a story map
  // add two chapters
  // select contextual menu for last chapter"	User should not see the option to move a chapter down
});

// test('Story Map: Edit', async ({ page, storyMap }) => {
//   await page.getByRole('button', { name: 'Add media' }).click();
//   await page.getByRole('button', { name: 'Add media' }).click();

//   await page.getByRole('button', { name: 'Update Media' }).click();
//   await page.getByRole('button', { name: 'Upload a photo or audio file Select File Accepted file formats: *.aac, *.gif, *.jpeg, *.jpg, *.mp3, *.mp4, *.png, *.wav Maximum file size: 10 MB' }).click();
//   await page.getByRole('button', { name: 'Upload a photo or audio file Select File Accepted file formats: *.aac, *.gif, *.jpeg, *.jpg, *.mp3, *.mp4, *.png, *.wav Maximum file size: 10 MB' }).setInputFiles('378389557_1454443492062921_892382131012195022_n.jpeg');
//   await page.getByRole('button', { name: 'Add media' }).click();
// });
