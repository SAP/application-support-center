SELECT pg_catalog.setval(pg_get_serial_sequence('app_releases', 'release_id'), MAX(release_id)) FROM app_releases;


SELECT pg_catalog.setval(pg_get_serial_sequence('app_announcements', 'announcement_id'), MAX(announcement_id)) FROM app_announcements;


SELECT pg_catalog.setval(pg_get_serial_sequence('app_help', 'help_id'), MAX(help_id)) FROM app_help;


SELECT pg_catalog.setval(pg_get_serial_sequence('apps', 'app_id'), MAX(app_id)) FROM apps;

SELECT pg_catalog.setval(pg_get_serial_sequence('contacts', 'contact_id'), MAX(contact_id)) FROM contacts;


SELECT pg_catalog.setval(pg_get_serial_sequence('notifications', 'notification_id'), MAX(notification_id)) FROM notifications;


SELECT pg_catalog.setval(pg_get_serial_sequence('settings', 'setting_id'), MAX(setting_id)) FROM settings;


SELECT pg_catalog.setval(pg_get_serial_sequence('app_keywords', 'keyword_id'), MAX(keyword_id)) FROM app_keywords;



