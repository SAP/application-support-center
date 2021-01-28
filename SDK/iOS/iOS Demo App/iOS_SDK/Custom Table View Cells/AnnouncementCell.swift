//
//  AnnouncementCell.swift
//  asc-demo-app
//
//  Created by Aschmann, Paul on 9/18/20.
//  Copyright © 2020 Aschmann, Paul. All rights reserved.
//

import UIKit

class AnnouncementCell: UITableViewCell {
    @IBOutlet weak var announcementTitle: UILabel!
    @IBOutlet weak var announcementDate: UILabel!
    
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
