//
//  ASCHelpDetail.swift
//  AppServicesSwift
//
//  Created by Aschmann, Paul on 3/26/18.
//  Copyright © 2018 SAP. All rights reserved.
//

import UIKit
import WebKit

class ASCHelpDetail: UIViewController, WKNavigationDelegate  {
    
    var ascHelpDetail: Help!
    
    @IBOutlet weak var headerLabel: UILabel!
    @IBOutlet weak var htmlWebView: WKWebView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
//        htmlWebView = WKWebView(frame: CGRect( x: 16, y: 116, width: self.view.frame.width - 16, height: self.view.frame.height - 116 ), configuration: WKWebViewConfiguration() )
        
        htmlWebView.navigationDelegate = self
        self.view.addSubview(htmlWebView)
        
        setupView()
    }
    
    func setupView() {

        let header = ascHelpDetail.title
        headerLabel.text = header
        
        let htmlString = "<span style=\"font-family: '-apple-system', 'HelveticaNeue'; color:#3F3A3A; font-size: 2.5rem\">\(ascHelpDetail.description!)</span>"
        htmlWebView.loadHTMLString(htmlString, baseURL: nil)
    }

    func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        print("Clicked decide")
        
        if navigationAction.navigationType == .linkActivated {
            decisionHandler(.cancel)
            guard let url = navigationAction.request.url else { return }
            UIApplication.shared.open(url, options: convertToUIApplicationOpenExternalURLOptionsKeyDictionary([:]), completionHandler: nil)
        } else {
            decisionHandler(.allow)
        }
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
}

// Helper function inserted by Swift 4.2 migrator.
fileprivate func convertToUIApplicationOpenExternalURLOptionsKeyDictionary(_ input: [String: Any]) -> [UIApplication.OpenExternalURLOptionsKey: Any] {
	return Dictionary(uniqueKeysWithValues: input.map { key, value in (UIApplication.OpenExternalURLOptionsKey(rawValue: key), value)})
}
