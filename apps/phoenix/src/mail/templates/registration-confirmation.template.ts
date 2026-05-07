export function registrationConfirmationTemplate(opts: {
  name: string
  campaignName: string
  eventUrl: string
}): string {
  const { name, campaignName, eventUrl } = opts

  return `<!DOCTYPE html>
<html lang="id" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Pendaftaran Berhasil — Japan Fest 2026</title>
  <!--[if mso]>
  <noscript>
    <xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml>
  </noscript>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#f3f4f6;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;-webkit-font-smoothing:antialiased;">

  <!-- Wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f4f6;padding:40px 16px;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.10);">

          <!-- ===== HEADER ===== -->
          <tr>
            <td style="background:linear-gradient(135deg,#dc2626 0%,#7f1d1d 100%);padding:0;">
              <!-- Top pattern -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:16px 40px 0;text-align:right;">
                    <span style="font-size:52px;opacity:0.15;letter-spacing:8px;color:#fff;font-weight:900;">祭</span>
                  </td>
                </tr>
              </table>
              <!-- Logo area -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:8px 40px 40px;text-align:center;">
                    <div style="display:inline-block;background:rgba(255,255,255,0.12);border-radius:20px;padding:18px 32px;margin-bottom:20px;">
                      <span style="font-size:40px;">🎌</span>
                    </div>
                    <h1 style="margin:0 0 6px;color:#ffffff;font-size:30px;font-weight:900;letter-spacing:-0.5px;line-height:1.2;">
                      Japan Fest 2026
                    </h1>
                    <p style="margin:0;color:rgba(255,255,255,0.75);font-size:14px;letter-spacing:2px;text-transform:uppercase;">
                      Tokyo Natsu Matsuri
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Kanji strip -->
          <tr>
            <td style="background:#fef2f2;border-top:3px solid #fca5a5;border-bottom:1px solid #fecaca;padding:12px 40px;text-align:center;">
              <span style="font-size:18px;color:#dc2626;letter-spacing:14px;opacity:0.6;font-weight:700;">夏 祭 り &nbsp; ２０２６</span>
            </td>
          </tr>

          <!-- ===== BODY ===== -->
          <tr>
            <td style="padding:48px 40px 32px;">

              <!-- Greeting -->
              <h2 style="margin:0 0 10px;font-size:24px;font-weight:800;color:#111827;line-height:1.3;">
                Halo, ${name}! 👋
              </h2>
              <p style="margin:0 0 32px;font-size:15px;color:#6b7280;line-height:1.7;">
                Kabar gembira! Pendaftaran Anda untuk event berikut telah berhasil kami terima dan dikonfirmasi.
              </p>

              <!-- Event card -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:36px;">
                <tr>
                  <td style="background:linear-gradient(135deg,#fef2f2,#fff1f2);border:2px solid #fca5a5;border-radius:16px;padding:24px 28px;">
                    <p style="margin:0 0 6px;font-size:10px;font-weight:800;color:#dc2626;text-transform:uppercase;letter-spacing:2px;">Event Terdaftar</p>
                    <p style="margin:0 0 12px;font-size:22px;font-weight:900;color:#111827;line-height:1.3;">${campaignName}</p>
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background:#dc2626;border-radius:100px;padding:4px 14px;">
                          <span style="color:#fff;font-size:11px;font-weight:700;">✓ &nbsp;Terkonfirmasi</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Steps heading -->
              <p style="margin:0 0 20px;font-size:15px;font-weight:800;color:#111827;">
                Langkah selanjutnya:
              </p>

              <!-- Step 1 -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
                <tr>
                  <td width="40" valign="top">
                    <div style="width:32px;height:32px;background:#dc2626;border-radius:50%;text-align:center;line-height:32px;">
                      <span style="color:#fff;font-size:13px;font-weight:800;">1</span>
                    </div>
                  </td>
                  <td style="padding-left:14px;vertical-align:middle;">
                    <p style="margin:0;font-size:14px;color:#374151;line-height:1.6;">
                      <strong>Simpan email ini</strong> sebagai bukti pendaftaran Anda.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Step 2 -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
                <tr>
                  <td width="40" valign="top">
                    <div style="width:32px;height:32px;background:#dc2626;border-radius:50%;text-align:center;line-height:32px;">
                      <span style="color:#fff;font-size:13px;font-weight:800;">2</span>
                    </div>
                  </td>
                  <td style="padding-left:14px;vertical-align:middle;">
                    <p style="margin:0;font-size:14px;color:#374151;line-height:1.6;">
                      Tim kami akan <strong>menghubungi Anda</strong> melalui email atau nomor HP yang telah didaftarkan.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Step 3 -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:40px;">
                <tr>
                  <td width="40" valign="top">
                    <div style="width:32px;height:32px;background:#dc2626;border-radius:50%;text-align:center;line-height:32px;">
                      <span style="color:#fff;font-size:13px;font-weight:800;">3</span>
                    </div>
                  </td>
                  <td style="padding-left:14px;vertical-align:middle;">
                    <p style="margin:0;font-size:14px;color:#374151;line-height:1.6;">
                      Bersiaplah untuk merasakan pengalaman budaya Jepang yang <strong>tak terlupakan!</strong> 🌸
                    </p>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${eventUrl}"
                      style="display:inline-block;background:linear-gradient(135deg,#dc2626,#991b1b);color:#ffffff;text-decoration:none;font-size:15px;font-weight:800;padding:16px 44px;border-radius:100px;letter-spacing:0.5px;box-shadow:0 4px 16px rgba(220,38,38,0.4);">
                      🎌 &nbsp;Lihat Detail Event
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- ===== DIVIDER ===== -->
          <tr>
            <td style="padding:0 40px;">
              <hr style="border:none;border-top:1px solid #f3f4f6;margin:0;" />
            </td>
          </tr>

          <!-- ===== FOOTER ===== -->
          <tr>
            <td style="padding:32px 40px 40px;text-align:center;">
              <div style="margin-bottom:16px;font-size:26px;letter-spacing:8px;">🌸 🎆 🏯</div>
              <p style="margin:0 0 6px;font-size:13px;color:#9ca3af;line-height:1.6;">
                Email ini dikirim secara otomatis. Mohon tidak membalas email ini.
              </p>
              <p style="margin:0 0 16px;font-size:13px;color:#9ca3af;">
                Jika Anda tidak merasa mendaftar, abaikan email ini.
              </p>
              <p style="margin:0;font-size:12px;color:#d1d5db;font-weight:600;letter-spacing:0.5px;">
                © 2026 Japan Fest · Tokyo Natsu Matsuri · All rights reserved
              </p>
            </td>
          </tr>

        </table>
        <!-- /Card -->

      </td>
    </tr>
  </table>
  <!-- /Wrapper -->

</body>
</html>`
}
