import { expect, test } from '@playwright/test'

test.describe('Landing page', () => {
  test('shows the hero and links to sign in', async ({ page }) => {
    await page.goto('/')
    await expect(
      page.getByRole('heading', { name: /hi, i'm mnfs/i }),
    ).toBeVisible()
    await page.getByRole('link', { name: 'Sign in' }).click()
    await expect(page).toHaveURL(/\/auth\/login/)
  })
})

test.describe('Login page', () => {
  test('displays the login form', async ({ page }) => {
    await page.goto('/auth/login')
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByLabel('Password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Log in' })).toBeVisible()
  })

  test('shows a validation error for an invalid email', async ({ page }) => {
    await page.goto('/auth/login')
    await page.getByLabel('Password').fill('password123')
    await page.getByRole('button', { name: 'Log in' }).click()
    await expect(page.getByText(/invalid email/i)).toBeVisible()
  })

  test('logs in with valid credentials and reaches the dashboard', async ({
    page,
  }) => {
    await page.goto('/auth/login')
    await page.getByLabel('Email').fill('demo@example.com')
    await page.getByLabel('Password').fill('password123')
    await page.getByRole('button', { name: 'Log in' }).click()
    await expect(page).toHaveURL(/\/dashboard/)
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
  })

  test('has a link to the register page', async ({ page }) => {
    await page.goto('/auth/login')
    await page.getByRole('link', { name: 'Register' }).click()
    await expect(page).toHaveURL(/\/auth\/register/)
  })
})

test.describe('Register page', () => {
  test('displays the register form', async ({ page }) => {
    await page.goto('/auth/register')
    await expect(page.getByLabel('Name')).toBeVisible()
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Register' })).toBeVisible()
  })

  test('shows a validation error when passwords do not match', async ({
    page,
  }) => {
    await page.goto('/auth/register')
    await page.getByLabel('Name').fill('Demo User')
    await page.getByLabel('Email').fill('demo@example.com')
    await page.getByLabel('Password', { exact: true }).fill('password123')
    await page.getByLabel('Confirm password').fill('different123')
    await page.getByRole('button', { name: 'Register' }).click()
    await expect(page.getByText(/passwords do not match/i)).toBeVisible()
  })
})

test.describe('Route guard', () => {
  test('redirects to login when visiting the dashboard unauthenticated', async ({
    page,
  }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/auth\/login/)
  })
})
