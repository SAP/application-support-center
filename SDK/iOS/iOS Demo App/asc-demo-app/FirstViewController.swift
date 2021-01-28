//
//  FirstViewController.swift
//  asc-demo-app
//
//  Created by Aschmann, Paul on 9/16/20.
//  Copyright © 2020 Aschmann, Paul. All rights reserved.
//

import UIKit
let infoCenter = ASCInfoCenter()

class FirstViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Init the ASC Info Center which downloads the content from the server
        infoCenter.initHelp(appId: "283", serverURL: "http://localhost:5001/api/v1", accessToken: "d5955891")
    }
    
    @IBAction func showHelpCenter(_ sender: Any) {
        
        // Display the main ASC view
        infoCenter.showHelp(in: self)
        
        // Optional: Use one of these options if you already have a settings view and want to show ASC content
        // infoCenter.showHelp(View: "Help", in: self)
        // infoCenter.showHelp(View: "Release Notes", in: self)
        // infoCenter.showHelp(View: "Announcements", in: self)
        // infoCenter.showHelp(View: "Support", in: self)
        
    }
    
    @IBAction func checkForHelpCenterChanges(_ sender: Any) {
        infoCenter.checkContentVersion()
    }


}

