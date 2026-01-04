import { Github, Linkedin, Globe } from "lucide-react";

export const FOUNDERS = [
  {
    name: "Abdul Rauf",
    role: "Founder & Full Stack Developer",
    bio: `Passionate full-stack developer dedicated to crafting exceptional digital experiences. I transform complex ideas into elegant, high-performance web applications. Let's build something amazing together — your vision, my expertise.`,
    avatar: "https://avatars.githubusercontent.com/u/216373840?v=4",
    tags: ["Full Stack", "React", "Node.js", "System Design", "UI/UX"],
    featured: true,
    socials: [
      {
        name: "GitHub",
        url: "https://github.com/mrrauf99",
        icon: Github,
      },
      {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/abdul-rauf-026852381/",
        icon: Linkedin,
      },
      {
        name: "Portfolio",
        url: "",
        icon: Globe,
      },
    ],
  },
  {
    name: "Tayyab Ali",
    role: "UI/UX Designer & Frontend Developer",
    bio: `Design-oriented frontend developer passionate about crafting intuitive, accessible, and visually refined user experiences. Specializes in translating complex ideas into clean, user-friendly interfaces and scalable design systems.`,
    avatar: "https://avatars.githubusercontent.com/u/192490949?v=4",
    tags: ["UI Design", "Design Systems", "Frontend"],
    featured: false,
    socials: [
      {
        name: "GitHub",
        url: "https://github.com/Tayyab054",
        icon: Github,
      },
      {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/tayyab054/",
        icon: Linkedin,
      },
      {
        name: "Portfolio",
        url: "",
        icon: Globe,
      },
    ],
  },
];
