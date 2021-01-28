//
//  ASInfoCenter.swift
//  AppServicesSwift
//
//  Created by Aschmann, Paul on 3/20/18.
//  Copyright © 2018 SAP. All rights reserved.
//

import UIKit
import MessageUI

var ascDisplayType : String = "Dashboard"
var ascParentType : String = "View"

var ascApp : App?
var ascAppData: AppData?

var ascAppId : String = ""
var ascAppIcon : UIImage?
var ascServerUrl : String = ""
var ascAccessToken : String = "" //Required, and can be found in your ASC Admin Portal

class ASCInfoCenter: UITableViewController, MFMailComposeViewControllerDelegate {
    
    var currentETag : String = ""
    
    @IBOutlet weak var imgAppIcon: UIImageView!
    @IBOutlet weak var lblAppName: UILabel!
    @IBOutlet weak var lblAppVersion: UILabel!
    
    @IBOutlet weak var tvcAnnouncements: UITableViewCell!
        
    override func viewDidLoad() {
        super.viewDidLoad()
        setupAppDetails()
        if (ascParentType == "View") {
            navigationItem.leftBarButtonItem = UIBarButtonItem(title: "Close", style: .plain, target: self, action: #selector(closeHelp))
        }
    }
    
    public func initHelp(appId: String, serverURL: String, accessToken: String) {
        ascAppId = appId
        ascServerUrl = serverURL
        ascAccessToken = accessToken
        checkContentVersion()
    }
    
    private func setupAppDetails() {
        lblAppName.text = Bundle.main.object(forInfoDictionaryKey: "CFBundleName") as? String
        lblAppVersion.text = Bundle.main.object(forInfoDictionaryKey: "CFBundleShortVersionString") as? String
        tvcAnnouncements?.update(count: ascAppData?.announcements.count ?? 0)
        
        if (Bundle.main.icon != nil) {
            imgAppIcon.image = Bundle.main.icon
        } else {
            print("ASC: No app icon found yet, displaying a placeholder.")
        }
    }
        
    public func checkContentVersion() {
        let urlString = ascServerUrl + "/apps/\(ascAppId)?access_token=\(ascAccessToken)"
        guard let requestUrl = URL(string:urlString) else { return }
        let dataTask = URLSession.shared.dataTask(with: requestUrl) { (data, response, error) in
            if error == nil && data != nil {
                // parse JSON
                do {
                    ascApp = try JSONDecoder().decode(App.self, from: data!)
                    if (ascApp?.content_id != self.currentETag) {
                        print("ASC: Content differences, downloading new data.")
                        self.currentETag = ascApp?.content_id ?? "No version"
                        self.downloadAppData()
                    } else {
                        print("ASC: No content changes found.")
                    }
                } catch let error{
                    debugPrint(error.localizedDescription)
                }
            }
        }
        dataTask.resume()
    }
    
    public func showHelp(View: String? = "", in controller: UIViewController?) {
        let storyboard = UIStoryboard(name: "ASCstoryboard", bundle: nil)
        ascDisplayType = View == "" ? "Dashboard" : "Direct"
        
        if let parentNavController = controller?.navigationController {
            //We push the new views since pass in the navigationController
            
            ascParentType = "Nav"
            var viewId = ""
            
            switch View {
            case "Help":
                viewId = "ASCHelpCenter"
            case "Release Notes":
                viewId = "ASCReleaseCenter"
            case "Support":
                viewId = "ASCSupportCenter"
            case "Announcements":
                viewId = "ASCAnnouncementCenter"
            default:
                viewId = "ASCInfoCenter"
            }

            let vc = storyboard.instantiateViewController(withIdentifier: viewId)
            parentNavController.pushViewController(vc, animated: true)
            
        } else {
            //This case we push our own nav controller since there is not already one in the app
            //wrap ASC infocenter in uinavigationcontroller.
            //open.
            
            ascParentType = "View"
            let vc = storyboard.instantiateViewController(withIdentifier: "ASCNavController")
            
            if (View == "Help") {
                vc.performSegue(withIdentifier: "showHelpCenter", sender: self)
            } else if (View == "Release Notes") {
                vc.performSegue(withIdentifier: "showReleaseNotes", sender: self)
            } else if (View == "Support") {
                vc.performSegue(withIdentifier: "showSupport", sender: self)
            } else if (View == "Announcements") {
                vc.performSegue(withIdentifier: "showAnnouncements", sender: self)
            }
            
            vc.modalPresentationStyle = .formSheet
            UIApplication.shared.topMostViewController()!.present(vc, animated: true, completion: nil)
        }
    }
    
    private func downloadAppData() {
        let urlString = ascServerUrl + "/apps/\(ascAppId)/bulkdata?access_token=\(ascAccessToken)"
        guard let requestUrl = URL(string:urlString) else { return }
        let dataTask = URLSession.shared.dataTask(with: requestUrl) { (data, response, error) in
            if error == nil && data != nil {
                // parse JSON
                do {
                    ascAppData = try JSONDecoder().decode(AppData.self, from: data!)
                } catch let error{
                    debugPrint(error.localizedDescription)
                }
            }
        }
        dataTask.resume()
    }
    
    @IBAction func closeHelp(_ sender: Any) {
        self.dismiss(animated: true, completion: nil)
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
}

extension UIApplication {
    class func topViewController(controller: UIViewController? = UIApplication.shared.windows.first(where: \.isKeyWindow)?.rootViewController) -> UIViewController? {
        if let navigationController = controller as? UINavigationController {
            return topViewController(controller: navigationController.visibleViewController)
        }
        if let tabController = controller as? UITabBarController {
            if let selected = tabController.selectedViewController {
                return topViewController(controller: selected)
            }
        }
        if let presented = controller?.presentedViewController {
            return topViewController(controller: presented)
        }
        return controller
    }
}

extension UIViewController {
    func topMostViewController() -> UIViewController {
        
        if let navigation = self as? UINavigationController {
            return navigation.visibleViewController!.topMostViewController()
        }
        
        if let tab = self as? UITabBarController {
            if let selectedTab = tab.selectedViewController {
                return selectedTab.topMostViewController()
            }
            return tab.topMostViewController()
        }
        
        if self.presentedViewController == nil {
            return self
        }
        if let navigation = self.presentedViewController as? UINavigationController {
            return navigation.visibleViewController!.topMostViewController()
        }
        if let tab = self.presentedViewController as? UITabBarController {
            if let selectedTab = tab.selectedViewController {
                return selectedTab.topMostViewController()
            }
            return tab.topMostViewController()
        }
        return self.presentedViewController!.topMostViewController()
    }
}

extension UIApplication {
    func topMostViewController() -> UIViewController? {
        if #available(iOS 13, *) {
            return UIApplication.shared.windows.first { $0.isKeyWindow }?.rootViewController
        } else {
            return UIApplication.shared.keyWindow?.rootViewController
        }
    }
}

extension UITableViewCell {
  func update(count: Int) {
    if count > 0 {

        // Create label
        let fontSize: CGFloat = 14
        let label = UILabel()
        label.font = UIFont.systemFont(ofSize: fontSize)
        label.textAlignment = .center
        label.textColor = UIColor.white
        label.backgroundColor = UIColor.lightGray

        // Add count to label and size to fit
        label.text = "\(NSNumber(value: count))"
        label.sizeToFit()

        // Adjust frame to be square for single digits or elliptical for numbers > 9
        var frame: CGRect = label.frame
        frame.size.height += CGFloat(Int(0.4 * fontSize))
        frame.size.width = (count <= 9) ? frame.size.height : frame.size.width + CGFloat(Int(fontSize))
        label.frame = frame

        // Set radius and clip to bounds
        label.layer.cornerRadius = frame.size.height / 2.0
        label.clipsToBounds = true

        // Show label in accessory view and remove disclosure
        self.accessoryView = label
        self.accessoryType = .detailButton
    } else {
        self.accessoryView = nil
        self.accessoryType = .none
    }
 }
}

extension Bundle {
    public var icon: UIImage? {
        if let icons = infoDictionary?["CFBundleIcons"] as? [String: Any],
            let primaryIcon = icons["CFBundlePrimaryIcon"] as? [String: Any],
            let iconFiles = primaryIcon["CFBundleIconFiles"] as? [String],
            let lastIcon = iconFiles.last {
            return UIImage(named: lastIcon)
        }
        return nil
    }
}
