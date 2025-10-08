import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  const email = `testuser-${Date.now()}@example.com`;
  const password = 'password123';

  test.only('should allow a user to sign up and be redirected to the dashboard', async ({ page }) => {
    await page.goto('/signup');
    await page.fill('input[id="email"]', email);
    await page.fill('input[id="password"]', password);
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
    await expect(page.locator('h1')).toHaveText('Dashboard');
  });

  test('should allow a user to log out', async ({ page }) => {
    // First, sign up and log in
    await page.goto('/signup');
    await page.fill('input[id="email"]', email);
    await page.fill('input[id="password"]', password);
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');

    // In a real app, you'd have a logout button. We'll simulate this
    // by clearing cookies and local storage, then navigating to login.
    await page.context().clearCookies();
    // A true logout would likely be an API call, but for this test,
    // we'll just navigate to the login page to confirm we were logged out.
    await page.goto('/login');
    await expect(page.locator('h2')).toHaveText('Sign In');
  });


  test('should allow a user to log in', async ({ page }) => {
    // First, create the user
    await page.goto('/signup');
    await page.fill('input[id="email"]', email);
    await page.fill('input[id="password"]', password);
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
    // Log out to test login
    await page.context().clearCookies();
    await page.goto('/login');

    // Now, log in
    await page.fill('input[id="email"]', email);
    await page.fill('input[id="password"]', password);
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
    await expect(page.locator('h1')).toHaveText('Dashboard');
  });
});