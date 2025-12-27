import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/login.page";
import { invalidLoginData, loginData } from "../data/login.data";

test.describe("Login", () => {

    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await expect(page).toHaveURL("/");
        await expect(loginPage.getLoginLogoTitle()).toHaveText("Swag Labs");
    });

    test.describe("Login with valid user name and valid password", () => {
        loginData.forEach(({ userName, passWord }) => {
            test(`@regression With Username:${userName} and Password:${passWord}`, async ({ page }) => {
                const loginPage = new LoginPage(page);
                await loginPage.login(userName, passWord);
                await expect(page).toHaveURL("/inventory.html");
            })
        })
    })

    test.describe("Login with valid user name and invalid password", () => {
        invalidLoginData.forEach(({ userName, passWord }) => {
            test(`@regression With Username:${userName} and Password:${passWord}`, async ({ page }) => {
                const loginPage = new LoginPage(page);
                await loginPage.login(userName, passWord);
                await expect(loginPage.getErrorMessage()).toHaveText(/Epic sadface/);
            })
        })
    })

})