import { test, expect } from '@playwright/test';
import { log } from 'console';
import { exec, ChildProcess } from 'child_process';

let serverProcess: ChildProcess;

test.beforeAll(async () => {
  serverProcess = exec('npm run dev');

  await new Promise((resolve) => setTimeout(resolve, 5000));
});

test.afterAll(async () => {
  if (serverProcess) {
    serverProcess.kill();
    console.log('Dev server stopped');
  }
});

const BASE_URL = 'http://localhost:3000';
const USER = {
  name: 'Yuvi',
  email: 'Yuvyuv@example.com',
  username: 'yuvi',
  password: '1234'
};
const NOTE = {
  title: 'Pinnero Note',
  content: 'I am the hissiiii.'
};

const TESTNOTES = {
  title: 'Test Note',
  content: 'This is a test note.'
};

test.describe('Notes App', () => {
  test('User Registration and login', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.fill('input[name="create_user_form_name"]', USER.name);
    await page.fill('input[name="create_user_form_email"]', USER.email);
    await page.fill('input[name="create_user_form_username"]', USER.username);
    await page.fill('input[name="create_user_form_password"]', USER.password);
    await page.click('button[name="create_user_form_create_user"]');
    //Now, try to login
    await page.fill('input[name="login_form_username"]', USER.username);
    await page.fill('input[name="login_form_password"]', USER.password);
    await page.click('form[name="login_form"] button[type="submit"]');

    //Add 15 notes so the database is not empty
    for (let i = 1; i < 16; i++) {
      await page.click('button[name="add_new_note"]');
      await page.fill('input[name="add_note_title"]', TESTNOTES.title + " " + i);
      await page.fill('textarea[name="text_input_new_note"]', TESTNOTES.content + " " + i);
      await page.click('button[name="text_input_save_new_note"]');
      await page.waitForTimeout(200);
  }


    const logoutButton = await page.locator('button[name="logout"]');
    await expect(logoutButton).toBeVisible();
  });

  test('Delete Note', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.fill('input[name="login_form_username"]', USER.username);
    await page.fill('input[name="login_form_password"]', USER.password);
    await page.click('form[name="login_form"] button[type="submit"]');

    await page.click('button[name="add_new_note"]');
    await page.fill('input[name="add_note_title"]', NOTE.title);
    await page.fill('textarea[name="text_input_new_note"]', NOTE.content);
    await page.click('button[name="text_input_save_new_note"]');
    await page.waitForTimeout(1000);
    await page.click('button[name="last"]');
    await page.waitForTimeout(1000);

    const deleteButton = await page.locator('button', { hasText: 'Delete' }).last();
    await deleteButton.click();

    const deletedNote = await page.locator(`h2:has-text("${NOTE.title}")`).last();
    await expect(deletedNote).not.toBeVisible();
  });

  test('Add Note', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.fill('input[name="login_form_username"]', USER.username);
    await page.fill('input[name="login_form_password"]', USER.password);
    await page.click('form[name="login_form"] button[type="submit"]');

    await page.click('button[name="add_new_note"]');
    await page.fill('input[name="add_note_title"]', NOTE.title);
    await page.fill('textarea[name="text_input_new_note"]', NOTE.content);
    await page.click('button[name="text_input_save_new_note"]');
    await page.waitForTimeout(1000);
    await page.click('button[name="last"]');
    await page.waitForTimeout(1000);

    const noteTitle = await page.locator(`h2:has-text("${NOTE.title}")`).last();
     await expect(noteTitle).toBeVisible();
  });

  test('Edit Note', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.fill('input[name="login_form_username"]', USER.username);
    await page.fill('input[name="login_form_password"]', USER.password);
    await page.click('form[name="login_form"] button[type="submit"]');

    await page.click('button[name="add_new_note"]');
    await page.fill('input[name="add_note_title"]', NOTE.title);
    await page.fill('textarea[name="text_input_new_note"]', NOTE.content);
    await page.click('button[name="text_input_save_new_note"]');
    await page.waitForTimeout(1000);
    await page.click('button[name="last"]');
    await page.waitForTimeout(1000);

    const editButton = await page.locator('button', { hasText: 'Edit' }).last();
    await editButton.click();

    const newContent = 'New content for the note.';
    await page.fill('textarea', newContent);
    const saveButton = await page.locator('button', { hasText: 'Save' }).last();
    await saveButton.click();
    await page.waitForTimeout(1000);

    const updatedNote = await page.locator(`p:has-text("${newContent}")`).last();
    await expect(updatedNote).toBeVisible();
  });

  test('Restricted Buttons', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.fill('input[name="login_form_username"]', USER.username);
    await page.fill('input[name="login_form_password"]', USER.password);
    await page.click('form[name="login_form"] button[type="submit"]');

    await page.click('button[name="add_new_note"]');
    await page.fill('input[name="add_note_title"]', NOTE.title);
    await page.fill('textarea[name="text_input_new_note"]', NOTE.content);
    await page.click('button[name="text_input_save_new_note"]');
    await page.waitForTimeout(1000);
    await page.click('button[name="last"]');
    await page.waitForTimeout(1000);

    const logoutButton = await page.locator('button[name="logout"]');
    await logoutButton.click();

    const deleteButton = await page.locator('button', { hasText: 'Delete' }).last();
    await expect(deleteButton).not.toBeVisible();
    const editButton = await page.locator('button', { hasText: 'Edit' }).last();
    await expect(editButton).not.toBeVisible();
    const addButton = await page.locator('button', { hasText: 'Add New Note' }).last();
    await expect(addButton).not.toBeVisible();
  });
});
