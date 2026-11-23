/* Scene: Inbox triage (Posteingang sortieren). Facts from film-inbox-automation: Tischlerei Lindqvist-Roth, Monday 23 November, 07:36. */
(window.MODELS = window.MODELS || {})['inbox-automation'] = {
  aria: { en: 'Model of the inbox triage automation: the business, what comes in, how it thinks, what it does', de: 'Modell der Posteingang-Automatisierung: der Betrieb, was reinkommt, wie es denkt, was es tut' },
  steps: [
    { t: { en: 'Your inbox, as a model', de: 'Dein Postfach als Modell' }, p: { en: 'First it learns what lands in your inbox: complaints, quote requests, invoices, applications, spam.', de: 'Zuerst lernt es, was in deinem Postfach landet: Beschwerden, Angebotsanfragen, Rechnungen, Bewerbungen, Spam.' } },
    { t: { en: 'What comes in', de: 'Was reinkommt' }, p: { en: 'Every new email, with its attachments, before anyone is at work.', de: 'Jede neue Mail mit ihren Anhängen, bevor jemand im Betrieb ist.' } },
    { t: { en: 'How it thinks', de: 'Wie es denkt' }, p: { en: 'Your rules: what each mail is, how urgent it is, and how your company writes.', de: 'Deine Regeln: was jede Mail ist, wie dringend sie ist und wie dein Betrieb schreibt.' } },
    { t: { en: 'What it can do', de: 'Was es tun kann' }, p: { en: 'It sets labels and folders, alerts your phone and writes reply drafts. It sends nothing.', de: 'Es setzt Labels und Ordner, alarmiert dein Handy und schreibt Antwortentwürfe. Es sendet nichts.' } },
    { t: { en: 'The automation runs', de: 'Die Automatisierung läuft' }, p: { en: 'Five new emails, each labelled and rated. The complaint is urgent, so your phone rings. Three drafts wait.', de: 'Fünf neue Mails, jede mit Label und Dringlichkeit. Die Beschwerde ist dringend, dein Handy meldet sich. Drei Entwürfe warten.' } },
    { t: { en: 'You decide', de: 'Du entscheidest' }, p: { en: 'You see the alert, open the draft and press send yourself.', de: 'Du siehst den Alarm, öffnest den Entwurf und drückst selbst auf Senden.' } }
  ],
  plane: { title: { en: 'Your inbox as a model', de: 'Dein Postfach als Modell' }, info: { en: 'The five kinds of mail that arrive, linked to your business and to the drafts folder. That is why the AI can rate each one: it knows what a complaint, an application or spam looks like for you.', de: 'Die fünf Arten von Mails, die ankommen, verknüpft mit deinem Betrieb und dem Entwurfsordner. Deshalb kann die KI jede einordnen: Sie weiß, wie bei dir eine Beschwerde, eine Bewerbung oder Spam aussieht.' } },
  objects: [
    { k: 'shop', name: { en: 'Your workshop', de: 'Deine Tischlerei' }, c: [1.4, 4.9], pz: 2.0, parts: [['building', .3, 4.1, { w: 2.2, d: 1.6, h: 1.5 }]],
      info: { en: 'Tischlerei Lindqvist-Roth, the business. All mail arrives here and nothing leaves without your say.', de: 'Die Tischlerei Lindqvist-Roth, der Betrieb. Alle Mail kommt hier an, und ohne dein Okay geht nichts raus.' } },
    { k: 'compl', lit: 1, name: { en: 'Complaint', de: 'Beschwerde' }, sub: { en: 'urgent · Kowalski', de: 'dringend · Kowalski' }, title: { en: 'Complaint · Nadine Kowalski', de: 'Beschwerde · Nadine Kowalski' }, c: [1.75, 1.75], pz: 1.55, parts: [['person', 1.2, 1.2, { big: 1 }], ['chat', 2.0, .8, {}]],
      info: { en: 'Ms Kowalski: the kitchen front is cracked and the fitting is today at 14:00. Rated urgent, so your phone is alerted at once.', de: 'Frau Kowalski: Die Küchenfront ist gerissen, die Montage ist heute um 14:00 Uhr. Als dringend eingestuft, dein Handy wird sofort alarmiert.' } },
    { k: 'quote', lit: 1, name: { en: 'Quote request', de: 'Angebotsanfrage' }, sub: { en: 'normal · Demir', de: 'normal · Demir' }, title: { en: 'Quote request · Murat Demir', de: 'Angebotsanfrage · Murat Demir' }, c: [6.0, 1.3], pz: .6, parts: [['doc', 5.35, .45, { button: 1 }]],
      info: { en: 'New customer: a built-in wardrobe under a sloping roof, about 3.2 m wide, oak, by February. Normal urgency, answer by tomorrow.', de: 'Neukunde: ein Einbauschrank unter der Dachschräge, ca. 3,2 m breit, Eiche, bis Februar. Dringlichkeit normal, Antwort bis morgen.' } },
    { k: 'inv', name: { en: 'Invoice', de: 'Rechnung' }, sub: { en: 'low', de: 'niedrig' }, c: [9.25, 3.75], pz: .6, parts: [['doc', 8.6, 2.9, { total: 1 }]],
      info: { en: 'A supplier invoice, RE-20931, 1,284.60 EUR, due 04.12.2026. Low urgency, noted in the accounting folder. No reply needed.', de: 'Eine Lieferantenrechnung, RE-20931, 1.284,60 € brutto, fällig am 04.12.2026. Niedrig dringend, in den Ordner Buchhaltung vorgemerkt. Keine Antwort nötig.' } },
    { k: 'job', lit: 1, name: { en: 'Application', de: 'Bewerbung' }, sub: { en: 'normal · Weber', de: 'normal · Weber' }, title: { en: 'Application · Jonas Weber', de: 'Bewerbung · Jonas Weber' }, c: [9.75, 1.25], pz: 1.35, parts: [['person', 9.6, 1.0, { big: 1 }]],
      info: { en: 'Jonas Weber applies as a journeyman carpenter: 6 years of experience, CV and references attached. An acknowledgement draft is ready.', de: 'Jonas Weber bewirbt sich als Tischlergeselle: 6 Jahre Erfahrung, Lebenslauf und Zeugnisse im Anhang. Eine Eingangsbestätigung liegt als Entwurf bereit.' } },
    { k: 'spam', name: 'Spam', c: [9.5, 6.0], pz: .8, parts: [['envelope', 8.9, 5.5, {}]],
      info: { en: '“Your account has been blocked!!!” A typical phishing mail: threat, time pressure, unknown sender. The link is not opened and the mail goes to the spam folder.', de: '„Ihr Konto wurde gesperrt!!!“ Eine typische Phishing-Mail: Drohung, Zeitdruck, unbekannter Absender. Der Link wird nicht geöffnet, die Mail landet im Spam-Ordner.' } },
    { k: 'drafts', lit: 1, name: { en: 'Drafts', de: 'Entwürfe' }, sub: { en: '3 ready', de: '3 bereit' }, c: [5.0, 5.0], pz: 1.0, parts: [['folder', 4.2, 4.5, {}], ['envelope', 5.4, 5.2, {}]],
      info: { en: "Three reply drafts in your company's tone: Kowalski, Demir, Weber. They wait for your OK. Nothing has been sent.", de: 'Drei Antwortentwürfe im Ton deiner Tischlerei: Kowalski, Demir, Weber. Sie warten auf dein Okay. Nichts wurde gesendet.' } }
  ],
  links: [['shop', 'compl'], ['shop', 'quote'], ['shop', 'inv'], ['shop', 'job'], ['shop', 'spam'], ['compl', 'drafts'], ['quote', 'drafts'], ['job', 'drafts'], ['shop', 'drafts']],
  hot: [['shop', 'compl'], ['compl', 'drafts'], ['quote', 'drafts'], ['job', 'drafts']],
  trayInfo: {
    data: { title: { en: 'What comes in', de: 'Was reinkommt' }, info: { en: 'Every new email in your inbox, with its attachments. The automation starts as soon as one arrives.', de: 'Jede neue Mail in deinem Postfach, mit Anhängen. Die Automatisierung startet, sobald eine ankommt.' } },
    logic: { title: { en: 'How it thinks', de: 'Wie es denkt' }, info: { en: 'Your rules, set once: what kind of mail it is, how urgent, how you write back.', de: 'Deine Regeln, einmal festgelegt: was für eine Mail es ist, wie dringend, wie du zurückschreibst.' } },
    actions: { title: { en: 'What it does', de: 'Was es tut' }, info: { en: 'It sorts, alerts and drafts. Sending is left to you.', de: 'Es sortiert, alarmiert und entwirft. Das Senden bleibt bei dir.' } }
  },
  data: [
    { logo: 'gmail', t: { en: 'Inbox', de: 'Postfach' }, sub: { en: 'every new mail', de: 'jede neue Mail' }, info: { en: 'Your inbox. Each new mail is picked up as soon as it arrives.', de: 'Dein Postfach. Jede neue Mail wird aufgegriffen, sobald sie ankommt.' } },
    { logo: 'pdf', t: { en: 'Attachments', de: 'Anhänge' }, sub: { en: 'PDFs, CVs', de: 'PDFs, Lebensläufe' }, info: { en: 'Invoices, CVs and references in the attachments are read too.', de: 'Auch Rechnungen, Lebensläufe und Zeugnisse im Anhang werden gelesen.' } },
    { logo: 'doc', t: { en: 'Photos', de: 'Fotos' }, sub: { en: 'from customers', de: 'von Kunden' }, info: { en: 'Photos from customers, like the cracked kitchen front, come with the mail and are taken into account.', de: 'Fotos von Kunden, wie die gerissene Küchenfront, gehören zur Mail und werden mitbeachtet.' } },
    { logo: 'clock', t: { en: 'Before work', de: 'Vor Arbeitsbeginn' }, sub: { en: 'Monday 07:36', de: 'Montag 07:36' }, info: { en: 'It runs on its own, also when nobody is at work yet.', de: 'Es läuft von allein, auch wenn noch niemand im Betrieb ist.' } }
  ],
  logic: [
    { logo: 'ai', t: { en: 'Reads & sorts', de: 'Liest & sortiert' }, sub: { en: 'AI, one label each', de: 'KI, je ein Label' }, info: { en: 'An AI reads each mail and gives it one label: complaint, quote request, invoice, application or spam.', de: 'Eine KI liest jede Mail und gibt ihr ein Label: Beschwerde, Angebotsanfrage, Rechnung, Bewerbung oder Spam.' } },
    { logo: 'rule', t: { en: 'Urgency', de: 'Dringlichkeit' }, sub: { en: 'urgent, normal, low', de: 'dringend, normal, niedrig' }, title: { en: 'How urgent is it', de: 'Wie dringend es ist' }, info: { en: 'Your rules for urgent: a deadline today and an unhappy customer. An invoice due in 11 days is low.', de: 'Deine Regeln für dringend: eine Frist heute und ein verärgerter Kunde. Eine Rechnung, die in 11 Tagen fällig ist, ist niedrig.' } },
    { logo: 'voice', t: { en: 'Your tone', de: 'Dein Ton' }, sub: { en: 'how the company writes', de: 'wie der Betrieb schreibt' }, info: { en: 'Examples of how your company writes, so a draft sounds like you.', de: 'Beispiele, wie dein Betrieb schreibt, damit ein Entwurf nach dir klingt.' } },
    { logo: 'lock', t: { en: 'Never sends', de: 'Sendet nie' }, sub: { en: 'drafts only', de: 'nur Entwürfe' }, info: { en: 'A hard rule: it may write drafts, but it never sends a mail by itself.', de: 'Eine feste Regel: Es darf Entwürfe schreiben, aber nie von selbst eine Mail senden.' } }
  ],
  actions: [
    { logo: 'gmail', t: { en: 'Labels', de: 'Labels' }, sub: { en: 'and folders', de: 'und Ordner' }, info: { en: 'Sets the label and moves the mail: the invoice to accounting, the spam to the spam folder.', de: 'Setzt das Label und verschiebt die Mail: die Rechnung zur Buchhaltung, den Spam in den Spam-Ordner.' } },
    { logo: 'whatsapp', t: { en: 'Alert', de: 'Alarm' }, sub: { en: 'urgent to your phone', de: 'Dringendes aufs Handy' }, info: { en: 'Urgent mail goes to your phone at once, with one line on what happened.', de: 'Dringende Mails gehen sofort aufs Handy, mit einer Zeile dazu, was los ist.' } },
    { logo: 'gmail', t: { en: 'Drafts', de: 'Entwürfe' }, sub: { en: 'in your tone', de: 'in deinem Ton' }, info: { en: 'Writes a reply draft in your tone and puts it in the drafts folder.', de: 'Schreibt einen Antwortentwurf in deinem Ton und legt ihn in den Entwurfsordner.' } },
    { logo: 'check', t: { en: 'Waits for you', de: 'Wartet auf dich' }, sub: { en: 'you press send', de: 'du drückst Senden' }, info: { en: 'Every draft waits for your approval. You press send, or you do not.', de: 'Jeder Entwurf wartet auf deine Freigabe. Du drückst Senden, oder eben nicht.' } }
  ],
  run: {
    title: { en: 'Inbox triage', de: 'Posteingang sortieren' }, total: '07:37', to: 'shop',
    info: { en: 'Monday morning: five mails in, each labelled and rated, the urgent one alerts you, drafts are ready. Times from the film.', de: 'Montagmorgen: fünf Mails rein, jede mit Label und Dringlichkeit, die dringende alarmiert dich, Entwürfe liegen bereit. Zeiten aus dem Film.' },
    rows: [
      [{ en: '5 new emails', de: '5 neue Mails' }, '07:36', 'shop'],
      [{ en: 'Labels and urgency set', de: 'Label und Dringlichkeit gesetzt' }, '07:36', 'compl'],
      [{ en: 'Alert to your phone', de: 'Alarm aufs Handy' }, '07:36', 'you'],
      [{ en: '3 reply drafts ready', de: '3 Antwortentwürfe bereit' }, '07:37', 'drafts']
    ]
  },
  phone: {
    to: 'compl', time: '07:36', date: { en: 'Monday, 23 November', de: 'Montag, 23. November' },
    title: { en: 'You', de: 'Du' }, info: { en: 'One alert for the one mail that cannot wait. The reply draft is ready, you only press send.', de: 'Ein Alarm für die eine Mail, die nicht warten kann. Der Antwortentwurf liegt bereit, du musst nur Senden drücken.' },
    notes: [
      { logo: 'gmail', app: { en: 'Inbox assistant · now', de: 'Assistent · jetzt' }, t: { en: 'Urgent · complaint', de: 'Dringend · Beschwerde' }, p: { en: 'Ms Kowalski: kitchen front\ncracked, fitting today 14:00.', de: 'Fr. Kowalski: Küchenfront\ngerissen, Montage 14:00.' } },
      { logo: 'check', app: { en: 'Draft ready', de: 'Entwurf bereit' }, t: { en: 'Reply to Ms Kowalski', de: 'Antwort Fr. Kowalski' }, p: { en: 'not sent, waits for you', de: 'nichts gesendet' } }
    ]
  }
};
