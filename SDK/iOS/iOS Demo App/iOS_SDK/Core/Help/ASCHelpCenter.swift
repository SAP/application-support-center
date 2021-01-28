//
//  ASCHelpCenter.swift
//  AppServicesSwift
//
//  Created by Aschmann, Paul on 3/23/18.
//  Copyright © 2018 SAP. All rights reserved.
//

import UIKit


class ASCHelpCenter: UITableViewController {
    
    //@IBOutlet weak var btnClose: UIBarButtonItem!
    @IBOutlet weak var empyState: UIView!
    
    //var ascHelpItems = [[String: Any]]()
    //var ascFAQItems = [[String: Any]]()
    var notifObserver: Any?
    
    fileprivate func loadASCData() {
        DispatchQueue.main.async {
            if (ascAppData?.help.count == 0) {
                self.empyState.isHidden = false
            } else {
                self.empyState.isHidden = true
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
        
        self.tableView.register(UITableViewCell.self, forCellReuseIdentifier: "Cell")
        loadASCData()
        
        notifObserver = NotificationCenter.default.addObserver(forName: NSNotification.Name.init("ascDataLoaded"), object: nil, queue: nil) { (_) in
            //any time asc data load in complete run this method
            self.loadASCData()
        }
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    
    //remove observer here
    deinit {
        guard let notifObserver = notifObserver else {
            return
        }
        NotificationCenter.default.removeObserver(notifObserver)
    }
        
    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        let rowCount = ascAppData?.help.count ?? 0
        return rowCount
    }
    
    
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "Cell", for: indexPath)
        let help = ascAppData?.help[indexPath.row]
        cell.textLabel?.font = UIFont.systemFont(ofSize: 15.0)
        cell.textLabel?.text = help?.title
        cell.accessoryType = .disclosureIndicator
        return cell
    }


    @IBAction func closeHelp(_ sender: Any) {
        self.dismiss(animated: false, completion: nil)
    }
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if (segue.identifier == "showHelpDetail") {
            let vc = segue.destination as! ASCHelpDetail
            vc.ascHelpDetail = ascAppData?.help[(tableView.indexPathForSelectedRow?.row)!]
        }
    }
    
    override func tableView(_ tableView: UITableView, heightForHeaderInSection section: Int) -> CGFloat {
        return 0.01
    }
    
    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        //rowcount will always be one to show None value
        if indexPath.section == 0 , ascAppData?.help.count == indexPath.row {
            return
        }
        self.performSegue(withIdentifier: "showHelpDetail", sender: self)
    }
}
