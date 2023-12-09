const express = require('express');
const router = express.Router();
const apps = require('../db/apps');
const appHelp = require('../db/app_help');
const appKeywords = require('../db/app_keywords');
const appReleases = require('../db/app_releases');
const appAnnouncements = require('../db/app_announcements');
const appNews = require('../db/app_news');
const contacts = require('../db/contacts');
const appContacts = require('../db/app_contacts');
const userSettings = require('../db/user_settings');
const dashboard = require('../db/dashboard');
const reports = require('../db/reports');
const jamf = require('../db/jamf');
const notifications = require('../db/notifications');

const cors = require('cors');

const settings = require('../db/settings');
const auth = require('../db/auth');

// authentication js
router.get('/users/me', auth.denyBearerToken, auth.getLoggedInUser);
router.get('/users/myroles', auth.getAuthInfo);

// Routes: Jamf
router.post('/jamf/:bundle_id/info', jamf.postJamfAppinfo);
router.post('/jamf/:jamf_app_id/ipa', jamf.postJamfAppIPA);
router.put('/jamf/:bundle_id/appname', jamf.putJamfAppName);

// Routes: Dashboard
router.get('/dashboard', auth.denyBearerToken, dashboard.getAllStats);
router.get('/dashboard/releases', dashboard.getAllReleases);

// Routes: Reports
router.get('/reports', auth.denyBearerToken, reports.getReportData);

// Routes: apps
router.get('/myapps', auth.denyBearerToken, apps.getMyApps);
router.get('/apps', auth.denyBearerToken, apps.getAllApps);
router.post('/apps', apps.createApp);
router.get('/apps/:app_id', auth.checkACL, apps.getSingleApp);
router.put('/apps/:app_id', apps.updateApp);
router.put('/apps/:app_id/syncicon', apps.updateAppSyncIcon);
router.delete('/apps/:app_id', apps.removeApp);
router.get('/apps/:app_id/usagedata', apps.getTrackingData);

router.get('/apps/:app_id/token', auth.denyBearerToken, apps.getSecureTokenForApp);
router.get('/apps/:app_id/token/refresh', auth.denyBearerToken, apps.replaceSecureTokenForApp);

router.get('/apps/:app_id/appicon/:filename', auth.allowPublic, apps.getAppIcon);
router.post('/apps/:app_id/appicon', apps.createAppIcon);

// Routes: App with bulk data download
router.get('/apps/:app_id/bulkdata', auth.checkACL, apps.getSingleAppBulkData);

// Routes: app help
router.get('/apps/:app_id/help', auth.checkACL, appHelp.getAllAppHelp);
router.get('/apps/:app_id/help/:help_id', auth.checkACL, appHelp.getSingleAppHelp);
router.post('/apps/:app_id/help', appHelp.createAppHelp);
router.put('/apps/:app_id/help/:help_id', appHelp.updateAppHelp);
router.delete('/apps/:app_id/help/:help_id', appHelp.removeAppHelp);

// Routes: app keywords
router.get('/apps/:app_id/keywords', auth.checkACL, appKeywords.getAllAppKeywords);
router.post('/apps/:app_id/keywords', appKeywords.createAppKeyword);
router.put('/apps/:app_id/keywords/:keyword_id', appKeywords.updateAppKeyword);
router.delete('/apps/:app_id/keywords/:keyword_id', appKeywords.removeAppKeyword);

// Routes: app releases
router.get('/apps/:app_id/releases', cors(), auth.checkACL, appReleases.getAllAppReleases);
router.get('/apps/:app_id/releases/:release_id', auth.checkACL, appReleases.getSingleAppRelease);
router.post('/apps/:app_id/releases', appReleases.createAppRelease);
router.put('/apps/:app_id/releases/:release_id', appReleases.updateAppRelease);
router.delete('/apps/:app_id/releases/:release_id', appReleases.removeAppRelease);

// Routes: app announcements
router.get('/apps/:app_id/announcements', auth.checkACL, appAnnouncements.getAllAppAnnouncements);
router.get('/apps/:app_id/announcements/:announcement_id', auth.checkACL, appAnnouncements.getSingleAppAnnouncement);
router.post('/apps/:app_id/announcements', appAnnouncements.createAppAnnouncement);
router.put('/apps/:app_id/announcements/:announcement_id', appAnnouncements.updateAppAnnouncement);
router.delete('/apps/:app_id/announcements/:announcement_id', appAnnouncements.removeAppAnnouncement);

// Routes: app news
router.get('/apps/:app_id/news', auth.checkACL, appNews.getAllAppNews);
router.get('/apps/:app_id/news/:news_id', auth.checkACL, appNews.getSingleAppNews);
router.post('/apps/:app_id/news', appNews.createAppNews);
router.put('/apps/:app_id/news/:news_id', appNews.updateAppNews);
router.delete('/apps/:app_id/news/:news_id', appNews.removeAppNews);

// Routes: app contacts
router.get('/apps/:app_id/contacts', auth.checkACL, appContacts.getAllAppContacts);
router.post('/apps/:app_id/contacts', appContacts.createAppContact);
router.put('/apps/:app_id/contacts/:contact_id', appContacts.updateAppContact);
router.delete('/apps/:app_id/contacts/:contact_id', appContacts.removeAppContact);

// Routes: contacts
router.get('/contacts', auth.denyBearerToken, contacts.getAllContacts);
router.get('/contacts/:contact_id/apps', auth.denyBearerToken, contacts.getContactApps);
router.post('/contacts', contacts.createContact);
router.put('/contacts/:contact_id', contacts.updateContact);
router.delete('/contacts/:contact_id', contacts.removeContact);
router.get('/download/contacts', auth.denyBearerToken, appContacts.getAllContactsDownload);
router.get('/download/app/contacts', auth.denyBearerToken, appContacts.getAllAppContactsDownload);

// Routes: User Settings
router.get('/user_settings/:external_id', auth.denyBearerToken, userSettings.getAllUserSettings);
router.post('/user_settings', auth.denyBearerToken, userSettings.createUserSetting);
router.put('/user_settings/:external_id/:setting_name', userSettings.updateUserSetting);
router.delete('/user_settings/:external_id/:setting_name', userSettings.removeUserSetting);

// Routes: settings
router.get('/settings', auth.denyBearerToken, settings.getAllSettings);
router.get('/settings/:setting_name', auth.denyBearerToken, settings.getSingleSetting);
router.put('/settings/:setting_id', settings.updateSetting);
router.post('/settings', settings.createSetting);
router.delete('/settings/:setting_id', settings.removeSetting);

router.get('/notifications', auth.denyBearerToken, notifications.getAllNotifications);
router.post('/notifications', notifications.createNotification);
router.put('/notifications/:notification_id', notifications.updateNotitifcation);
router.delete('/notifications/:notification_id', notifications.removeNotification);
router.post('/notifications/test', notifications.sendTestNotification);

module.exports = router;
