import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';
const USER = {
  name: 'Test User',
  email: 'testuser@example.com',
  username: 'testuser',
  password: 'password123'
};
const NOTE = {
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
    // now, try to login
    await page.fill('input[name="login_form_username"]', USER.username);
    await page.fill('input[name="login_form_password"]', USER.password);
    await page.click('form[name="login_form"] button[type="submit"]');


    const logoutButton = await page.locator('button[name="logout"]');
    await expect(logoutButton).toBeVisible();
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

    const editButton = page.locator('button', { hasText: 'Edit' }).last();
    await editButton.click();

    const newContent = 'New content for the note.';
    await page.fill('textarea[name="text_input-1"]', newContent);
    await page.click('button[name="text_input_save-1"]');

    const updatedNote = await page.locator(`text=${newContent}`);
    await expect(updatedNote).toBeVisible();
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

    const deleteButton = page.locator('button', { hasText: 'Delete' }).last();
    await deleteButton.click();

    const deletedNote = await page.locator(`h2:has-text("${NOTE.title}")`).last();
    await expect(deletedNote).not.toBeVisible();
  });
});

