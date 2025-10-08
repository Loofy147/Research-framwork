from playwright.sync_api import sync_playwright, expect
import datetime

def run_verification(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()

    try:
        # 1. Navigate to the signup page
        page.goto("http://localhost:5173/signup")

        # 2. Fill out the form and create a new user
        email = f"verify-user-{datetime.datetime.now().timestamp()}@example.com"
        password = "password123"
        page.fill('input[id="email"]', email)
        page.fill('input[id="password"]', password)
        page.click('button[type="submit"]')

        # 3. Wait for the redirect to the dashboard
        page.wait_for_url("http://localhost:5173/dashboard")

        # 4. Assert that the dashboard is loaded
        expect(page.locator('h1')).to_have_text('Dashboard')

        # 5. Take a screenshot of the dashboard
        page.screenshot(path="jules-scratch/verification/dashboard_screenshot.png")

    finally:
        browser.close()

with sync_playwright() as playwright:
    run_verification(playwright)