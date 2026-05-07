import { Injectable } from '@nestjs/common'
import { Resend } from 'resend'
import { registrationConfirmationTemplate } from './templates/registration-confirmation.template'

@Injectable()
export class MailService {
  private resend: Resend

  constructor() {
    this.resend = new Resend(process.env.RESEND_KEY)
    console.log('[Mail] MAIL_FROM:', process.env.MAIL_FROM ?? '(not set — fallback onboarding@resend.dev)')
  }

  async sendRegistrationConfirmation(opts: {
    to: string
    name: string
    campaignName: string
    campaignSlug: string
  }) {
    const { to, name, campaignName, campaignSlug } = opts
    const eventUrl = `${process.env.FALCON_URL ?? 'http://localhost:3002'}/campaign/${campaignSlug}`

    const { error } = await this.resend.emails.send({
      from: `Japan Fest 2026 <${process.env.MAIL_FROM ?? 'onboarding@resend.dev'}>`,
      to,
      subject: `🎌 Pendaftaran Berhasil — ${campaignName}`,
      html: registrationConfirmationTemplate({ name, campaignName, eventUrl }),
    })

    if (error) throw new Error(error.message)
  }
}
