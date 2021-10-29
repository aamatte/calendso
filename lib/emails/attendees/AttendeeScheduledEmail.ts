import dayjs, { Dayjs } from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

import EventMail from "../EventMail";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);

export default class AttendeeScheduledEmail extends EventMail {
  /**
   * Returns the email text as HTML representation.
   *
   * @protected
   */
  protected getHtmlRepresentation(): string {
    return `
    <!doctype html>
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

    <head>
      <title>${this.calEvent.language('confirmed_event_type_subject', { eventType: this.calEvent.type, organizerName: this.calEvent.team?.name || this.calEvent.organizer.name, date: `${this.getInviteeStart().format("LT")} ${this.getInviteeStart().format("dddd")}, ${this.getInviteeStart().format("LL")}` })}</title>
      <!--[if !mso]><!-->
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <!--<![endif]-->
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style type="text/css">
        #outlook a {
          padding: 0;
        }

        body {
          margin: 0;
          padding: 0;
          -webkit-text-size-adjust: 100%;
          -ms-text-size-adjust: 100%;
        }

        table,
        td {
          border-collapse: collapse;
          mso-table-lspace: 0pt;
          mso-table-rspace: 0pt;
        }

        img {
          border: 0;
          height: auto;
          line-height: 100%;
          outline: none;
          text-decoration: none;
          -ms-interpolation-mode: bicubic;
        }

        p {
          display: block;
          margin: 13px 0;
        }
      </style>
      <!--[if mso]>
            <noscript>
            <xml>
            <o:OfficeDocumentSettings>
              <o:AllowPNG/>
              <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
            </xml>
            </noscript>
            <![endif]-->
      <!--[if lte mso 11]>
            <style type="text/css">
              .mj-outlook-group-fix { width:100% !important; }
            </style>
            <![endif]-->
      <!--[if !mso]><!-->
      <link href="https://fonts.googleapis.com/css?family=Roboto:400,500,700" rel="stylesheet" type="text/css">
      <style type="text/css">
        @import url(https://fonts.googleapis.com/css?family=Roboto:400,500,700);
      </style>
      <!--<![endif]-->
      <style type="text/css">
        @media only screen and (min-width:480px) {
          .mj-column-per-100 {
            width: 100% !important;
            max-width: 100%;
          }
        }
      </style>
      <style media="screen and (min-width:480px)">
        .moz-text-html .mj-column-per-100 {
          width: 100% !important;
          max-width: 100%;
        }
      </style>
      <style type="text/css">
        @media only screen and (max-width:480px) {
          table.mj-full-width-mobile {
            width: 100% !important;
          }

          td.mj-full-width-mobile {
            width: auto !important;
          }
        }
      </style>
    </head>

    <body style="word-spacing:normal;background-color:#F5F5F5;">
      <div style="background-color:#F5F5F5;">
        <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
        <div style="margin:0px auto;max-width:600px;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
            <tbody>
              <tr>
                <td style="direction:ltr;font-size:0px;padding:0px;padding-top:40px;text-align:center;">
                  <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr></tr></table><![endif]-->
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" bgcolor="#FFFFFF" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
        <div style="background:#FFFFFF;background-color:#FFFFFF;margin:0px auto;max-width:600px;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#FFFFFF;background-color:#FFFFFF;width:100%;">
            <tbody>
              <tr>
                <td style="border-left:1px solid #E1E1E1;border-right:1px solid #E1E1E1;border-top:1px solid #E1E1E1;direction:ltr;font-size:0px;padding:30px 20px 0 20px;text-align:center;">
                  <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:558px;" ><![endif]-->
                  <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                      <tbody>
                        <tr>
                          <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                              <tbody>
                                <tr>
                                  <td style="width:64px;">
                                    <img height="64" src="https://cal.com/green-check-circle.png" style="border:0;display:block;outline:none;text-decoration:none;height:64px;width:100%;font-size:13px;" width="64" />
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <!--[if mso | IE]></td></tr></table><![endif]-->
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" bgcolor="#FFFFFF" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
        <div style="background:#FFFFFF;background-color:#FFFFFF;margin:0px auto;max-width:600px;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#FFFFFF;background-color:#FFFFFF;width:100%;">
            <tbody>
              <tr>
                <td style="border-left:1px solid #E1E1E1;border-right:1px solid #E1E1E1;direction:ltr;font-size:0px;padding:0px;text-align:center;">
                  <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:598px;" ><![endif]-->
                  <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                      <tbody>
                        <tr>
                          <td align="center" style="font-size:0px;padding:10px 25px;padding-top:24px;padding-bottom:0px;word-break:break-word;">
                            <div style="font-family:Roboto, Helvetica, sans-serif;font-size:24px;font-weight:700;line-height:24px;text-align:center;color:#292929;">${this.calEvent.language('your_event_has_been_scheduled')}</div>
                          </td>
                        </tr>
                        <tr>
                          <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                            <div style="font-family:Roboto, Helvetica, sans-serif;font-size:16px;font-weight:400;line-height:24px;text-align:center;color:#494949;">${this.calEvent.language('emailed_you_and_attendees')}</div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <!--[if mso | IE]></td></tr></table><![endif]-->
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" bgcolor="#FFFFFF" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
        <div style="background:#FFFFFF;background-color:#FFFFFF;margin:0px auto;max-width:600px;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#FFFFFF;background-color:#FFFFFF;width:100%;">
            <tbody>
              <tr>
                <td style="border-left:1px solid #E1E1E1;border-right:1px solid #E1E1E1;direction:ltr;font-size:0px;padding:15px 0px 0 0px;text-align:center;">
                  <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:598px;" ><![endif]-->
                  <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                      <tbody>
                        <tr>
                          <td align="center" style="font-size:0px;padding:10px 25px;padding-bottom:15px;word-break:break-word;">
                            <p style="border-top:solid 1px #E1E1E1;font-size:1px;margin:0px auto;width:100%;">
                            </p>
                            <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 1px #E1E1E1;font-size:1px;margin:0px auto;width:548px;" role="presentation" width="548px" ><tr><td style="height:0;line-height:0;"> &nbsp;
    </td></tr></table><![endif]-->
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <!--[if mso | IE]></td></tr></table><![endif]-->
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" bgcolor="#FFFFFF" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
        <div style="background:#FFFFFF;background-color:#FFFFFF;margin:0px auto;max-width:600px;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#FFFFFF;background-color:#FFFFFF;width:100%;">
            <tbody>
              <tr>
                <td style="border-left:1px solid #E1E1E1;border-right:1px solid #E1E1E1;direction:ltr;font-size:0px;padding:0px;text-align:center;">
                  <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:598px;" ><![endif]-->
                  <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                      <tbody>
                        <tr>
                          <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                            <div style="font-family:Roboto, Helvetica, sans-serif;font-size:16px;font-weight:500;line-height:1;text-align:left;color:#3E3E3E;">
                              ${this.getWhat()}
                              ${this.getWhen()}
                              ${this.getWho()}
                              ${this.getLocation()}
                              ${this.getAdditionalNotes()}
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <!--[if mso | IE]></td></tr></table><![endif]-->
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" bgcolor="#FFFFFF" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
        <div style="background:#FFFFFF;background-color:#FFFFFF;margin:0px auto;max-width:600px;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#FFFFFF;background-color:#FFFFFF;width:100%;">
            <tbody>
              <tr>
                <td style="border-left:1px solid #E1E1E1;border-right:1px solid #E1E1E1;direction:ltr;font-size:0px;padding:0px;text-align:center;">
                  <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:598px;" ><![endif]-->
                  <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                      <tbody>
                        <tr>
                          <td align="center" style="font-size:0px;padding:10px 25px;padding-bottom:15px;word-break:break-word;">
                            <p style="border-top:solid 1px #E1E1E1;font-size:1px;margin:0px auto;width:100%;">
                            </p>
                            <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 1px #E1E1E1;font-size:1px;margin:0px auto;width:548px;" role="presentation" width="548px" ><tr><td style="height:0;line-height:0;"> &nbsp;
    </td></tr></table><![endif]-->
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <!--[if mso | IE]></td></tr></table><![endif]-->
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" bgcolor="#FFFFFF" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
        <div style="background:#FFFFFF;background-color:#FFFFFF;margin:0px auto;max-width:600px;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#FFFFFF;background-color:#FFFFFF;width:100%;">
            <tbody>
              <tr>
                <td style="border-bottom:1px solid #E1E1E1;border-left:1px solid #E1E1E1;border-right:1px solid #E1E1E1;direction:ltr;font-size:0px;padding:0px;text-align:center;">
                  <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:598px;" ><![endif]-->
                  <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                      <tbody>
                        <tr>
                          <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                            <div style="font-family:Roboto, Helvetica, sans-serif;font-size:16px;font-weight:500;line-height:0px;text-align:left;color:#3E3E3E;">
                              <p>${this.calEvent.language('need_to_reschedule_or_cancel')}</p>
                              <p style="font-weight: 400; line-height: 24px;">${this.getManageLink()}</p>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <!--[if mso | IE]></td></tr></table><![endif]-->
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
        <div style="margin:0px auto;max-width:600px;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
            <tbody>
              <tr>
                <td style="direction:ltr;font-size:0px;padding:0px;text-align:center;">
                  <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
                  <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                      <tbody>
                        <tr>
                          <td align="center" style="font-size:0px;padding:10px 25px;padding-top:32px;word-break:break-word;">
                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                              <tbody>
                                <tr>
                                  <td style="width:89px;">
                                    <a href="#" target="_blank">
                                      <img height="19" src="https://i.imgur.com/esapZ47.png" style="border:0;display:block;outline:none;text-decoration:none;height:19px;width:100%;font-size:13px;" width="89" />
                                    </a>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <!--[if mso | IE]></td></tr></table><![endif]-->
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!--[if mso | IE]></td></tr></table><![endif]-->
      </div>
    </body>
    </html>
    `
  }

  protected getManageLink(): string {
    const manageText = this.calEvent.language('manage_this_event');
    return `<a href="# style="color: #3E3E3E;" alt="${manageText}">${manageText}</a>`
  }

  protected getWhat(): string {
    return `
    <div style="line-height: 6px;">
      <p>${this.calEvent.language("what")}</p>
      <p style="font-weight: 400; line-height: 24px;">Workshop</p>
    </div>`
  }

  protected getWhen(): string {
    return `
    <p style="height: 6px"></p>
    <div style="line-height: 6px;">
      <p>${this.calEvent.language("when")}</p>
      <p style="font-weight: 400; line-height: 24px;">Friday, August 30, 2021 | 9:00 am - 10:00 am <span style="color: #888888">(Europe/Dublin)</span></p>
    </div>`
  }

  protected getWho(): string {
    return `
    <p style="height: 6px"></p>
    <div style="line-height: 6px;">
      <p>${this.calEvent.language("who")}</p>
      <div style="font-weight: 400; line-height: 24px;">Mihai Colceriu <span style="color: #888888"><a href="mailto:email@example.com" style="color: #888888;">email@example.com</a></span></div>
      <div style="font-weight: 400; line-height: 24px;">Michael James <span style="color: #888888"><a href="mailto:email2@example.com" style="color: #888888;">email2@example.com</a></span></div>
    </div>`
  }

  protected getAdditionalNotes(): string {
    return `
    <p style="height: 6px"></p>
    <div style="line-height: 6px;">
      <p>${this.calEvent.language("additional_notes")}</p>
      <p style="font-weight: 400; line-height: 24px;">I've picked Zoom for now but we might look to do this in person.</p>
    </div>
    `
  }

  /**
   * Adds the video call information to the mail body.
   *
   * @protected
   */
  protected getLocation(): string {
    return `
    <p style="height: 6px"></p>
    <div style="line-height: 6px;">
      <p>${this.calEvent.language("where")}</p>
      <p style="font-weight: 400; line-height: 24px;">Zoom <a href="#" target="_blank"><img src="https://i.imgur.com/rKsIBcc.png" width="12px"></img></a></p>
    </div>
    `;
    // if (this.calEvent.additionInformation?.hangoutLink) {
    //   return `<a href="${this.calEvent.additionInformation?.hangoutLink}">${this.calEvent.additionInformation?.hangoutLink}</a><br />`;
    // }
    //
    // if (
    //   this.calEvent.additionInformation?.entryPoints &&
    //   this.calEvent.additionInformation?.entryPoints.length > 0
    // ) {
    //   const locations = this.calEvent.additionInformation?.entryPoints
    //     .map((entryPoint) => {
    //       return `
    //       ${this.calEvent.language("join_by_entrypoint", { entryPoint: entryPoint.entryPointType })}: <br />
    //       <a href="${entryPoint.uri}">${entryPoint.label}</a> <br />
    //     `;
    //     })
    //     .join("<br />");
    //
    //   return `${locations}`;
    // }
    //
    // return this.calEvent.location ? `${this.calEvent.location}<br /><br />` : "";
  }

  /**
   * Returns the inviteeStart value used at multiple points.
   *
   * @private
   */
  protected getInviteeStart(): Dayjs {
    return dayjs(this.calEvent.startTime).tz(this.calEvent.attendees[0].timeZone);
  }
}
