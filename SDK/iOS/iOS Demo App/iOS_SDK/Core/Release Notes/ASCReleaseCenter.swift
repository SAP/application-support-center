//
//  ASCReleaseCenter.swift
//  AppServicesSwift
//
//  Created by Aschmann, Paul on 3/26/18.
//  Copyright © 2018 SAP. All rights reserved.
//

import UIKit

class ASCReleaseCenter: UITableViewController {
    
    @IBOutlet weak var emptyState: UIView!
    var ascReleaseItems = [[String: Any]]()
    var notifObserver: Any?
    
    fileprivate func loadReleaseNotes() {
        DispatchQueue.main.async {

            if (ascAppData?.releases.count == 0 ) {
                self.emptyState.isHidden = false
            } else {
                self.emptyState.isHidden = true
            }
            
            self.tableView.rowHeight = UITableView.automaticDimension
            self.tableView.estimatedRowHeight = 120
            self.tableView.reloadData()
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

    override func numberOfSections(in tableView: UITableView) -> Int {
        return ascAppData?.releases.count ?? 0
    }
    
    
    override func tableView(_ tableView: UITableView, heightForHeaderInSection section: Int) -> CGFloat {
        return 41
    }

    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return 1
    }

    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "Cell", for: indexPath) as! ReleaseCell
        let release_note = (ascAppData?.releases[indexPath.section])! as Release
        cell.releaseNotes?.font = UIFont.systemFont(ofSize: 15.0)
        cell.releaseNotes.text = release_note.description?.html2String.stripNewLine
        return cell
    }
    
    
    override func tableView(_ tableView: UITableView, viewForHeaderInSection section: Int) -> UIView? {

        let cell = tableView.dequeueReusableCell(withIdentifier: "Header") as! ReleaseCell

        let release_note = (ascAppData?.releases[section])! as Release
        cell.releaseNotes.text = release_note.version
        return cell
    }
    
    override func tableView(_ tableView: UITableView, heightForFooterInSection section: Int) -> CGFloat {
        return 0.01
    }
}
