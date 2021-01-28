//
//  ASCAnnouncementCenter.swift
//  asc-demo-app
//
//  Created by Aschmann, Paul on 9/16/20.
//  Copyright © 2020 Aschmann, Paul. All rights reserved.
//

import UIKit


class ASCAnnouncementCenter: UITableViewController {
    
    @IBOutlet weak var emptyState: UIView!
    var notifObserver: Any?
    
    fileprivate func loadReleaseNotes() {
        DispatchQueue.main.async {
            if (ascAppData?.announcements.count == 0 ) {
                self.emptyState.isHidden = false
            } else {
                self.emptyState.isHidden = true
            }
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
        
        tableView.rowHeight = UITableView.automaticDimension
        tableView.estimatedRowHeight = 600
        
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
        return ascAppData?.announcements.count ?? 0
    }
    
    
    override func tableView(_ tableView: UITableView, heightForHeaderInSection section: Int) -> CGFloat {
        return 65
    }

    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return 1
    }

    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "Cell", for: indexPath) 
        let announcement = ascAppData?.announcements[indexPath.section]
        cell.textLabel?.font = UIFont.systemFont(ofSize: 15.0)
        cell.textLabel?.text = announcement?.description?.html2String.stripNewLine
        return cell
    }
    
    func tableView(tableView: UITableView, heightForRowAtIndexPath indexPath: NSIndexPath) -> CGFloat {
        return UITableView.automaticDimension
    }
    
    override func tableView(_ tableView: UITableView, viewForHeaderInSection section: Int) -> UIView? {
        let cell = tableView.dequeueReusableCell(withIdentifier: "Header") as! AnnouncementCell
        let announcement = (ascAppData?.announcements[section])! as Announcement
        
        cell.announcementTitle.text = announcement.title
        cell.announcementDate.text = formatDateToString(dateString: announcement.created ?? "")
        return cell
    }
    
    override func tableView(_ tableView: UITableView, heightForFooterInSection section: Int) -> CGFloat {
        return 1
    }
    
    func formatDateToString (dateString: String) -> String {
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
        let date = dateFormatter.date(from: dateString)
        
        let formatter = DateFormatter()
        formatter.dateFormat = "d MMM y HH:mm"
        return formatter.string(from: date ?? Date())
    }
}
