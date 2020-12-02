/* eslint-disable mocha/no-setup-in-describe */
/* eslint-disable global-require */
/* eslint-disable no-unused-vars */

var common = require('./common');

function importTest(name, path) {
  describe(name, () => {
    require(path);
  });
}

setTimeout(() => {
  describe('ASC Server Tests', () => {
    // Create a new app and a contact for other test use
    importTest('Startup', './tests/startup.test');

    importTest('API', './tests/api.test');
    importTest('Apps', './tests/apps.test');
    importTest('AppHelp', './tests/app_help.test');
    importTest('AppKeywords', './tests/app_keywords.test');
    importTest('AppReleases', './tests/app_releases.test');
    importTest('AppAnnouncements', './tests/app_announcements.test');
    importTest('Settings', './tests/settings.test');
    importTest('Contacts', './tests/contacts.test');
    importTest('AppContacts', './tests/app_contacts.test');
    importTest('UserSettings', './tests/user_settings.test');

    // Delete new app and contact
    importTest('Cleanup', './tests/cleanup.test');
  });
  run();
}, 1000);
