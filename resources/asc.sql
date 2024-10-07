create table apps
(
	app_id serial not null
		constraint apps_pkey
			primary key,
	app_name varchar,
	category varchar,
	status varchar,
	created timestamp default now(),
	modified timestamp default now(),
	notes varchar,
	monitoring_url varchar,
	go_live timestamp,
	retired timestamp,
	usage_tracking_id varchar,
	technology varchar,
	content_id timestamp default now(),
	jamf_id varchar,
	bundle_id varchar,
	feedback_service_id varchar,
	git_url varchar,
	expiration_date timestamp,
	feedback_start_date timestamp,
	feedback_end_date timestamp,
	feedback_type varchar,
	feedback_info_type varchar,
	feedback_repeat_days varchar,
	feedback_repeat_on varchar,
	feedback_status varchar
);

create unique index apps_app_id_uindex
	on apps (app_id);

create table contacts
(
	contact_id serial not null
		constraint contacts_pkey
			primary key,
	external_id varchar,
	first_name varchar,
	last_name varchar,
	email varchar,
	created timestamp
);

create unique index contacts_contact_id_uindex
	on contacts (contact_id);

create table app_help
(
	help_id serial not null
		constraint app_help_pkey
			primary key,
	app_id integer,
	description varchar,
	created timestamp default now(),
	sort_order integer,
	visible boolean,
	title varchar
);


create unique index app_help_help_id_uindex
	on app_help (help_id);

create table app_releases
(
	release_id serial not null
		constraint app_releases_pkey
			primary key,
	app_id integer,
	version varchar,
	description varchar,
	release_date timestamp,
	sort_order integer,
	visible boolean,
	created timestamp default now(),
	file_metadata text
);

create unique index app_releases_release_id_uindex
	on app_releases (release_id);

create table app_announcements
(
	announcement_id serial not null
		constraint app_annoucements_pkey
			primary key,
	app_id integer,
	title varchar,
	description varchar,
	sort_order integer,
	visible boolean,
	created timestamp default now()
);

create unique index app_annoucements_announcement_id_uindex
	on app_announcements (announcement_id);

create table app_contacts
(
	contact_id integer not null,
	app_id integer not null,
	role varchar not null,
	constraint app_contacts_pk
		unique (contact_id, app_id, role)
);

create table app_keywords
(
	app_id integer,
	keyword varchar,
	description varchar,
	created timestamp default now(),
	keyword_id serial not null
		constraint app_keywords_pk
			primary key
);

create unique index app_keywords_keyword_id_uindex
	on app_keywords (keyword_id);

create table app_tokens
(
	app_id integer,
	token varchar,
	created timestamp default now()
);

create table user_settings
(
	external_id varchar not null,
	setting_name varchar,
	setting_value varchar
);

create table settings
(
	setting_id serial not null
		constraint settings_pkey
			primary key,
	setting_name varchar,
	setting_value varchar,
	setting_key varchar
);

create unique index settings_setting_id_uindex
	on settings (setting_id);

create table log
(
	app_id integer,
	event varchar,
	description varchar,
	created timestamp default now()
);

create table version
(
	version varchar
);

create table notifications
(
	notification_id serial not null
		constraint notifications_pk
			primary key,
	notification_date date default now(),
	notification_text varchar
);

create unique index notifications_notification_id_uindex
	on notifications (notification_id);

