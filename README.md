# bff-postman-automation
postman automation
# Introduction 
Postman collection for the Next gen provider portal and it's backing APIs
The collections have been created based on the swagger repo

# Getting Started
1.	create a new workspace
2.	import the environment and collection files into postman
3.	for BFF requests copy you jwt token into the applicable environment variable
4.	when executing requests, select the target environment
===================================

# Naming Convention
1. Environment files names should be named as follows
   > BFF-<DEV|QAR>-<BU Name>.postman_environment.json

2. Test data files (under tests/<screen or domain area>/) should be named as follows
   > /<screen or domain area>-[additional segregation]-<DEV|QAR>-<BU Name>.json 

   where BU name can be:
   a) MA
   b) DQ  
   c) BCBSM
3. Auth Type we have to use Bearer Token or JWT Token name as 
   a) "bearerToken"
   b) x-tax-id-number as "TIN"
   c) x-traceability-id as "traceabilityId" 

# Bearer Token / JWT Token Automation

This project includes an automation script to retrieve a valid bearer token (JWT) and update your Postman environment file.
The `bearertoken/*.mjs` script automates the login process and updates the `jwtToken` variable in the `BFF-QAR-MA.postman_environment.json` file.
**Note:** JWT/bearer tokens are typically active for 90 minutes after they are created. Running this script ensures you always have a fresh token.

# How to install required packages
## 1. Install Node.js
   If not already installed, we recommend using a Node Version Manager (nvm).
   # Example using nvm
   nvm install 20
   or > npm install
   or > npm install -g npm@11.5.1  (specific version to update)
## 2. install newman (for postman cli)
   > npm install -g newman
## 3. install html postman report
   > npm install -g newman newman-reporter-htmlextra
## 4. install playwright, first install the applicable npm package, and then runplaywright's install command to downlaod the browsers
   > npm install @playwright/test
   > npx playwright install 
## 5.  Install Required Packages  for  the OTPAuth library  
   > npm install @playwright/test otpauth 
## 6. update bearer token into env file run *.mjs file, example:
   > ```node bearertoken/QAR-DQ.mjs```
   or
   > ```node .\\bearertoken\\QAR-MA.mjs``` [in Windows]
   > ```newman run \".\\tests\\MemberDetails\\MemberDetail.postman_collection.json\" --insecure -x -e \".\\environments\\BFF-QAR-MA.postman_environment.json\" -d \".\\tests\\MemberDetails\\MemberDetails-TestData-MA-QAR.json\" --reporters cli,htmlextra --reporter-htmlextra-export \".\\Results\\MemberDetail-report.html\" --reporter-htmlextra-title \"BFF Member details report\"```

# How to update bearer token or JWT token in local run
   - run bearertoken/*.mjs file with below command
   > node bearertoken/QAR-MA.mjs

# How to run specific postman collection in local from project location in cli
   > ```newman run ".\tests\MemberDetails\MemberDetail.postman_collection.json" --insecure -x -e ".\environments\BFF-QAR-MA.postman_environment.json" -d ".\tests\MemberDetails\MemberDetails-TestData-MA-QAR.json" --reporters cli,htmlextra --reporter-htmlextra-export ".\Results\MemberDetail-API-report.html"```

# Newman cli error for local run. something related to location issue
   > ```newman run ".\tests\MemberDetails\MemberDetail.postman_collection.json" --insecure -x -e ".\environments\BFF-QAR-MA.postman_environment.json" -d ".\tests\MemberDetails\MemberDetails-TestData-MA-QAR.json" --reporters cli,htmlextra --reporter-htmlextra-export ".\Results\MemberDetail-htmlextra-report.html"```
  newman: could not find "cli htmlextra" reporter
  ensure that the reporter is installed in the same directory as newman
  please install reporter using npm
  ## how to resolved? 
   1. in package.json add above command in script
  exaple:
  ============= 
 ```
  {
  "name": "postman BFF",
  "version": "1.0.0",
  "description": "Postman collection for the Next gen provider portal and it's backing APIs\r The collections have been created based on the swagger repo\r # Getting Started\r 1.\tcreate a new workspace\r 2.\timport the environment and collection files into postman\r 3.\tfor BFF requests copy you jwt token into the applicable environment variable\r 4.\twhen executing requests, select the target environment",
  "main": "index.js",
  "directories": {
    "test": "tests"
  },
  "scripts": {
    "test:ma-bearertoken": "node .\\bearertoken\\QAR-MA.mjs",
    "test:memberdetails": "newman run \".\\tests\\MemberDetails\\MemberDetail.postman_collection.json\" --insecure -x -e \".\\environments\\BFF-QAR-MA.postman_environment.json\" -d \".\\tests\\MemberDetails\\MemberDetails-TestData-MA-QAR.json\" --reporters cli,htmlextra --reporter-htmlextra-export \".\\Results\\MemberDetail-report.html\" --reporter-htmlextra-title \"BFF Member details report\"",
    "test:dq-bearertoken": "node .\\bearertoken\\QAR-DQ.mjs",
    "test:panelroster-d": "newman run \".\\tests\\PanelRosterBFF\\PanelRoster-Download-BFF.postman_collection.json\" --insecure -x -e \".\\environments\\BFF-QAR-DQ.postman_environment.json\" --reporters cli,htmlextra --reporter-htmlextra-export \".\\Results\\Panel-Roster-Downloads-Report.html",
    "test:memberdetails:all": "node .\\bearertoken\\QAR-DQ.mjs && npm run test:ma-bearertoken && npm run test:panelroster-d && npm run test:memberdetails",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  }
  ```
 2. how to run from command line?
   > npm run test:memberdetails 

# POSTMAN Collection Test Update and execute in ADO pipline
==========================================================
1. update/add/replace *collection.json file in the project
2. add file in git 
   > git add filename
3. commit 
   > git commit -m "update collection commit msg"
4. push in remote 
   > git push --set-upstream origin branchname
5. Create a pull request in ADO
   link: `https://dev.azure.com/EnterpriseRepo/Application%20Services/_git/Integrated%20Testing%20Provider`
6. Approve and Complete merge (pull request by reviewer if no conflicts)
7. Run the pipeline
8. Check the report under project as .html format 
OR
Check the execute status in ADO Testplan
link: `https://dev.azure.com/EnterpriseRepo/Application%20Services/_testPlans/execute?planId-18339&suiteId=25317`

## Guide: Setting Up a New User and Google Authenticator

This guide provides a secure, step-by-step process for creating a new user account and configuring Google Authenticator. The information gathered here will be used to update your `bearertoken/*.mjs` script for automated authentication.

   > ** Security Warning:** The QR code and its embedded secret key are extremely sensitive. Do not share them or use untrusted online tools for decoding. Follow this guide to handle this information securely and locally.

### Step 1: Create a New User Account.
1.  Open the user registration page in your browser:
    `https://tsslftwwwebportal-ma.dqtest.ad/member-eligibility-search/`

2.  Follow the on-screen instructions to create your new user account, choosing a unique username and a strong password.

### Step 2: Configure Google Authenticator
   After creating your account, you will be directed to the multi-factor authentication (MFA) setup page.

1.  Choose **Google Authenticator** as your MFA method.
2.  A QR code will be displayed on the screen. This image contains your TOTP (Time-based One-Time Password) secret key.
3.  **Securely capture this information.** You have two options:
    * **Take a screenshot of the QR code.** Save the image to a secure, local folder.
    * Find the link for **"can't scan the QR code?"** or **"manual setup."**. 
    This will display the raw secret key as a series of characters (e.g., `V3ISCJ5XCCKCDTYA`). Copy this string and save it securely.

### Step 3: Extract the Secret Key from the QR Code
If you took a screenshot of the QR code, you must decode it to retrieve the secret key. 
The most secure way to do this is with a local, offline tool. The decoded string will follow a specific format:

``` otpauth://totp/your.label?secret=YOUR_SECRET_KEY&issuer=your.issuer.com ```

#  Update Your Bearer Token Script
===================================
Finally, open your bearertoken/*.mjs file and update it with your new account details.
1. Update the username and password in the login section:
   // Step 2: Fill in username and password
   await page.locator("//input[@id='input27']").fill('your_new_username');
   // ...
   await page.locator("//input[@type='password']").fill('your_new_password');
2. Update the TOTP configuration with the secret key and issuer you just extracted:
``` 
   // Step 4: Generate OTP token...
   const totp = new OTPAuth.TOTP({
      issuer: 'login-providers-qa.deltadentalma.com',
      label: 'MATOTP',
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: 'YOUR_SECRET_KEY_HERE' // Replace with your secret key
   });
```
