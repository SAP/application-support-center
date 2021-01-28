//
//  RecommendedAppCell.swift
//  AppServicesSwift
//
//  Created by Aschmann, Paul on 3/27/18.
//  Copyright © 2018 SAP. All rights reserved.
//

import UIKit

class RecommendedAppsCell: UITableViewCell {
    @IBOutlet weak var lblAppName: UILabel?
    @IBOutlet weak var lblAppDesc: UILabel?
    
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }

}
