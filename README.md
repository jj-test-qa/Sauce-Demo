![Playwright Tests](https://github.com/jj-test-qa/Sauce-Demo/actions/workflows/playwright.yml/badge.svg)
[![Allure Report](https://img.shields.io/badge/Allure-Report-blueviolet)](https://jj-test-qa.github.io/Sauce-Demo/)
![Playwright](https://img.shields.io/badge/Playwright-E2E-green)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue)

🧪 Sauce Demo – Playwright Automation Framework

This repository contains an end-to-end test automation framework built using Playwright + TypeScript, following Page Object Model (POM) and CI/CD best practices.

🚀 Tech Stack

Playwright – E2E browser automation

TypeScript – Type safety and scalability

Allure Reports – Rich test reporting

GitHub Actions – CI/CD execution

GitHub Pages – Report hosting

📁 Project Structure

pages/            
data/                                        
tests/                        
playwright.config.ts                      
package.json                           
.github/workflows/            

🧱 Framework Design

Page Object Model (POM)

Reusable flows (CheckoutFlow abstraction)

Data-driven tests

Parallel-safe execution

CI-ready configuration

Visual + functional assertions

▶️ Running Tests Locally
npm install
npx playwright install
npm test

📊 Allure Reports

Generate locally:

npm run report


View CI report:

https://jj-test-qa.github.io/Sauce-Demo/

🔄 CI/CD Pipeline

Runs on:

Push

Pull Request

Nightly schedule

Generates Allure report

Publishes report to GitHub Pages

Uses secure GitHub secrets for configuration

🧠 Key Testing Concepts Covered

UI flows

Storage state authentication

Parallel execution

Negative test coverage

Flaky test mitigation

📌 JJ Test

Built as a QA Automation Portfolio Project showcasing production-grade test automation practices.
