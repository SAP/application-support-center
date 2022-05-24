module.exports = {
  getAllNotifications,
  createNotification,
  updateNotitifcation,
  removeNotification,
  sendEmail,
  sendDebugEmail,
  sendNotifications
};

const db = require('./db');
const logger = require('../util/logger');
const nodemailer = require('nodemailer');
const request = require('request');

function sendNotifications(releaseId, systemId, expDate) {
  // Sends notification to external systems if configured in the .env file
  var slackUrl = '';
  if (global.asc.environment === 'dev') {
    slackUrl = global.asc.dev_slack_webhook_url;
  } else {
    slackUrl = global.asc.prod_slack_webhook_url;
  }
  if (slackUrl !== '') {
    db.one('select * from app_releases inner join apps on app_releases.app_id = apps.app_id where release_id = $1', releaseId)
      .then((data) => {
        var desc = data.description.replace(/<[^>]*>?/gm, '');
        desc += 'Provisioning Profile Expiration: ' + expDate;
        var json = {
          blocks: [
            {
              type: 'header',
              text: {
                type: 'plain_text',
                text: 'New release pushed to Jamf (' + systemId + '): ' + data.app_name + ' (' + data.technology + ') ' + data.version,
                emoji: true
              }
            },
            {
              type: 'divider'
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: desc
              },
              accessory: {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: 'View',
                  emoji: true
                },
                value: 'View',
                url: 'https://appsupport.services.sap/portal/index.html?appid=' + data.app_id,
                action_id: 'button-action'
              }
            }
          ]
        };
        if (data) {
          request({
            method: 'POST',
            uri: slackUrl,
            headers: {
              'Content-Type': 'application/json'
            },
            json: json
          }, (error) => {
            if (error) {
              logger.winston.error(error);
            }
            logger.winston.info('Successfully sent notification to Slack');
          });
        }
      })
      .catch((err) => {
        logger.winston.error(err);
      });
  }
}

function sendDebugEmail(text) {
  try {
    var transporter = nodemailer.createTransport({
      host: global.asc.smtp_host,
      port: global.asc.smtp_port,
      secure: false, // true for 465, false for other ports
      auth: {
        user: global.asc.smtp_user,
        pass: global.asc.smtp_password
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    transporter.sendMail({
      from: 'appservices@sap.com',
      to: 'paul.aschmann@sap.com',
      subject: 'Debug Email',
      text: text
    });
    console.log('Mail sent');
  } catch (err) {
    console.log(err);
  }
}

function sendEmail(recipient, appId, appName, expirationDate, daysTillExpiration, names) {
  try {
    var transporter = nodemailer.createTransport({
      host: global.asc.smtp_host,
      port: global.asc.smtp_port,
      secure: false, // true for 465, false for other ports
      auth: {
        user: global.asc.smtp_user,
        pass: global.asc.smtp_password
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    transporter.sendMail({
      from: 'appservices@sap.com',
      to: recipient,
      subject: 'Provisioning Profile Expiring Soon: ' + appName,
      text: expirationDate + ' ' + daysTillExpiration + ' App ID: ' + appId,
      html: getHtml(appId, appName, expirationDate, daysTillExpiration, names)
    });
    console.log('Mail sent');
  } catch (err) {
    console.log(err);
  }
}

function getAllNotifications(req, res, next) {
  logger.winston.info('Notifications.getAllNotifications');
  db.any('select notification_id, to_char(notification_date, \'MM/DD/YYYY\') as notification_date, notification_text from notifications order by notification_date desc')
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).json({ data: err });
    });
}

function createNotification(req, res, next) {
  logger.winston.info('Notifications.createNotification');

  db.one('insert into notifications(notification_date, notification_text) values ($1, $2) returning *', [req.body.notification_date, req.body.notification_text])
    .then((data) => {
      res.status(201).json({
        status: 'success', message: 'Inserted', lastID: data.notification_id, data: data
      });
    })
    .catch((err) => {
      logger.winston.error('Error inserting a new record: ' + err);
      res.status(400).json({ data: err });
    });
}

function updateNotitifcation(req, res, next) {
  logger.winston.info('Announcements.updateAppAnnouncements');

  db.none('update notifications set notification_date = $1, notification_text = $2 where notification_id = $3', [req.body.notification_date, req.body.notification_text, req.params.notification_id])
    .then((data) => {
      res.status(200).json({ status: 'success', message: 'Updated', data: data });
    })
    .catch((err) => {
      logger.winston.error('Error updating the record: ' + err);
      res.status(400).json({ data: err });
    });
}

function removeNotification(req, res, next) {
  logger.winston.info('Notifications.removeNotification');

  db.none('delete from notifications where notification_id = $1', req.params.notification_id)
    .then(() => {
      res.status(200).json({ status: 'success', message: 'Removed' });
    })
    .catch((err) => {
      logger.winston.error('Error removing the record: ' + err);
      res.status(400).json({ data: err });
    });
}

function getHtml(appId, appName, expirationDate, daysTillExpiration, names) {
  return `
  <html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns:m="http://schemas.microsoft.com/office/2004/12/omml" xmlns="http://www.w3.org/TR/REC-html40">

<head>
  <meta content="text/html; charset=utf-8" http-equiv="Content-Type">
  <meta content="Word.Document" name="ProgId">
  <meta content="Microsoft Word 15" name="Generator">
  <meta content="Microsoft Word 15" name="Originator">
  <!--[if !mso]>
  <style>
  v\:* {behavior:url(#default#VML);}
  o\:* {behavior:url(#default#VML);}
  w\:* {behavior:url(#default#VML);}
  .shape {behavior:url(#default#VML);}
  </style>
  <![endif]-->
  <!--[if gte mso 9]><xml>
   <o:OfficeDocumentSettings>
    <o:AllowPNG/>
   </o:OfficeDocumentSettings>
  </xml><![endif]-->
  <!--[if gte mso 9]><xml>
   <w:WordDocument>
    <w:SpellingState>Clean</w:SpellingState>
    <w:DocumentKind>DocumentEmail</w:DocumentKind>
    <w:TrackMoves>false</w:TrackMoves>
    <w:TrackFormatting/>
    <w:HyphenationZone>21</w:HyphenationZone>
    <w:ValidateAgainstSchemas/>
    <w:SaveIfXMLInvalid>false</w:SaveIfXMLInvalid>
    <w:IgnoreMixedContent>false</w:IgnoreMixedContent>
    <w:AlwaysShowPlaceholderText>false</w:AlwaysShowPlaceholderText>
    <w:DoNotPromoteQF/>
    <w:LidThemeOther>DE-AT</w:LidThemeOther>
    <w:LidThemeAsian>X-NONE</w:LidThemeAsian>
    <w:LidThemeComplexScript>X-NONE</w:LidThemeComplexScript>
    <w:Compatibility>
     <w:DoNotExpandShiftReturn/>
     <w:BreakWrappedTables/>
     <w:SnapToGridInCell/>
     <w:WrapTextWithPunct/>
     <w:UseAsianBreakRules/>
     <w:DontGrowAutofit/>
     <w:SplitPgBreakAndParaMark/>
     <w:EnableOpenTypeKerning/>
     <w:DontFlipMirrorIndents/>
     <w:OverrideTableStyleHps/>
    </w:Compatibility>
    <w:BrowserLevel>MicrosoftInternetExplorer4</w:BrowserLevel>
    <m:mathPr>
     <m:mathFont m:val="Cambria Math"/>
     <m:brkBin m:val="before"/>
     <m:brkBinSub m:val="&#45;-"/>
     <m:smallFrac m:val="off"/>
     <m:dispDef/>
     <m:lMargin m:val="0"/>
     <m:rMargin m:val="0"/>
     <m:defJc m:val="centerGroup"/>
     <m:wrapIndent m:val="1440"/>
     <m:intLim m:val="subSup"/>
     <m:naryLim m:val="undOvr"/>
    </m:mathPr></w:WordDocument>
  </xml><![endif]-->

  <style>
    <!--
    /* Style Definitions */
    p.MsoNormal,
    li.MsoNormal,
    div.MsoNormal {
      margin: 0in;
      margin-bottom: .0001pt;
      font-size: 11.0pt;
      font-family: "Calibri", sans-serif;
    }

    span.body-text {
      font-size: 11.5pt;
      line-height: 115%;
      font-family: "Arial", sans-serif;
      color: black
    }

    a.clear-notification-text {
      margin-top: 16pt;
      margin-bottom: 16pt;
      font-size: 11.5pt;
      line-height: 115%;
      font-family: "Arial", sans-serif;
      color: black
    }

    span.small-text {
      font-size: 7.0pt;
      font-family: "Arial", sans-serif;
      color: #555555
    }

    span.header-text {
      font-size: 28.0pt;
      font-family: "Calibri", sans-serif;
      color: black;
    }

    span.subheader-text {
      font-size: 28.0pt;
      font-family: "Calibri", sans-serif;
      color: #FFC000;
    }

    p {
      margin-right: 0in;
      margin-left: 0in;
      font-size: 11.0pt;
      font-family: "Calibri", sans-serif;
    }

    span.disclaimer1 {
      font-family: "Arial", sans-serif;
      color: #555555;
      font-weight: normal;
      font-style: normal;
      text-decoration: none;
      text-decoration: none;
    }

    @page WordSection1 {
      size: 8.5in 11.0in;
      margin: 70.85pt 70.85pt 56.7pt 70.85pt;
      mso-header-margin: .5in;
      mso-footer-margin: .5in;
      mso-paper-source: 0;
    }
    -->
  </style>
  <!--[if gte mso 10]>
  <style>
   /* Style Definitions */
   table.MsoNormalTable
    {mso-style-name:"Table Normal";
    mso-tstyle-rowband-size:0;
    mso-tstyle-colband-size:0;
    mso-style-noshow:yes;
    mso-style-priority:99;
    mso-style-parent:"";
    mso-padding-alt:0in 5.4pt 0in 5.4pt;
    mso-para-margin:0in;
    mso-para-margin-bottom:.0001pt;
    mso-pagination:widow-orphan;
    font-size:10.0pt;
    font-family:"Times New Roman",serif;}
  </style>
  <![endif]-->
  <!--[if gte mso 9]><xml>
   <o:shapedefaults v:ext="edit" spidmax="1027"/>
  </xml><![endif]-->
  <!--[if gte mso 9]><xml>
   <o:shapelayout v:ext="edit">
    <o:idmap v:ext="edit" data="1"/>
   </o:shapelayout></xml><![endif]-->
  <title></title>
</head>

<body bgcolor="#E6E7E8" lang="EN-US" link="#3391D5" style="word-wrap:break-word" vlink="#3391D5">
  <div class="WordSection1">
    <p class="MsoNormal"><a id="_MailOriginal" name="_MailOriginal"><span lang="DE-AT">&nbsp;</span></a></p>
    <div align="center">
      <table border="0" cellpadding="0" cellspacing="0" class="MsoNormalTable" style="width:100.0%;background:#E6E7E8;border-collapse:collapse;" width="100%">
        <tr>
          <td style="padding:0in 0in 0in 0in">
            <div align="center">
              <table border="0" cellpadding="0" cellspacing="0" class="MsoNormalTable" style="width:6.25in;border-collapse:collapse" width="600">
                <tr>
                  <td style="padding:0in 0in 0in 0in">
                    <table border="0" cellpadding="0" cellspacing="0" class="MsoNormalTable" style="max-width:6.25in;border-collapse:collapse">
                      <tr>
                        <td style="background:white;padding:0in 0in 0in 0in">
                          <span></span>
                          <table border="0" cellpadding="0" cellspacing="0" class="MsoNormalTable" style="width:100.0%;border-collapse:collapse" width="100%">
                            <tr style="height:45.0pt">
                              <td style="background:#F7F7F7;padding:0in 0in 0in 0in;height:45.0pt" valign="top">
                                <p align="right" class="MsoNormal" style="text-align:right;line-height:30.0pt;">
                                  <img align="right" alt="SAP Logo" height="68" src="data:image/png;base64,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" width="181">
                                </p>
                              </td>
                            </tr>
                          </table>
                          <table border="0" cellpadding="0" cellspacing="0" class="MsoNormalTable" style="width:100.0%;border-collapse:collapse" width="100%">
                            <tr style="height:113.4pt">
                              <td style="background:#F7F7F7;padding:0in 22.5pt 7.5pt 22.5pt;height:113.4pt">
                                <!-- EDIT BELOW -->
                                <p class="MsoNormal" style="margin-bottom:6.0pt"><strong><span class="header-text">ALERT</span></strong></p>
                                <p class="MsoNormal"><strong><span class="subheader-text">Provisioning profile will expire soon!</span></strong></p>
                                <!-- ---------------- -->
                              </td>
                              <td style="background:#F7F7F7;padding:0in 0in 0in 0in;height:113.4pt">
                                <div>
                                  <div>
                                    <div style="margin-bottom:6.0pt">
                                      <p class="MsoNormal">
                                        <img height="151" src="data:image/png;base64,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" width="151">
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </table>
                          <p class="MsoNormal">&nbsp;</p>
                          <table border="0" cellpadding="0" cellspacing="0" class="MsoNormalTable" style="width:100.0%;border-collapse:collapse" width="100%">
                            <tr>
                              <td style="background:#F7F7F7;padding:0in 22.5pt 7.5pt 22.5pt">
                                <div>
                                  <div>
                                    <p class="MsoNormal" style="margin-top:18pt;"><span class="body-text">Hi ` + names + `</span></p>
                                    <!-- EDIT BELOW -->
                                    <p class="MsoNormal" style="margin-top:12.0pt"><b><span style="font-size:15.0pt">The provisioning profile of ` + appName + ` will expire in ` + daysTillExpiration + ` days (` + expirationDate + `).</span></b></p>
                                    <p><span class="body-text">Please check the status of the date in ASC, and if needed, upload a new version before the expiration date.</span></p>
                                    <!-- ------------------- -->
                                    <p><span class="body-text">Kind regards,</span></p>
                                    <p><span class="body-text">Application Support Center</span></p>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </table>
                          <p class="MsoNormal">&nbsp;</p>
                          <table border="0" cellpadding="0" cellspacing="0" class="MsoNormalTable" style="width:100.0%;border-collapse:collapse;" width="100%">
                            <tr>
                              <td style="background:#F7F7F7;padding:0in 22.5pt 15.0pt 22.5pt;">
                                <table align="left" border="0" cellpadding="0" cellspacing="0" class="MsoNormalTable" style="background:#DEDEDE;border-collapse:collapse;margin-left:-2.25pt;margin-right:-2.25pt;margin-top:20px;">
                                  <tr>
                                    <td style="background:#F0AB00;padding:9pt 9.0pt 9pt 9.0pt;">
                                      <p align="center" class="MsoNormal" style="text-align:center;line-height:12.75pt"><b><span class="body-text" style="padding:0in"><a href="http://appsupport.services.sap/admin/" target="_blank">More Information</a></span></b></p>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:0in 0in 0in 0in">
                          <table border="0" cellpadding="0" cellspacing="0" class="MsoNormalTable" style="width:100.0%;border-collapse:collapse" width="100%">
                            <tr>
                              <td style="padding:15.0pt 22.5pt 22.5pt 22.5pt">
                                <div id="footer-address-terms">
                                  <p align="right" style="margin-top:0in;margin-right:0in;margin-bottom:7.5pt;margin-left:0in;text-align:right;line-height:12.75pt"><a href="http://www.sap.com/copyright" target="_blank"><span><span style="font-size:8.0pt;color:#7F7F7F">Copyright/Trademark</span></span></a> <span><span style="font-size:8.0pt;">&nbsp;&nbsp;|&nbsp;&nbsp;</span></span> <a href="http://www.sap.com/about/legal/privacy.html" target="_blank"><span><span style="font-size:8.0pt;color:#7F7F7F">Privacy</span></span></a> <span><span style="font-size:8.0pt;">&nbsp;&nbsp;|&nbsp;&nbsp;</span></span> <a href="http://www.sap.com/about/legal/impressum.html" target="_blank"><span><span style="font-size:8.0pt;color:#7F7F7F">Impressum</span></span></a></p>
                                  <p style="margin-top:0in;margin-right:0in;margin-bottom:7.5pt;margin-left:0in;line-height:12.75pt"><span class="disclaimer1 small-text">SAP SE, Dietmar-Hopp-Allee 16, 69190 Walldorf, Germany</span> <span class="small-text"><br>
                                      <br>
                                      Pflichtangaben / Mandatory Disclosure Statements:</span> <a href="http://www.sap.com/about/legal/impressum.html" target="_blank"><span class="small-text">http://www.sap.com/about/legal/impressum.html</span></a> <span class="small-text"><br>
                                      Diese E-Mail kann Betriebs- oder Geschäftsgeheimnisse oder sonstige vertrauliche Informationen enthalten. Sollten Sie diese E-Mail irrtümlich erhalten haben, ist Ihnen eine Kenntnisnahme des Inhalts, eine Vervielfältigung oder Weitergabe der E-Mail ausdrücklich untersagt. Bitte benachrichtigen Sie uns und vernichten Sie die empfangene E-Mail. Vielen Dank.<br>
                                      <br>
                                      This e-mail may contain trade secrets or privileged, undisclosed, or otherwise confidential information. If you have received this e-mail in error, you are hereby notified that any review, copying, or distribution of it is strictly prohibited. Please inform us immediately and destroy the original transmittal. Thank you for your cooperation.</span></p>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </div>
          </td>
        </tr>
      </table>
    </div>
  </div>
</body>

</html>`;
}
