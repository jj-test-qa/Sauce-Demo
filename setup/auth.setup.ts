import { chromium, FullConfig } from "@playwright/test";
import { LoginPage } from "../pages/login.page";
import { user } from "../data/login.data";

async function globalSetup(config: FullConfig) { // if this fails tests should not run
  const browser = await chromium.launch();

  const context = await browser.newContext({ // explicit context, explicit baseUrl
    baseURL: "https://www.saucedemo.com/",
  });

  const page = await context.newPage();
  const loginPage = new LoginPage(page);

  // UI login once
  await loginPage.goto(); // uses '/'
  await loginPage.login(user.userName, user.passWord);

  // Hard guarantee login worked
  await page.waitForURL("**/inventory.html");

  // Save auth state
  await context.storageState({ path: "storageState.json" }); // storageState lives on context
  await browser.close();
}

export default globalSetup;

/*

// Smart globalSetup

import { chromium } from "@playwright/test";
import fs from "fs";

const STORAGE_PATH = "storageState.json";

async function isAuthValid(page) {
  await page.goto("/inventory.html");

  return !page.url().includes("login");
}

export default async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    storageState: fs.existsSync(STORAGE_PATH) ? STORAGE_PATH : undefined,
    baseURL: "https://www.saucedemo.com",
  });

  const page = await context.newPage();

  const valid = await isAuthValid(page);

  if (!valid) {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(user.userName, user.passWord);
    await page.waitForURL("** /inventory.html") // remove space neeeded for commenting
    await context.storageState({ path: STORAGE_PATH });
  }

  await browser.close();
};





*/