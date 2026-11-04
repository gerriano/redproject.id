// All website copy lives here so content edits never require touching layout code.
// Source material: docs/legacy/CONTENT-ARCHIVE.md (old site + introduction deck).
// Items marked VERIFY need confirmation from RED Project before they are treated as final.

export const site = {
  name: 'RED Project',
  legalName: 'RED Project',
  tagline: 'Digital Advisory 360°',
  description:
    'RED Project is a 360° digital consultancy from Indonesia. We help SMEs and national brands build websites, measure marketing and grow with data, from strategy to execution.',
  url: 'https://redproject.id',
  email: 'info@redproject.id', // VERIFY: request mentioned info@redproject.com
  whatsapp: {
    number: '6281290905733',
    display: '+62 812-9090-5733',
    message: "Hi RED Project, I'd like to book a free consultation.",
  },
  social: [
    { label: 'Instagram', href: 'https://www.instagram.com/redproject.indonesia/' },
    { label: 'Facebook', href: 'https://www.facebook.com/redproject.indonesia' },
  ],
  location: 'Jakarta, Indonesia', // VERIFY: office address was on the lost contact page
};

export const waLink = (message = site.whatsapp.message) =>
  `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(message)}`;

export const nav = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/#services' },
  { label: 'About', href: '/about/' },
  { label: 'Contact', href: '/contact/' },
];

export const heroWords = ['reliable', 'measurable', 'adjustable'];

export const painPoints = [
  'Your business needs to stay relevant as digital habits shift.',
  'You want to reach a wider market than word of mouth allows.',
  "Marketing spend goes out every month and you can't tell what it returns.",
  "You're ready to scale, but the systems behind the business aren't.",
  'You need one digital partner for the long run, not a new vendor every quarter.',
];

export const pillars = [
  {
    key: 'Reliable',
    title: 'Reliable',
    body: 'Websites, campaigns and systems that work every time a customer touches them: fast, secure and consistent across every channel.',
  },
  {
    key: 'Measurable',
    title: 'Measurable',
    body: 'Every initiative ships with tracking and an agreed KPI, so decisions come from data on real customer behaviour rather than opinion.',
  },
  {
    key: 'Adjustable',
    title: 'Adjustable',
    body: 'Markets, platforms and algorithms change. We review results on a fixed rhythm and adjust the plan before budget is wasted.',
  },
];

export const practices = [
  {
    id: 'strategy',
    name: 'Strategy',
    lead: 'Decide what to do first, and why.',
    services: [
      {
        title: 'Digital Consultancy & Roadmap',
        body: 'An honest audit of where you stand online, then a prioritised roadmap tied to business goals and budget.',
      },
      {
        title: 'Business Operations',
        body: 'Operational flow improvement: SOPs, supporting documents and tooling so the business runs smoothly as it grows.',
      },
    ],
  },
  {
    id: 'build',
    name: 'Build',
    lead: 'Give customers a clear, fast way to find and choose you.',
    services: [
      {
        title: 'Website & Digital Product',
        body: 'Websites and digital products that make it easy for customers to understand your business and act on it.',
      },
      {
        title: 'UI/UX Design',
        body: 'Research-led interface design that removes friction from the paths that matter: enquiry, purchase, repeat.',
      },
    ],
  },
  {
    id: 'grow',
    name: 'Grow',
    lead: 'Turn attention into customers, and customers into repeat buyers.',
    services: [
      {
        title: 'Performance Advertising & KOL',
        body: 'Paid campaigns across digital channels and key opinion leaders, targeted and measured against real outcomes.',
      },
      {
        title: 'Social Media & Content',
        body: 'Content strategy and editorial calendars built for the audience you want, not just for the algorithm.',
      },
      {
        title: 'Analytics, CRM & Events',
        body: 'Tracking and reporting that make every activity measurable, CRM that drives repeat orders and referrals, and online or offline events that start conversations.',
      },
    ],
  },
];

export const steps = [
  {
    step: 'Free consultation',
    body: 'Up to 60 minutes on Google Meet. We listen, look at your current setup and tell you plainly what we see.',
  },
  {
    step: 'Audit & data',
    body: 'We review analytics, channels, spend and operations to find where the real leverage is.',
  },
  {
    step: 'Roadmap',
    body: 'A prioritised plan with scope, cost and KPIs agreed upfront. No surprises later.',
  },
  {
    step: 'Execute & measure',
    body: 'We deliver, report on the agreed numbers and adjust on a fixed rhythm.',
  },
];

// VERIFY: confirm these figures before launch. "Brands" counts individual brands
// handled across client groups, which is why it is larger than "clients".
export const stats = [
  { value: 10, suffix: '+', label: 'Years of experience' },
  { value: 100, suffix: '+', label: 'Clients served' },
  { value: 250, suffix: '+', label: 'Brands handled' },
  { value: 30, suffix: '×', label: 'Peak ROAS on a single campaign' },
];

export const advantages = [
  { title: 'Cost-effective and transparent', body: 'You see what you pay for and what it returns. Scope is matched to your stage, not padded.' },
  { title: '360° end-to-end', body: 'Strategy, build and growth under one roof, so nothing gets lost between vendors.' },
  { title: 'Recommendations backed by data', body: 'Every proposal starts from your numbers and your customers, not from a template.' },
  { title: 'Fits every kind of business', body: 'From SMEs to international brands, we adapt the approach to the business in front of us.' },
];

export const values = [
  { title: 'Transparency', body: 'Open, honest communication with clients and partners, including when the news is not good.' },
  { title: 'Customer success', body: 'We measure our work by the impact it has on your business.' },
  { title: 'Continuous learning', body: 'The team keeps up with platforms, tools and best practice so you do not have to.' },
  { title: 'Adaptability', body: 'When the landscape shifts, we adjust quickly instead of defending the old plan.' },
  { title: 'Quality & responsibility', body: 'We take ownership of what we deliver, to clients, to the community and to the environment.' },
];

export const clients = [
  { file: 'aigner', name: 'Aigner' },
  { file: 'allobank', name: 'Allo Bank' },
  { file: 'bca', name: 'BCA' },
  { file: 'bhinneka', name: 'Bhinneka' },
  { file: 'boss', name: 'BOSS' },
  { file: 'chitato', name: 'Chitato' },
  { file: 'coach', name: 'Coach' },
  { file: 'ctcorp', name: 'CT Corp' },
  { file: 'furla', name: 'Furla' },
  { file: 'kaskus', name: 'Kaskus' },
  { file: 'metro', name: 'Metro' },
  { file: 'mothercare', name: 'Mothercare' },
  { file: 'topcoffee', name: 'Top Coffee' },
  { file: 'transmart', name: 'Transmart' },
];

export const faqs = [
  {
    q: 'How much does it cost to work with RED Project?',
    a: 'Retainers start from roughly what a team spends on lunch in a month. Every recommendation is scoped to your business, and you agree the cost before any work starts.',
  },
  {
    q: 'My business is still small. Can you help?',
    a: 'Yes. We work with everyone from SMEs to international brands, and we size the work to where you are today.',
  },
  {
    q: 'Do I have to sign a contract after the free consultation?',
    a: 'No. The consultation is free with no obligation. If you want to continue, you choose the services that make sense and we can negotiate scope together.',
  },
  {
    q: 'What happens in the free consultation?',
    a: 'A video call of up to 60 minutes at a time that suits you. We ask about your goals, look at your current digital setup and tell you what we would fix first.',
  },
  {
    q: 'How do you measure success?',
    a: 'We agree the KPIs at the start (leads, sales, ROAS, retention or whatever matters for your business) and report against them on a fixed schedule.',
  },
];

export const marquee = ['360° Digital Advisory', 'Digital Consultancy', 'Digital Transformation', 'Data Driven', 'Customer Centric'];
