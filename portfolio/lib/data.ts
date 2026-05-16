// =============================================================================
// PORTFOLIO DATA — single source of truth
// Edit this file to update your content. No JSX changes required.
// =============================================================================

export const profile = {
  name: 'Htoo Aung Win',
  role: 'Cloud & DevOps Engineer',
  tagline: 'Building reliable infrastructure across networking, cloud, and security.',
  location: 'Singapore',
  status: 'Open to opportunities',
  // TODO: replace with your GitHub username when ready
  github: 'https://github.com/your-username',
  linkedin: 'https://linkedin.com/in/htooaungwin',
  email: 'haw.connect@gmail.com',
  // TODO: drop your resume PDF in /public and update filename if it changes
  resumePdf: '/HtooAungWin_SRE.pdf',
};

export const about = {
  // Two short paragraphs. Keep punchy — most visitors skim.
  paragraphs: [
    `I work where networks, cloud, and security overlap — the layer that decides whether a system is reliable or fragile. My foundation is in enterprise networking and Linux systems, and I've been steadily moving deeper into cloud infrastructure and automation: AWS, Terraform, observability.`,
    `Right now I'm focused on closing the gap between "it works" and "it works at 3 AM during a regional outage." That means infrastructure as code, monitoring that actually catches what matters, and architecture that fails gracefully. I'm aiming for SRE / Cloud Engineering work where reliability is the product.`,
  ],
};

export type Experience = {
  role: string;
  company: string;
  location: string;
  period: string;
  bullets: string[];
};

export const experience: Experience[] = [
  {
    role: 'System and Network Engineer Intern',
    company: 'Zectech Pte Ltd',
    location: 'Singapore',
    period: 'Sep 2025 — Feb 2026',
    bullets: [
      'Supported availability and reliability of infrastructure systems across multiple client environments',
      'Deployed and configured enterprise network infrastructure including Layer 2/3 switches, wireless access points, and endpoint systems',
      'Configured and maintained secure connectivity (VPN, firewall policies, NAT) for stable and reliable system communication',
      'Used Linux CLI tools for system diagnostics, log inspection, process analysis, and performance monitoring',
      'Maintained infrastructure documentation including topology diagrams, configuration backups, and asset inventory',
    ],
  },
  {
    role: 'Security System Engineer',
    company: 'AGB Communication Co., Ltd',
    location: 'Remote',
    period: 'Aug 2025 — Feb 2026',
    bullets: [
      'Conducted infrastructure and network security assessments to identify risks impacting system stability',
      'Performed log analysis and anomaly detection using SIEM tooling for incident detection and response workflows',
      'Evaluated network segmentation, firewall policies, and access controls to improve resilience and reduce risk exposure',
      'Collaborated with engineering teams to implement secure infrastructure improvements without service disruption',
      'Produced technical reports with risk analysis and remediation strategies',
    ],
  },
];

export type Project = {
  name: string;
  status: 'live' | 'archived' | 'wip';
  summary: string;
  highlights: string[];
  stack: string[];
  // TODO: add github link when public
  repo?: string;
  demo?: string;
};

export const projects: Project[] = [
  {
    name: 'Highly Available AWS Web Infrastructure',
    status: 'live',
    summary:
      'Multi-tier AWS architecture designed for high availability and fault tolerance across multiple availability zones.',
    highlights: [
      'Designed VPC with public/private subnets and route tables across multiple AZs',
      'Implemented Application Load Balancer and Auto Scaling Group for fault tolerance',
      'Deployed EC2 instances (Linux + Windows) using user-data scripts for automated provisioning',
      'Configured RDS as managed database layer integrated with the application tier',
      'Applied security groups, network segmentation, and least-privilege access between tiers',
      'Monitored resource health and availability with CloudWatch metrics and logs',
      'Documented limitations of RDS replication under IAM constraints and proposed improvements',
    ],
    stack: ['AWS VPC', 'EC2', 'ALB', 'Auto Scaling', 'RDS', 'CloudWatch', 'IAM'],
    // repo: 'https://github.com/your-username/aws-ha-infra',
  },
];

export const skills = {
  'Cloud & Infrastructure': [
    'AWS (EC2, S3, VPC, IAM, CloudWatch)',
    'Azure Fundamentals',
    'Terraform (IaC)',
    'Windows Server',
    'Active Directory',
    'Microsoft Intune',
  ],
  'Linux & Systems': [
    'Advanced Linux CLI',
    'File systems & permissions',
    'Process management',
    'Networking stack',
    'Endpoint deployment',
  ],
  'Monitoring & Observability': [
    'Log analysis',
    'SIEM tooling',
    'Alert triage',
    'Anomaly detection',
    'Incident response',
    'CloudWatch metrics',
  ],
  'Networking': [
    'Layer 2/3 switching & routing',
    'VLANs & inter-VLAN routing',
    'TCP/IP, DNS, DHCP',
    'VPN (IPsec/SSL)',
    'NAT / port forwarding',
    'Firewall policy configuration',
  ],
  'Security': [
    'Network security assessment',
    'Vulnerability identification',
    'Firewall hardening',
    'Access control',
    'Penetration testing methodology',
  ],
  'DevOps Fundamentals': [
    'Git & branching workflows',
    'CI/CD pipeline concepts',
    'Infrastructure as Code',
    'Technical documentation',
  ],
};

export type Certification = {
  name: string;
  issuer: string;
  category: 'cloud' | 'network' | 'security';
};

export const certifications: Certification[] = [
  // Cloud & Infrastructure
  { name: 'AWS Solutions Architect Associate (SAA-C03)', issuer: 'AWS', category: 'cloud' },
  { name: 'HashiCorp Terraform Associate', issuer: 'HashiCorp', category: 'cloud' },
  { name: 'AWS Cloud Practitioner', issuer: 'AWS', category: 'cloud' },
  { name: 'Azure Fundamentals (AZ-900)', issuer: 'Microsoft', category: 'cloud' },
  { name: 'Oracle Cloud Infrastructure Foundations', issuer: 'Oracle', category: 'cloud' },
  { name: 'Oracle Cloud AI Foundations', issuer: 'Oracle', category: 'cloud' },
  // Networking
  { name: 'Cisco CCNA', issuer: 'Cisco', category: 'network' },
  { name: 'Fortinet Certified Associate', issuer: 'Fortinet', category: 'network' },
  { name: 'Ruijie Certified Network Associate', issuer: 'Ruijie', category: 'network' },
  // Security
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
    detail: 'Identified and reported a security vulnerability in Lenovo web infrastructure through responsible disclosure.',
  },
  {
    year: '2024',
    title: 'Cisco Security Hall of Fame',
    detail: 'Identified and reported a security vulnerability in Cisco web infrastructure through responsible disclosure.',
  },
  {
    year: '2025',
    title: 'Cisco NetAcad Riders — Silver Award',
    detail: 'Ranked among top achievers for technical skills and consistent performance in Cisco networking challenges.',
  },
];

export const education = {
  school: 'Singapore Polytechnic',
  degree: 'Diploma in Computer Engineering',
  period: '2023 — 2026',
  gpa: '3.87 / 4.0',
  coursework: [
    'Network & Firewall Technologies',
    'Cloud Foundations',
    'Cybersecurity Operations',
    'Enterprise Networking',
    'Switching, Routing & Wireless',
    'Network Forensics & Analysis',
  ],
};
