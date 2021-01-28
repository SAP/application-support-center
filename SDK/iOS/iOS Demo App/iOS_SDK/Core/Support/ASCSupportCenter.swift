//
//  ASCSupportCenter.swift
//  asc-demo-app
//
//  Created by Aschmann, Paul on 9/16/20.
//  Copyright © 2020 Aschmann, Paul. All rights reserved.
//


import UIKit

class ASCSupportCenter: UITableViewController {
    
    @IBOutlet weak var emptyState: UIView!
    var notifObserver: Any?
    
    fileprivate func loadReleaseNotes() {
        DispatchQueue.main.async {

            if (ascAppData?.contacts.count == 0 ) {
                self.emptyState.isHidden = false
            } else {
                self.emptyState.isHidden = true
            }
        }
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        if (ascParentType != "Nav" && ascDisplayType == "Direct") {
            navigationItem.leftBarButtonItem = UIBarButtonItem(title: "Close", style: .plain, target: self, action: #selector(closeHelp))
            navigationItem.hidesBackButton = true
        }
        
        self.loadReleaseNotes()
        notifObserver = NotificationCenter.default.addObserver(forName: NSNotification.Name.init("ascDataLoaded"), object: nil, queue: nil) { (_) in
            //any time asc data load in complete run this method
            self.loadReleaseNotes()
        }
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    //remove observer here
    deinit {
        guard let notifObserver = notifObserver else {
            return
        }
        NotificationCenter.default.removeObserver(notifObserver)
    }
    
    @IBAction func closeHelp(_ sender: Any) {
        self.dismiss(animated: false, completion: nil)
    }

    // MARK: - Table view data source
    
    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        let rowCount = ascAppData?.contacts.count ?? 0
        return rowCount
    }
    
    override func tableView(_ tableView: UITableView, heightForHeaderInSection section: Int) -> CGFloat {
        return 0.01
    }

    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "Cell", for: indexPath) 
        cell.textLabel?.text = (ascAppData?.contacts[indexPath.row].first_name)! + " " + (ascAppData?.contacts[indexPath.row].last_name)!
        cell.detailTextLabel?.text = ascAppData?.contacts[indexPath.row].role
        return cell
    }
    
    override func tableView(_ tableView: UITableView, heightForFooterInSection section: Int) -> CGFloat {
        return 1
    }
}
