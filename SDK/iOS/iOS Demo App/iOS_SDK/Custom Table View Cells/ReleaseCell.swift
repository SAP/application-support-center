//
//  ReleaseCell.swift
//  AppServicesSwift
//
//  Created by Aschmann, Paul on 3/26/18.
//  Copyright © 2018 SAP. All rights reserved.
//

import UIKit

class ReleaseCell: UITableViewCell {
    @IBOutlet weak var releaseNotes: UILabel!
    
    override func awakeFromNib() {
        super.awakeFromNib()
        self.layoutIfNeeded()
        // Initialization code
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }

}
