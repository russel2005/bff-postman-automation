
import { chromium, expect } from '@playwright/test';
import { readFile, writeFile } from 'fs/promises';
import * as OTPAuth from 'otpauth';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage({ ignoreHTTPSErrors: true });

  // Step 1: Navigate to login page
  await page.goto('https:///xyz.com/member-eligibility-search/');

  // Step 2: Fill in username and password
  await page.locator("//input[@id='input27']").fill('ma_qar_bff8');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.locator('//div[@data-se="okta_password"]').click();
  await page.locator("//input[@type='password']").fill('Postman2025!');
  await page.getByRole('button', { name: 'Verify' }).click();

  // Step 3: Choose OTP method if prompted
  try {
    const googleAuthSelect = await page.waitForSelector('//div[@data-se="google_otp"]', { timeout: 5000 });
    if (googleAuthSelect) {
      await page.locator('//div[@data-se="google_otp"]').click();
    }
  } catch (error) {
    console.log("OTP method selection not shown");
  }

  // Step 4: Generate OTP token, otpauth://totp/login-providers-qa.deltadentalma.com:ma_qar_bff8?secret=V3ISCJ5XCCKCDTYA&issuer=login-providers-qa.deltadentalma.com
  const totp = new OTPAuth.TOTP({
    issuer: 'login-providers-qa.deltadentalma.com',
    label: 'MATOTP',
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: 'V3ISCJ5XCCKCDTYA'
  });

  const token = totp.generate();
  await page.getByLabel('Enter code').fill(token);
  await page.getByRole('button', { name: 'Verify' }).click();

  // Step 5: Confirm login
  const user = await page.locator("//div[@class='flex flex-row']/button/span");
  await expect(user).toBeVisible({ timeout: 30000 });
  await page.waitForTimeout(10000);

  // Step 6: Intercept API call and update bearerToken in environment file
  const envPath = 'environments/BFF-QAR-MA.postman_environment.json';
  let tokenCaptured = false;


  await page.route('**/my-profile?includeUserData=false', async route => {
    if (tokenCaptured) {
      route.continue();
      return;
    }
    const request = route.request();
    const headers = request.headers();
    const authHeader = headers['authorization'];
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const bearerToken = authHeader.split(' ')[1];
      console.log('New Token:', bearerToken);
      try {
        const existingData = JSON.parse(await readFile(envPath, 'utf-8'));
        let updated = false;

        for (const variable of existingData.values) {
          if (variable.key === 'bearerToken') {
            console.log('Old Token:', variable.value);
            variable.value = bearerToken;
            updated = true;
            break;
          }
        }

        if (!updated) {
          existingData.values.push({
            key: 'bearerToken',
            value: bearerToken,
            type: 'secret',
            enabled: true
          });
        }

        await writeFile(envPath, JSON.stringify(existingData, null, 2));
        console.log(`Updated 'bearerToken' in ${envPath}`);
        tokenCaptured = true;
      } catch (err) {
        console.error('Error updating bearerToken:', err);
      }
    }
    route.continue();
  });

  // Step 7: Trigger the request that contains the bearer token
  await page.goto('https://tsslftwwwebportal-ma.dqtest.ad/');

  // Step 8: Wait for token-carrying response
  await page.waitForResponse(
    res =>
      res.url().includes('https://xyz.com/api/user-management/api/provider-portal/v1/users/my-profile?includeUserData=false'),
    { timeout: 60000 }
  );
  await browser.close();
})(); 
