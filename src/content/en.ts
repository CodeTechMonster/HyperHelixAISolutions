import type { SiteContent } from './types'

export const en: SiteContent = {
  meta: {
    htmlLang: 'en',
    ogLocale: 'en_US',
    title: 'Hyper Helix AI Solutions — Empowering Human Potential Through AI',
    description:
      'Hyper Helix builds AI that amplifies people instead of replacing them. Human-centered AI enablement, business automation, security governance, and digital transformation.',
    keywords:
      'human-centered AI, AI enablement, business automation, digital transformation, AI governance, responsible AI, workflow automation',
  },

  brand: {
    name: 'Hyper Helix AI Solutions',
    nameShort: 'Hyper Helix',
    descriptor: 'AI Solutions',
  },

  nav: {
    links: [
      { id: 'philosophy', label: 'Philosophy' },
      { id: 'stories', label: 'Real Stories' },
      { id: 'services', label: 'Services' },
      { id: 'founder', label: 'Our Story' },
      { id: 'human-centered', label: 'Human-Centered AI' },
      { id: 'hcai-resources', label: 'Human-Centered AI Resources' },
      { id: 'vision', label: 'Vision' },
    ],
    cta: 'Start the Conversation',
    menuOpen: 'Open menu',
    menuClose: 'Close menu',
  },

  hero: {
    eyebrow: 'Human-Centered AI',
    headlineLead: 'Empowering Human',
    headlineAccent: 'Potential Through AI',
    subheadline:
      'AI that amplifies people, not replaces them. We build systems that give your team back their most finite resource — time that matters.',
    ctaPrimary: 'Explore Our Philosophy',
    ctaSecondary: 'See Real Stories',
    scrollHint: 'Scroll to explore',
    signals: [
      { value: '18 yrs', label: 'Engineering across two disciplines' },
      { value: '5', label: 'Deployed AI workflows' },
      { value: '100%', label: 'Human-in-the-loop by design' },
    ],
  },

  philosophy: {
    eyebrow: 'Our Philosophy',
    title: 'Technology should give people more room to be human.',
    lead:
      'Most AI companies sell efficiency. We think efficiency is only the beginning — the real question is what people do with the hours they get back. Five commitments shape every system we build.',
    values: [
      {
        id: 'human-centered',
        icon: 'human',
        title: 'Human-Centered AI',
        body: 'People come before technology. Every system we design starts with the person who will use it, not the model that powers it.',
        note: 'The human stays in the loop, in control, and accountable.',
      },
      {
        id: 'meaningful-time',
        icon: 'time',
        title: 'Meaningful Time',
        body: 'Time saved on repetitive work is only valuable if it becomes time spent on work — and life — that matters.',
        note: 'We measure success in hours returned, not tasks removed.',
      },
      {
        id: 'collaboration',
        icon: 'collaboration',
        title: 'Collaboration',
        body: 'The strongest results come from AI and people working together, each doing what they are genuinely better at.',
        note: 'Judgment stays human. Repetition becomes automatic.',
      },
      {
        id: 'growth',
        icon: 'growth',
        title: 'Lifelong Growth',
        body: 'Every deployment is also a learning program. Teams should finish more capable than they started.',
        note: 'We hand over the keys, not just the output.',
      },
      {
        id: 'trust',
        icon: 'trust',
        title: 'Trust & Responsibility',
        body: 'Explainable decisions, protected data, and honest limits. If we cannot explain how it works, we do not ship it.',
        note: 'Governance is designed in, never bolted on.',
      },
    ],
  },

  stories: {
    eyebrow: 'Real Stories',
    title: 'Small automations. Real hours returned.',
    lead:
      'These are working systems, not concept demos. Each one started with someone losing their week to work a machine could do better.',
    labels: { problem: 'Problem', solution: 'Solution', impact: 'Impact' },
    items: [
      {
        id: 'files',
        icon: 'files',
        tag: 'Knowledge Operations',
        title: 'Smart File Organization',
        problem:
          'Thousands of documents scattered across shared drives with inconsistent names, so finding the right version took longer than rewriting it.',
        solution:
          'An AI-assisted classifier that reads content — not just filenames — proposes a folder taxonomy, and files new documents automatically with a human approval step.',
        impact:
          'Search time dropped from minutes to seconds, and duplicate work from lost files effectively disappeared.',
        metric: { value: '92%', label: 'Faster document retrieval' },
      },
      {
        id: 'pdf',
        icon: 'document',
        tag: 'Document Automation',
        title: 'PDF Automation',
        problem:
          'Monthly reporting packs were assembled by hand — merging, reordering, and renaming dozens of PDFs, every single month.',
        solution:
          'A rules-driven pipeline that merges, splits, bookmarks, and stamps documents on a schedule, with AI naming and validation on the way out.',
        impact:
          'A two-day manual assembly cycle became a scheduled job that runs unattended overnight.',
        metric: { value: '16 hrs', label: 'Returned each month' },
      },
      {
        id: 'presentation',
        icon: 'presentation',
        tag: 'Knowledge Reuse',
        title: 'Presentation Intelligence',
        problem:
          'Years of slide decks held the organization’s best thinking, but nobody could find the one chart they half-remembered.',
        solution:
          'Slide-level extraction into a searchable knowledge base, so any team can locate and responsibly reuse prior work in plain language.',
        impact:
          'New decks start from institutional knowledge instead of a blank page.',
        metric: { value: '3x', label: 'Faster deck assembly' },
      },
      {
        id: 'contract',
        icon: 'contract',
        tag: 'Risk & Compliance',
        title: 'Contract Analysis',
        problem:
          'Reviewing supplier agreements was slow, inconsistent, and depended entirely on who happened to read them.',
        solution:
          'AI-supported clause extraction that flags deviations from standard terms and surfaces risk for a human reviewer — never a decision, always a recommendation.',
        impact:
          'Reviewers spend their attention on the ten clauses that matter instead of the two hundred that do not.',
        metric: { value: '70%', label: 'Less first-pass review time' },
      },
      {
        id: 'workflow',
        icon: 'workflow',
        tag: 'Process Automation',
        title: 'Workflow Automation',
        problem:
          'Approvals lived in email threads. Status was whatever the last person remembered, and handoffs quietly stalled for days.',
        solution:
          'Power Automate flows integrated with AI summarization to route, summarize, and escalate work with a full audit trail.',
        impact:
          'Approval cycles became predictable, and nothing sits waiting on a forgotten inbox.',
        metric: { value: '4 days', label: 'Cut from approval cycles' },
      },
    ],
    footnote:
      'Figures reflect measured outcomes in the deployments described. Your results depend on your data, process maturity, and adoption.',
  },

  services: {
    eyebrow: 'Services',
    title: 'Four ways we build capability that stays with you.',
    lead:
      'We are not interested in dependency. Every engagement is designed so your team can run, extend, and question the system after we leave.',
    items: [
      {
        id: 'enablement',
        icon: 'brain',
        title: 'AI Enablement',
        summary:
          'Find where AI genuinely helps, prove it on a real workflow, and teach your team to carry it forward.',
        capabilities: [
          'Opportunity assessment and value mapping',
          'Rapid pilots on live workflows',
          'Prompt and workflow design libraries',
          'Team enablement and hands-on training',
        ],
      },
      {
        id: 'automation',
        icon: 'automation',
        title: 'Business Automation',
        summary:
          'Turn the repetitive parts of the working week into reliable, observable, boring infrastructure.',
        capabilities: [
          'Process discovery and mapping',
          'Power Automate and Microsoft 365 integration',
          'Document and reporting pipelines',
          'Human approval gates and audit trails',
        ],
      },
      {
        id: 'security',
        icon: 'shield',
        title: 'Cyber Security & Governance',
        summary:
          'Adopt AI without handing your data or your accountability to a black box.',
        capabilities: [
          'AI usage policy and guardrail design',
          'Data classification and access control',
          'Model risk and vendor assessment',
          'Compliance-ready audit documentation',
        ],
      },
      {
        id: 'transformation',
        icon: 'transform',
        title: 'Digital Transformation',
        summary:
          'Change that survives contact with real people — sequenced, communicated, and adopted.',
        capabilities: [
          'Roadmap and phased sequencing',
          'Change management and communication',
          'Legacy system integration',
          'Adoption measurement and iteration',
        ],
      },
    ],
  },

  ceo: {
    eyebrow: 'Our Story',
    title: 'A farewell party taught me what technology is actually for.',
    pullQuote:
      'More than a hundred people came to say a final goodbye. Not one of them mentioned the technology I had built.',
    paragraphs: [
      'I trained as a mechanical engineer and spent twelve years developing engine control systems at GM Korea’s R&D center. It was a place where numbers explained the world — fuel injection quantities, response curves, emissions figures. A difference of a few decimal places changed performance, and that performance became the result.',
      'I loved that work. And for a long time, I believed that making things more precise was what it meant to be a good engineer.',
      'Then, one day, the time came to close that chapter.',
      'On my last day at work, far more people showed up to the farewell than I expected — colleagues from the lab, people I’d worked on projects with, even people from other departments. When I counted later, it was more than a hundred.',
      'Someone remembered a night I’d stayed late. Someone else brought up a decision that had protected the team through a hard stretch. Another said a single thing I’d once said had changed the course of their career.',
      'That day, I noticed something strange.',
      'In twelve years, I had improved countless engines and produced mountains of performance data. Yet not one person mentioned an algorithm or a calibration I had developed.',
      'What people remembered was not the technology.',
      'It was the people.',
      'The time spent together, the care shown, the small choices made for someone else.',
      'It made me wonder whether the value of technology has to end up living in a person — or it isn’t really value at all.',
      'A new start in Canada.',
      'Everything familiar disappeared at once — the language, the network, the expertise I’d built over an entire career. A time of letting go of everything had begun.',
      'I studied computer programming later in life than most, then spent the next six years as a full-stack engineer at Exeevo, building a life sciences CRM platform.',
      'Software taught me another truth.',
      'While building a product, optimizing the code makes the quality better.',
      'People, though, were different.',
      'Raise efficiency without understanding people’s thinking, judgment, relationships, and context, and they quietly work around the system. The features that were loved most, by contrast, were never the ones that controlled people — they were the ones that helped them.',
      'A feature that gives back time to judge, instead of taking the judgment away.',
      'A feature that makes something possible, instead of forcing it.',
      'Somewhere in that process, I found one answer that ran through both careers.',
      'It was not technology. It was time.',
      'What we’re really losing may not be productivity — it may be the time of our lives.',
      'Missing what matters because of a repetitive report.',
      'Tied down by simple tasks, never getting to think about the problem that actually matters.',
      'A team so busy it never has the room to understand one another.',
      'I believe that time is, in the end, what AI can actually change.',
      'That is why Hyper Helix began.',
      'Not to replace people.',
      'But to give people back time that’s worth something.',
      'And I hope that time, once returned, is spent becoming a better person, thinking more deeply, and understanding one another.',
      'Every system we build starts from a single question.',
      'Does this technology make someone more human?',
      'Only when we can answer that question with a confident yes do we put it into the world.',
    ],
    milestones: [
      {
        year: '12 years',
        title: 'Engine control development, GM Korea',
        body: 'Mechanical engineering by training, then engine control systems at the R&D center — where precision is measured to three decimals and nothing ships on intuition.',
      },
      {
        year: '6 years',
        title: 'Full-stack engineer, Exeevo',
        body: 'Retrained in computer programming after emigrating to Canada, then spent six years building a life sciences CRM platform at Exeevo — learning what makes software genuinely help rather than get in the way.',
        link: { label: 'exeevo.com', href: 'https://exeevo.com/' },
      },
      {
        year: 'Today',
        title: 'Hyundai Glovis Canada Inc., IT Security Supervisor',
        body: 'A place where I get to put HCAI’s values into practice.',
      },
      {
        year: 'Also today',
        title: 'Hyper Helix AI Solutions',
        body: 'Building AI that gives people their time back — and treats what they do with it as the real purpose.',
      },
    ],
    signature: {
      name: 'Founder · CEO · Hyunsoo Hwang',
      role: 'Hyper Helix AI Solutions',
      location: 'Ontario, Canada',
    },
  },

  hcai: {
    eyebrow: 'Human-Centered AI',
    title: 'High automation and high human control are not opposites.',
    lead:
      'The dominant story says you trade one for the other: the more the machine does, the less the person decides. We build for the corner where both are high — systems that are genuinely powerful and genuinely under human control.',
    stances: [
      {
        id: 'ai-first',
        state: 'reject',
        label: 'What we reject',
        title: 'AI First',
        body: 'Starting from the model and looking for problems to apply it to. It produces impressive demos, brittle systems, and teams who distrust their own tools.',
      },
      {
        id: 'human-first',
        state: 'accept',
        label: 'Where we start',
        title: 'Human First',
        body: 'Starting from the person, the work, and the decision that actually needs support. The technology is chosen last, on purpose.',
      },
      {
        id: 'collaboration',
        state: 'accept',
        label: 'What we build',
        title: 'AI + Human Collaboration',
        body: 'Systems where the model handles volume and pattern, the person handles judgment and accountability, and the handoff between them is explicit.',
      },
    ],
    principles: [
      {
        id: 'control',
        title: 'Control stays with the person',
        body: 'Every automated action is visible, reversible, and attributable. Nothing consequential happens without someone able to stop it.',
      },
      {
        id: 'clarity',
        title: 'Clarity over cleverness',
        body: 'If a user cannot explain roughly why the system did what it did, the system is not finished — no matter how accurate it is.',
      },
      {
        id: 'consent',
        title: 'Data with consent and limits',
        body: 'Clear boundaries on what is collected, where it goes, how long it lives, and who can see it. Defaults favour the person, not the pipeline.',
      },
      {
        id: 'capability',
        title: 'Capability, not dependency',
        body: 'Documentation, training, and handover are deliverables. Success means you could replace us and the system would keep working.',
      },
    ],
    disclaimer:
      'Our approach is informed by the wider human-centered AI research community, including work on balancing automation with human control. Our framing and methods are our own.',
  },

  future: {
    eyebrow: 'Future Vision',
    title: 'Hyper Helix 2035',
    lead:
      'We are not designing for a future of machines that run without us. We are designing for a future where more people get to do the part of their work that only a person can do.',
    pillars: [
      {
        id: 'amplified',
        icon: 'spark',
        title: 'Amplified, not automated away',
        body: 'The measure of a good system in 2035 is not how few people it needs, but how much more each person can do with it.',
      },
      {
        id: 'network',
        icon: 'network',
        title: 'Knowledge that compounds',
        body: 'Organizations stop losing what they learn. Institutional knowledge becomes a network every newcomer can reach on day one.',
      },
      {
        id: 'growth',
        icon: 'growth',
        title: 'Growth as infrastructure',
        body: 'Continuous learning stops being a program someone signs up for and becomes a property of the tools people already use.',
      },
      {
        id: 'trust',
        icon: 'trust',
        title: 'Trust as a default',
        body: 'Explainability, provenance, and consent are assumed baseline features — the way encryption became assumed.',
      },
    ],
    closing:
      'A future worth building is not a smarter city. It is an ordinary Tuesday where the work fits inside the day.',
  },

  hcaiResources: {
    eyebrow: 'Inspiration',
    title: 'Human-Centered AI Resources',
    lead: 'People who inspire our philosophy and shape the future of AI that empowers humans.',
    thoughtLeaders: [
      {
        id: 'shneiderman',
        name: 'Ben Shneiderman',
        role: 'Father of Human-Centered AI',
        body: 'Ben Shneiderman pioneered the Human-Centered AI movement, advocating that AI should augment and empower people rather than replace them.',
        href: 'https://www.hcil.umd.edu/human-centered-ai/',
      },
      {
        id: 'li',
        name: 'Fei-Fei Li',
        role: 'Co-Founder, Stanford Human-Centered AI Institute',
        body: 'Fei-Fei Li promotes an AI future where technological advancement and human values progress together.',
        href: 'https://hai.stanford.edu',
      },
      {
        id: 'mollick',
        name: 'Ethan Mollick',
        role: 'AI Collaboration and Future of Work',
        body: 'Ethan Mollick explores how people and AI can work together to unlock creativity, productivity, and learning.',
        href: 'https://www.oneusefulthing.org',
      },
    ],
    resourcesTitle: 'Additional Resources',
    resources: [
      {
        id: 'stanford-hai',
        name: 'Stanford HAI',
        description: "Stanford's institute for research and policy on human-centered artificial intelligence.",
        href: 'https://hai.stanford.edu',
      },
      {
        id: 'hcil',
        name: 'Human-Computer Interaction Lab',
        description: 'The University of Maryland lab where the Human-Centered AI movement took shape.',
        href: 'https://hcil.umd.edu',
      },
      {
        id: 'partnership-on-ai',
        name: 'Partnership on AI',
        description: 'A coalition of industry, academia, and civil society building responsible AI practices.',
        href: 'https://partnershiponai.org',
      },
      {
        id: 'ai-now',
        name: 'AI Now Institute',
        description: 'A research institute examining the social implications of AI and algorithmic systems.',
        href: 'https://ainowinstitute.org',
      },
      {
        id: 'chm',
        name: 'Center for Humans and Machines',
        description: 'Research on how humans and machines can collaborate, learn, and reason together.',
        href: 'https://www.mpib-berlin.mpg.de/chm',
      },
    ],
    philosophy: {
      title: 'Why These Voices Matter',
      paragraphs: [
        'At Hyper Helix AI Solutions, we believe that the true purpose of artificial intelligence is not to replace people, but to help people thrive.',
        'The thinkers and organizations highlighted here inspire our Human-Centered AI philosophy. Their work reinforces our commitment to creating solutions that increase efficiency, support creativity, strengthen collaboration, and enrich the value of human life.',
      ],
      closing: 'Technology is most meaningful when it serves people.',
    },
  },

  cta: {
    eyebrow: "Let's talk",
    title: "Let's Build a Better Future Together",
    lead:
      'Tell us about the work that is eating your team’s week. We will tell you honestly whether AI is the right answer — and what we would do about it if it is.',
    button: 'Start the Conversation',
    secondary: 'See our services',
    email: 'hello@hyperhelix.ai',
    reassurance: 'A real conversation, not a sales sequence.',
  },

  footer: {
    tagline: 'AI that amplifies people, not replaces them.',
    columns: [
      {
        title: 'Company',
        links: [
          { id: 'philosophy', label: 'Philosophy' },
          { id: 'founder', label: 'Our Story' },
          { id: 'vision', label: 'Vision' },
        ],
      },
      {
        title: 'What we do',
        links: [
          { id: 'services', label: 'Services' },
          { id: 'stories', label: 'Real Stories' },
          { id: 'human-centered', label: 'Human-Centered AI' },
          { id: 'hcai-resources', label: 'Human-Centered AI Resources' },
        ],
      },
      {
        title: 'Connect',
        links: [{ id: 'contact', label: 'Start the Conversation' }],
      },
    ],
    legal: ['Privacy', 'Terms', 'Accessibility'],
    copyright: '© 2026 Hyper Helix AI Solutions. All rights reserved.',
  },

  a11y: {
    skipToContent: 'Skip to main content',
    mainLandmark: 'Main content',
    languageToggle: 'Language',
    languageSwitchTo: 'Switch to Korean',
    decorativeCanvas: 'Decorative animated double helix',
    backToTop: 'Back to top',
    opensInNewTab: '(opens in a new tab)',
  },
}
