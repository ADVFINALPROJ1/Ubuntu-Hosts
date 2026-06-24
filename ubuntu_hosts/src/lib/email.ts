/** Mail Services */
import nodemailer from "nodemailer"

type EmailParams = {
    to: string
    subject: string
    text: string
    html?: string
}

function createTransporter() {
  const config = {
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  }
  return nodemailer.createTransport(config)
}

export async function sendMail({ to, subject, text, html }: EmailParams) {
  const transporter = createTransporter()

  const message = {
    from: process.env.SMTP_USER,
    to,
    subject,
    text,
    html,
  }

  try {
    await transporter.sendMail(message)
    console.log(`Email sent to ${to}: ${subject}`)
  } catch (error) {
    console.error("Error sending email:", error)
    throw error
  }
}

export async function accountVerificationMail({ to, subject, text }: EmailParams) {
  await sendMail({ to, subject, text })
}

export async function registrationConfirmationMail({ 
  to, 
  name, 
  eventTitle, 
  eventDate, 
  eventTime, 
  eventLocation,
  attendeeId 
}: {
  to: string
  name: string
  eventTitle: string
  eventDate: string
  eventTime: string
  eventLocation: string
  attendeeId: number
}) {
  const subject = `Registration Confirmed: ${eventTitle}`
  const text = `Hi ${name},

Your registration for "${eventTitle}" has been confirmed!

Event Details:
- Date: ${eventDate}
- Time: ${eventTime}
- Location: ${eventLocation}
- Registration ID: ${attendeeId}

We look forward to seeing you there!

Best regards,
Ubuntu Hosts Team`

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb; }
        .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
        .detail-row:last-child { border-bottom: none; }
        .label { font-weight: bold; color: #6b7280; }
        .value { color: #1f2937; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Registration Confirmed!</h1>
      </div>
      <div class="content">
        <p>Hi ${name},</p>
        <p>Your registration for <strong>"${eventTitle}"</strong> has been confirmed!</p>
        
        <div class="details">
          <div class="detail-row">
            <span class="label">Date:</span>
            <span class="value">${eventDate}</span>
          </div>
          <div class="detail-row">
            <span class="label">Time:</span>
            <span class="value">${eventTime}</span>
          </div>
          <div class="detail-row">
            <span class="label">Location:</span>
            <span class="value">${eventLocation}</span>
          </div>
          <div class="detail-row">
            <span class="label">Registration ID:</span>
            <span class="value">${attendeeId}</span>
          </div>
        </div>
        
        <p>We look forward to seeing you there!</p>
        
        <div class="footer">
          <p>Best regards,<br>Ubuntu Hosts Team</p>
        </div>
      </div>
    </body>
    </html>
  `

  await sendMail({ to, subject, text, html })
}

export async function eventUpdateAlertMail({ 
  to, 
  name, 
  eventTitle, 
  oldDate, 
  newDate, 
  oldTime, 
  newTime, 
  oldLocation, 
  newLocation,
}: {
  to: string
  name: string
  eventTitle: string
  oldDate: string
  newDate: string
  oldTime: string
  newTime: string
  oldLocation: string
  newLocation: string
}) {
  const subject = `Event Updated: ${eventTitle}`
  const changes: string[] = []
  if (oldDate !== newDate) changes.push(`Date: ${oldDate} → ${newDate}`)
  if (oldTime !== newTime) changes.push(`Time: ${oldTime} → ${newTime}`)
  if (oldLocation !== newLocation) changes.push(`Location: ${oldLocation} → ${newLocation}`)
  
  const text = `Hi ${name},

The event "${eventTitle}" has been updated with the following changes:

${changes.map(c => `- ${c}`).join('\n')}

Please update your calendar accordingly.

Best regards,
Ubuntu Hosts Team`

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f59e0b; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b; }
        .change-row { padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
        .change-row:last-child { border-bottom: none; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Event Updated</h1>
      </div>
      <div class="content">
        <p>Hi ${name},</p>
        <p>The event <strong>"${eventTitle}"</strong> has been updated with the following changes:</p>
        
        <div class="details">
          ${changes.map(c => `<div class="change-row">${c}</div>`).join('')}
        </div>
        
        <p>Please update your calendar accordingly.</p>
        
        <div class="footer">
          <p>Best regards,<br>Ubuntu Hosts Team</p>
        </div>
      </div>
    </body>
    </html>
  `

  await sendMail({ to, subject, text, html })
}

export async function eventCancellationAlertMail({ 
  to, 
  name, 
  eventTitle, 
  eventDate, 
  eventTime, 
  eventLocation,
}: {
  to: string
  name: string
  eventTitle: string
  eventDate: string
  eventTime: string
  eventLocation: string
}) {
  const subject = `Event Cancelled: ${eventTitle}`
  const text = `Hi ${name},

We regret to inform you that the event "${eventTitle}" has been cancelled.

Event Details:
- Date: ${eventDate}
- Time: ${eventTime}
- Location: ${eventLocation}

We apologize for any inconvenience this may cause.

Best regards,
Ubuntu Hosts Team`

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #ef4444; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444; }
        .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
        .detail-row:last-child { border-bottom: none; }
        .label { font-weight: bold; color: #6b7280; }
        .value { color: #1f2937; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Event Cancelled</h1>
      </div>
      <div class="content">
        <p>Hi ${name},</p>
        <p>We regret to inform you that the event <strong>"${eventTitle}"</strong> has been cancelled.</p>
        
        <div class="details">
          <div class="detail-row">
            <span class="label">Date:</span>
            <span class="value">${eventDate}</span>
          </div>
          <div class="detail-row">
            <span class="label">Time:</span>
            <span class="value">${eventTime}</span>
          </div>
          <div class="detail-row">
            <span class="label">Location:</span>
            <span class="value">${eventLocation}</span>
          </div>
        </div>
        
        <p>We apologize for any inconvenience this may cause.</p>
        
        <div class="footer">
          <p>Best regards,<br>Ubuntu Hosts Team</p>
        </div>
      </div>
    </body>
    </html>
  `

  await sendMail({ to, subject, text, html })
}
