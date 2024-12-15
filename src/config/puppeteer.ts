import { LaunchOptions } from "puppeteer";
import { config } from ".";

const defaultLaunchSettings: LaunchOptions = {
    headless: true
}

const developmentLaunchSettings: LaunchOptions = defaultLaunchSettings && {

}

const productionLaunchSettings: LaunchOptions = defaultLaunchSettings && {
    executablePath: '/usr/bin/chromium-browser',
    args: ['--no-sandbox', '--disable-gpu', '--disable-setuid-sandbox']
}

export const puppeteerLaunchSettings: LaunchOptions = config.nodeEnv === 'development' 
    ? developmentLaunchSettings
    : productionLaunchSettings;
