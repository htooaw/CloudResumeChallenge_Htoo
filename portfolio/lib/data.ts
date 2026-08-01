export const profile = {
  name: 'Htoo Aung Win',
  initials: 'HAW',
  role: 'Cloud & DevOps Engineer',
  tagline:
    'My background includes system and network engineering, security operations, and serverless AWS projects.',
  location: 'Singapore',
  status: 'Open to cloud & DevOps opportunities',
  gitlab: 'https://gitlab.com/h4w1/cloudresumechallenge-haw',
  linkedin: 'https://linkedin.com/in/htooaungwin',
  email: 'haw.connect@gmail.com',
  resumePdf: '/Htoo_Aung_Win_Resume_DevOps.pdf',
};

export const about = {
  eyebrow: 'Background',
  paragraphs: [
    `I am a Computer Engineering student at Singapore Polytechnic with internship experience in system and network engineering and security engineering. My work has included switches, wireless access points, VPNs, firewall policies, Linux diagnostics, SIEM log analysis, and infrastructure documentation.`,
    `I am focused on cloud and DevOps roles. My projects use AWS, Terraform, GitLab CI/CD, Python, Docker, and Kubernetes, with networking and security as the technical foundation.`,
  ],
  principles: [
    'Automate repeatable work',
    'Design for failure',
    'Make systems observable',
    'Document the operating model',
  ],
};

export type Experience = {
  role: string;
  company: string;
  location: string;
  period: string;
  summary: string;
  bullets: string[];
};

export const experience: Experience[] = [
  {
    role: 'System and Network Engineer Intern',
    company: 'Zectech Pte Ltd',
    location: 'Singapore',
    period: 'Sep 2025 — Feb 2026',
    summary: 'Troubleshot infrastructure and connectivity across 20–30 client environments.',
    bullets: [
      'Investigated network, endpoint, and performance issues using Linux command-line tools and log analysis.',
      'Deployed Layer 2/3 switches, wireless access points, endpoints, and AWS and DigitalOcean workloads.',
      'Configured OpenVPN, firewall policies, NAT, and port forwarding, including hybrid AWS-to-on-premises connectivity.',
      'Maintained network diagrams, configuration backups, asset records, and incident documentation.',
    ],
  },
  {
    role: 'Security System Engineer (Part-time)',
    company: 'AGB Communication Co., Ltd',
    location: 'Remote',
    period: 'Sep 2025 — Feb 2026',
    summary: 'Assessed client infrastructure and supported remediation of security findings.',
    bullets: [
      'Identified multiple low- and medium-severity vulnerabilities across client environments.',
      'Investigated logs and anomalies in Wazuh SIEM to support incident detection, triage, and response.',
      'Reviewed segmentation, firewall policies, and access controls; worked with engineers to remediate findings without service disruption.',
      'Produced reports with risk analysis, supporting evidence, and prioritized remediation recommendations.',
    ],
  },
];

export type Project = {
  name: string;
  kicker: string;
  status: 'Live' | 'Case study';
  summaryLabel?: string;
  problem: string;
  architecture: string[];
  implementation: string[];
  reliability: string[];
  evidence: string[];
  stack: string[];
  repo?: string;
  demo?: string;
  accent: 'orange' | 'lime';
};

export const projects: Project[] = [
  {
    name: 'Cloud Resume Challenge',
    kicker: '16-step cloud project · serverless AWS · multi-environment delivery',
    status: 'Live',
    summaryLabel: 'Challenge brief',
    problem:
      'The Cloud Resume Challenge is a 16-step project specification: earn a cloud certification; publish a styled HTML resume on S3 with HTTPS and custom DNS; add a JavaScript visitor counter backed by DynamoDB, API Gateway, Lambda, and Python; test the code; define the infrastructure as code; use source control and CI/CD; then document the work in a blog post. I used that specification as the baseline and extended it into separate test and production environments.',
    architecture: ['Route 53', 'CloudFront', 'Private S3', 'API Gateway', 'Lambda', 'DynamoDB'],
    implementation: [
      'Built the Next.js and TypeScript static frontend and Python serverless backend across two AWS accounts; Terraform provisions approximately 40 resources per environment.',
      'Built a Python Lambda and DynamoDB visitor counter behind API Gateway, using atomic updates and unit tests with pytest and moto.',
      'Reused one Terraform codebase across test and production workspaces in separate AWS accounts, with state managed in HCP Terraform.',
      'Created GitLab pipelines using OIDC and short-lived AWS credentials for unit tests, environment plans and applies, frontend deployment, browser smoke tests, and test teardown.',
    ],
    reliability: [
      'GitLab jobs assume AWS roles through OIDC, so the pipeline does not store long-lived AWS access keys.',
      'CloudWatch alarms route through SNS and a notifier Lambda to Slack; the webhook is stored in SSM Parameter Store.',
      'CloudFront Origin Access Control keeps the S3 bucket private, while Terraform prevent_destroy rules protect the CI identity resources.',
    ],
    evidence: ['Core CRC build live', 'Test + production environments', 'Unit + Playwright tests', 'Final blog post pending'],
    stack: ['AWS', 'Terraform', 'HCP Terraform', 'GitLab CI', 'Next.js', 'TypeScript', 'Python', 'Lambda', 'DynamoDB', 'CloudWatch'],
    repo: 'https://gitlab.com/h4w1/cloudresumechallenge-haw',
    demo: 'https://htooaungwin.com',
    accent: 'orange',
  },
  {
    name: 'Highly Available AWS Web Infrastructure',
    kicker: 'Multi-AZ application architecture',
    status: 'Case study',
    problem:
      'Design a multi-tier AWS environment that keeps the application tier replaceable and distributes traffic across availability zones.',
    architecture: ['Route 53', 'ALB', 'Auto Scaling', 'EC2', 'Private subnets', 'RDS'],
    implementation: [
      'Designed public and private subnets, route tables, and security boundaries across multiple availability zones.',
      'Placed Linux and Windows workloads behind an Application Load Balancer and Auto Scaling Group.',
      'Automated instance configuration with user data and connected the application tier to managed RDS.',
    ],
    reliability: [
      'Applied network segmentation and least-privilege traffic paths between tiers.',
      'Used CloudWatch health and performance signals to observe the environment.',
      'Documented the RDS replication constraint encountered under the lab IAM policy and the production improvement path.',
    ],
    evidence: [],
    stack: ['VPC', 'EC2', 'ALB', 'Auto Scaling', 'RDS', 'CloudWatch', 'IAM'],
    accent: 'lime',
  },
];

export const skills = {
  'AWS Cloud Services': ['EC2', 'VPC', 'IAM', 'Lambda', 'API Gateway', 'DynamoDB', 'RDS', 'CloudFront', 'Route 53', 'SNS', 'SSM'],
  'Cloud & Data Platforms': ['DigitalOcean', 'Elastic Cloud', 'MongoDB'],
  'Infrastructure as Code': ['Terraform', 'HCP Terraform', 'AWS Organizations', 'org-formation'],
  'CI/CD & Testing': ['GitLab CI/CD', 'OIDC', 'Git', 'pytest', 'moto', 'Playwright'],
  'Systems Administration': ['Linux', 'Windows Server', 'Active Directory'],
  'Security & Monitoring': ['Wazuh SIEM', 'CloudWatch', 'Log analysis', 'Alert triage', 'Vulnerability assessment', 'Access control', 'Network segmentation'],
  'Networking': ['Layer 2/3 switching', 'Routing', 'VLANs', 'TCP/IP', 'DNS', 'DHCP', 'OpenVPN', 'IPsec/SSL VPNs', 'NAT', 'Port forwarding', 'Firewall policies'],
};

export type Certification = {
  name: string;
  issuer: string;
  category: 'cloud' | 'network' | 'security';
};

export const certifications: Certification[] = [
  { name: 'AWS Solutions Architect Associate (SAA-C03)', issuer: 'AWS', category: 'cloud' },
  { name: 'HashiCorp Terraform Associate', issuer: 'HashiCorp', category: 'cloud' },
  { name: 'AWS Cloud Practitioner', issuer: 'AWS', category: 'cloud' },
  { name: 'Azure Fundamentals (AZ-900)', issuer: 'Microsoft', category: 'cloud' },
  { name: 'Oracle Cloud Infrastructure Foundations', issuer: 'Oracle', category: 'cloud' },
  { name: 'Oracle Cloud AI Foundations', issuer: 'Oracle', category: 'cloud' },
  { name: 'Cisco CCNA', issuer: 'Cisco', category: 'network' },
  { name: 'Fortinet Certified Associate', issuer: 'Fortinet', category: 'network' },
  { name: 'Ruijie Certified Network Associate', issuer: 'Ruijie', category: 'network' },
  { name: 'Certified Ethical Hacker (CEH)', issuer: 'EC-Council', category: 'security' },
  { name: 'eCPPT — Network & Application Security', issuer: 'INE', category: 'security' },
  { name: 'eJPT — Network Security', issuer: 'INE', category: 'security' },
  { name: 'TryHackMe SOC Analyst L1 (SAL1)', issuer: 'TryHackMe', category: 'security' },
  { name: 'TryHackMe PT1', issuer: 'TryHackMe', category: 'security' },
];

export const achievements = [
  {
    year: '2024',
    title: 'Lenovo Responsible Disclosure — Hall of Fame',
    detail: 'Reported a security vulnerability in Lenovo web infrastructure through responsible disclosure.',
  },
  {
    year: '2024',
    title: 'Cisco Security Hall of Fame',
    detail: 'Reported a security vulnerability in Cisco web infrastructure through responsible disclosure.',
  },
  {
    year: '2025',
    title: 'Cisco NetAcad Riders — Silver Award',
    detail: 'Recognized for technical performance in Cisco networking challenges.',
  },
];

export const education = {
  school: 'Singapore Polytechnic',
  degree: 'Diploma in Computer Engineering',
  period: '2023 — 2026',
  gpa: '3.87 / 4.0',
  coursework: [
    'Cloud Foundations',
    'Network & Firewall Technologies',
    'Enterprise Networking',
    'Cybersecurity Operations',
    'Network Forensics & Analysis',
  ],
};
