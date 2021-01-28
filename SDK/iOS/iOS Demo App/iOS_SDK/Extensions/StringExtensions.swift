//
//  StringExtensions.swift
//  AppServicesSwift
//
//  Created by Aschmann, Paul on 3/26/18.
//  Copyright © 2018 SAP. All rights reserved.
//

import Foundation

extension Data {
    var html2AttributedString: NSAttributedString? {
        do {
            return try NSAttributedString(data: self, options: [.documentType: NSAttributedString.DocumentType.html, .characterEncoding: String.Encoding.utf8.rawValue], documentAttributes: nil)
        } catch {
            print("error:", error)
            return  nil
        }
    }
    var html2String: String {
        return html2AttributedString?.string ?? ""
    }
}

extension String {
    var html2AttributedString: NSAttributedString? {
        return Data(utf8).html2AttributedString
    }
    var html2String: String {
        return html2AttributedString?.string ?? ""
    }
    var stripNewLine: String {
        return replacingOccurrences(of: "\n", with: "", options: .regularExpression, range: nil)
    }
}
