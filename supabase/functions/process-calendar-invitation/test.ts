// test.ts
// Basic tests for the refactored calendar invitation processing

import { assertEquals } from "https://deno.land/std@0.177.0/testing/asserts.ts"
import { validatePayload, validateInvitationEmail, isValidWebhookRequest } from "./validation.ts"
import { detectCalendarProvider, extractCalendarNameFromSubject } from "./calendar-providers.ts"

Deno.test("validatePayload - valid payload", () => {
  const payload = {
    to: "user-abc123@calendar.example.com",
    from: "sender@gmail.com",
    subject: "Calendar invitation"
  }
  
  const result = validatePayload(payload)
  assertEquals(result.isValid, true)
})

Deno.test("validatePayload - missing to field", () => {
  const payload = {
    from: "sender@gmail.com",
    subject: "Calendar invitation"
  }
  
  const result = validatePayload(payload)
  assertEquals(result.isValid, false)
  assertEquals(result.error, 'Missing "to" field')
})

Deno.test("validateInvitationEmail - valid email", () => {
  const result = validateInvitationEmail("user-abc123@calendar.example.com")
  assertEquals(result, true)
})

Deno.test("validateInvitationEmail - invalid email", () => {
  const result = validateInvitationEmail("regular@example.com")
  assertEquals(result, false)
})

Deno.test("isValidWebhookRequest - SendGrid webhook", () => {
  const request = new Request("https://example.com", {
    headers: {
      "user-agent": "Sendlib/1.0"
    }
  })
  
  const result = isValidWebhookRequest(request)
  assertEquals(result, true)
})

Deno.test("isValidWebhookRequest - regular request", () => {
  const request = new Request("https://example.com", {
    headers: {
      "user-agent": "Mozilla/5.0"
    }
  })
  
  const result = isValidWebhookRequest(request)
  assertEquals(result, false)
})

Deno.test("detectCalendarProvider - Google", () => {
  const result = detectCalendarProvider("user@gmail.com", "Google Calendar invitation")
  assertEquals(result, "google")
})

Deno.test("detectCalendarProvider - Outlook", () => {
  const result = detectCalendarProvider("user@outlook.com", "Outlook calendar invitation")
  assertEquals(result, "outlook")
})

Deno.test("detectCalendarProvider - Apple", () => {
  const result = detectCalendarProvider("user@icloud.com", "Kalender beitreten")
  assertEquals(result, "apple")
})

Deno.test("extractCalendarNameFromSubject - German", () => {
  const result = extractCalendarNameFromSubject('Kalender "Yoga Classes" von john@example.com')
  assertEquals(result, "Yoga Classes")
})

Deno.test("extractCalendarNameFromSubject - English", () => {
  const result = extractCalendarNameFromSubject('Join calendar "Team Events"')
  assertEquals(result, "Team Events")
})

Deno.test("extractCalendarNameFromSubject - no match", () => {
  const result = extractCalendarNameFromSubject("Random subject")
  assertEquals(result, undefined)
}) 