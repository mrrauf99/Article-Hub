import { SITE_CONFIG } from "@/config/site.config";

export const PRIVACY_SECTIONS = [
  {
    heading: "Our Privacy Commitment",
    content:
      "At Article Hub, privacy is a core principle. We believe users should understand exactly how their data is handled. We collect only what is necessary to operate the platform and never misuse personal information.",
  },

  {
    heading: "Information We Collect",
    content: [
      "Account information such as name, email address, and profile details",
      "Content you create, publish, edit, or interact with on the platform",
      "Communication data when you contact support or provide feedback",
      "Basic technical data such as browser type, device, and IP address for security purposes",
    ],
  },

  {
    heading: "How We Use Your Information",
    content: [
      "To create, maintain, and secure your Article Hub account",
      "To publish and display your content across the platform",
      "To personalize your reading and writing experience",
      "To improve platform stability, performance, and usability",
      "To communicate important updates, announcements, or support messages",
    ],
  },

  {
    heading: "Cookies and Local Storage",
    content:
      "Article Hub uses cookies and local storage strictly for authentication, session management, and security. We do not use third-party advertising cookies or invasive tracking technologies.",
  },

  {
    heading: "Analytics and Usage Data",
    content:
      "We may analyze anonymized usage data to understand how features are used and to improve the platform. This data does not personally identify users and is used solely for internal analysis.",
  },

  {
    heading: "Data Sharing",
    content:
      "We do not sell, rent, or trade your personal data. Data may only be shared with trusted service providers (such as hosting or email services) when required to operate Article Hub, and only under strict confidentiality agreements.",
  },

  {
    heading: "Data Security",
    content:
      "We apply industry-standard security measures to protect your data from unauthorized access, loss, or misuse. While no digital system can be completely secure, safeguarding your information is a top priority.",
  },

  {
    heading: "Data Retention",
    content:
      "We retain personal data only for as long as necessary to provide our services. When an account is deleted, associated personal data is removed or anonymized unless retention is required by law.",
  },

  {
    heading: "Your Rights",
    content: [
      "Request access to your personal data",
      "Update or correct inaccurate information",
      "Request deletion of your account and personal data",
      "Withdraw consent where applicable",
    ],
  },

  {
    heading: "Policy Updates",
    content:
      "This Privacy & Data page may be updated from time to time to reflect platform improvements or legal requirements. Significant changes will be clearly communicated.",
  },

  {
    heading: "Contact Us",
    content: `If you have questions or concerns regarding privacy or data handling, contact us at ${SITE_CONFIG.email.support}.`,
  },
];
