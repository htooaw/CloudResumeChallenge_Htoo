export const profile = {
  name: 'Htoo Aung Win',
  role: 'Cloud & DevOps Engineer',
  location: 'Singapore',
  intro:
    'I build and run infrastructure on AWS, with a background in networks and security operations. Studying Applied Computing at SIT.',
  github: 'https://github.com/htooaw',
  linkedin: 'https://linkedin.com/in/htooaungwin',
  email: 'haw.connect@gmail.com',
  resumePdf: '/Htoo_Aung_Win_Resume_DevOps.pdf',
};

export const project = {
  name: 'Cloud Resume Challenge',
  challengeUrl: 'https://cloudresumechallenge.dev',
  live: 'https://htooaungwin.com',
  blog: 'https://dev.to/htooaw/my-cloud-resume-challenge-the-devops-way-2abh',
  code: 'https://github.com/htooaw/CloudResumeChallenge_Htoo',
  built: [
    'Next.js static site in a private S3 bucket, served by CloudFront through Origin Access Control, with Route 53 and an ACM certificate.',
    'Visitor counter on an API Gateway HTTP API, a Python Lambda and DynamoDB, incremented atomically.',
    'About 40 AWS resources in Terraform. One codebase for test and prod, state in HCP Terraform.',
    'Test and prod are separate AWS accounts in one AWS Organization, managed as code with org-formation.',
    'GitLab CI with OIDC, so no AWS keys are stored. Every push runs unit tests, a test deploy and Playwright smoke tests. Prod waits for one manual approval.',
    'Five CloudWatch alarms send alerts through SNS to email and, through a notifier Lambda, to Slack.',
  ],
  stack: ['AWS', 'Terraform', 'HCP Terraform', 'GitLab CI', 'Python', 'Next.js', 'Playwright', 'org-formation'],
};

export type Entry = {
  when: string;
  title: string;
  org: string;
  summary?: string;
  bullets?: string[];
};

export const experience: Entry[] = [
  {
    when: 'Oct 2026 to Nov 2026',
    title: 'Student Software Developer (part-time)',
    org: 'Singapore Institute of Technology · Student Work Scheme',
    summary:
      'Building BACMODS, a timetable planner for SIT Applied Computing students, in a team of four. A data pipeline from the official module lists to JSON, clash-detection logic, pull-request reviews, testing and deployment.',
  },
  {
    when: 'Sep 2025 to Feb 2026',
    title: 'System and Network Engineer Intern',
    org: 'Zectech Pte Ltd · Singapore',
    bullets: [
      'Automated image retrieval from about 20 remote CCTV sites, replacing about 160 engineer-hours a month of site travel with scheduled Bash and cron jobs.',
      'Built the connectivity it runs over: IPsec site-to-site tunnels on FortiGate, and an OpenVPN relay on a DigitalOcean VPS for 4G sites behind CGNAT.',
      'Handled 15+ network and endpoint faults a week as one of three first-line engineers, including after-hours callouts.',
    ],
  },
  {
    when: 'Sep 2025 to Feb 2026',
    title: 'Security System Engineer (part-time)',
    org: 'AGB Communication Co., Ltd · Remote',
    summary:
      'Assessed client infrastructure and reported findings by severity, each with a remediation path. The medium and high-severity items were fixed.',
  },
];

export const education: Entry[] = [
  {
    when: '2026 to present',
    title: 'BSc (Hons) Applied Computing (Fintech)',
    org: 'Singapore Institute of Technology',
  },
  {
    when: '2023 to 2026',
    title: 'Diploma in Computer Engineering',
    org: 'Singapore Polytechnic · GPA 3.87 / 4.0',
  },
];

export type Certification = { name: string; issuer: string };

export const certifications: { group: string; items: Certification[] }[] = [
  {
    group: 'Cloud and Kubernetes',
    items: [
      { name: 'AWS Certified Solutions Architect Associate', issuer: 'AWS' },
      { name: 'HashiCorp Terraform Associate', issuer: 'HashiCorp' },
      { name: 'Kubernetes and Cloud Native Associate (KCNA)', issuer: 'Linux Foundation' },
      { name: 'Kubernetes and Cloud Native Security Associate (KCSA)', issuer: 'Linux Foundation' },
      { name: 'AWS Certified Cloud Practitioner', issuer: 'AWS' },
      { name: 'Azure Fundamentals (AZ-900)', issuer: 'Microsoft' },
      { name: 'Oracle Cloud Infrastructure Foundations', issuer: 'Oracle' },
      { name: 'Oracle Cloud AI Foundations', issuer: 'Oracle' },
    ],
  },
  {
    group: 'Security',
    items: [
      { name: 'Certified Ethical Hacker (CEH Practical)', issuer: 'EC-Council' },
      { name: 'eCPPT', issuer: 'INE' },
      { name: 'eJPT', issuer: 'INE' },
      { name: 'Fortinet Certified Associate in Cybersecurity', issuer: 'Fortinet' },
      { name: 'SOC Analyst Level 1 (SAL1)', issuer: 'TryHackMe' },
      { name: 'Jr Penetration Tester (PT1)', issuer: 'TryHackMe' },
    ],
  },
];

export const recognition: Entry[] = [
  {
    when: '2024',
    title: 'Lenovo and Cisco security halls of fame',
    org: 'Reported vulnerabilities in their web infrastructure through responsible disclosure.',
  },
  {
    when: '2025',
    title: 'Cisco NetAcad Riders, Silver Award',
    org: 'Cisco Networking Academy',
  },
];
