# Soap Opera Sequence — Slam5

5 emaili, wysyłane dzień po dniu po zapisaniu się przez quiz.
Język: angielski (slam5.com target = EN users)
Personalizacja: [BLOCKER_LABEL] = atrybut z Brevo (Overthinker / Low-Starter / Perfectionist / Overwhelmed)

---

## Email 1 — Day 0 (od razu po quizie)
**Subject:** `You're a [BLOCKER_LABEL]. Here's what that means.`

Hey,

You just found out you're [BLOCKER_LABEL].

That's not a label. That's an explanation.

It's the reason your to-do list grows but nothing gets done.
It's the reason you open your laptop and close it 20 minutes later.
It's the reason you know exactly what you need to do and still can't start.

Tomorrow I'll show you why willpower never worked for you.
(It's not your fault. Seriously.)

Kuba, founder of Slam5

P.S. Your free trial starts the moment you're ready. No credit card. 3 days. slam5.com

---

## Email 2 — Day 1
**Subject:** `I lost 6 months to a blank screen.`

Hey,

2022. I had a business to build.

I'd sit down at my desk at 9am.
Open my laptop.
Stare at the screen.

And then somehow it was 2pm and I had done nothing.

Not because I was lazy.
Not because I didn't care.

My brain just wouldn't start.

I tried everything. Morning routines. Cold showers. Notion systems. Pomodoro. Journaling.

Nothing worked because all of it required me to already be "in motion."

The problem wasn't discipline. The problem was the ignition.

Tomorrow I'll tell you what finally clicked.

Kuba

---

## Email 3 — Day 2
**Subject:** `The 5-minute rule changed everything. Then it stopped working.`

Hey,

Everyone told me: "Just start for 5 minutes."

And yeah, sometimes it worked.

But some days those 5 minutes never came.
Because even deciding what to start on was paralyzing.

That's when I realized the real problem:

It's not motivation. It's friction.

Every time I had to decide what to do next, my brain checked out.

So I built something that removes that decision entirely.

One task. One timer. Nothing else visible.

That became Slam5.

Not a productivity system. Not another app with 47 features.
Just the thing that gets you moving when nothing else does.

Try it free today. slam5.com

Kuba

---

## Email 4 — Day 3
**Subject:** `What actually happens after day 1`

Hey,

People don't expect much from Slam5 at first.

They think it's "just a timer."

Then they come back the next day.

Here's what they tell me:

"I got more done in 25 minutes than I did all week."

"I didn't realize how much my to-do list was killing me."

"I actually finished something."

That last one hits different when you have ADHD.

Finishing things feels like a miracle.
It's not. You just needed the right conditions.

Your 3-day trial is still waiting. slam5.com

Kuba

---

## Email 5 — Day 4
**Subject:** `Last call.`

Hey,

Your free trial expires soon.

No drama. No fake countdown.

Just this: if you haven't tried Slam5 yet, now's the time.

3 days. No credit card. No commitment.

If it doesn't work for you, you walk away. Simple.

But if it does?

You'll finally know what it feels like to actually finish your day.

slam5.com

Kuba

---

## Notatki techniczne
- Trigger: zapis emaila w quizie (/quiz) -> kontakt trafia do listy SLAM5 (ID: 3) w Brevo
- Automation w Brevo: "When added to list SLAM5" -> send sequence day 0, 1, 2, 3, 4
- Gdy user się zarejestruje w Slam5: usunąć z listy 3, dodać do "Slam5 Registered" (zatrzymuje sekwencję)
- SMTP na Brevo czeka na aktywację (email do contact@brevo.com wysłany 2026-04-06)
