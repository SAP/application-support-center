//
//  App.swift
//  asc-demo-app
//
//  Created by Aschmann, Paul on 9/17/20.
//  Copyright © 2020 Aschmann, Paul. All rights reserved.
//

import Foundation

struct Help: Codable {
    var help_id: Int
    var app_id: Int
    var title: String
    var description: String?
    var created: String?
    var sort_order: Int?
    var visible: Bool?
}

struct Announcement: Codable {
    var announcement_id: Int
    var app_id: Int
    var title: String
    var description: String?
    var created: String?
    var sort_order: Int?
    var visible: Bool?
}

struct Release: Codable {
    var release_id: Int
    var app_id: Int
    var version: String?
    var description: String?
    var created: String?
    var sort_order: Int?
    var visible: Bool?
}


struct Contact: Codable {
    var app_id: Int
    var contact_id: Int
    var external_id: String?
    var first_name: String?
    var last_name: String?
    var email: String?
    var created: String?
    var role: String?
}

struct App: Codable {
    var app_id: Int
    var app_name: String
    var category: String?
    var status: String?
    var created: String?
    var modified: String?
    var notes: String?
    var monitoring_url: String?
    var go_live: String?
    var retired: String?
    var usage_tracking_id: String?
    var technology: String?
    var content_id: String?
    var jamf_id: String?
    var bundle_id: String?
    var feedback_service_id: String?
    var git_url: String?
}

struct AppData: Codable {
    var help: [Help]
    var releases: [Release]
    var contacts: [Contact]
    var announcements: [Announcement]
}
