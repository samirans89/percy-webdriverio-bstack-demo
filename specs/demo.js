const assert = require('assert')
const httpServer = require('http-server')
const { percySnapshot } = require('@percy/webdriverio');
const sync = require('@wdio/sync').default

describe('example page', function() {
  const PORT = 8000
  const URL = `http://localhost:${PORT}`
  const TEST_WIDTHS = [375, 768, 1280];

  let server = null

  before(function() {
    // Start local server to host app under test.
    server = httpServer.createServer({ root: `${__dirname}/../assets` })
    server.listen(PORT)
  })

  after(function() {
    // Shut down the HTTP server.
    server.close()
  })

  it('should load web application pages', async function () {
    // Run tests
    await browser.url(`${URL}/signup`);
    await percySnapshot(browser, 'Signup Page', {widths: TEST_WIDTHS});

    var element = await $('#signup-email')
    await element.setValue("test@percy.io")
    await browser.execute(() => { $('#signup-submit').click() });
    await percySnapshot(browser, 'Signup Page Validation', {widths: TEST_WIDTHS});

    await browser.url(`${URL}/login`);
    await percySnapshot(browser, 'Login Page', {widths: TEST_WIDTHS});

    element = await $('#login-email')
    await element.setValue("test-login@percy.io")
    await browser.execute(() => { $('#login-submit').click() });
    await percySnapshot(browser, 'Login Page Validation', {widths: TEST_WIDTHS});

    await browser.url(`${URL}/`);
    await percySnapshot(browser, 'Index Page', {widths: TEST_WIDTHS});

    await browser.execute(() => { $('#menu-toggle').click() });
    await percySnapshot(browser, 'Index Page Menu Closed', {widths: TEST_WIDTHS});

    // reset menu
    await browser.execute(() => { $('#menu-toggle').click() });

    await browser.execute(() => { $('#messages-toggle').click() });
    await browser.execute(() => { $('#todo-toggle').click() });
    await browser.execute(() => {$('#calendar-toggle').click() });
    await percySnapshot(browser, 'Index Top Row Collapsed', {widths: TEST_WIDTHS});

    // reset page
    await browser.execute(() => { $('#messages-toggle').click() });
    await browser.execute(() => { $('#todo-toggle').click() });
    await browser.execute(() => { $('#calendar-toggle').click() });

    element = await $('#nav-profile-menu')
    element.click();

    await percySnapshot(browser, 'Profile Menu', {widths: TEST_WIDTHS});

    // reset Page
    element = await $('#nav-profile-menu')
    element.click();

    element = await $('#nav-messages-menu')
    element.click();

    await percySnapshot(browser, 'Messages Menu', {widths: TEST_WIDTHS});

    // reset page
    element = await $('#nav-messages-menu')
    element.click();

    element = await $('#nav-tasks-menu')
    element.click();

    await percySnapshot(browser, 'Tasks Menu', {widths: TEST_WIDTHS});

    await browser.url(`${URL}/404_error`);

    await percySnapshot(browser, '404 Page', {widths: TEST_WIDTHS});

    await browser.url(`${URL}/500_error`);

    await percySnapshot(browser, '500 Page', {widths: TEST_WIDTHS});
  })

})
