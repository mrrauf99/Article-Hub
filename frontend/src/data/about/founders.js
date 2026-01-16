import { Github, Linkedin, Globe } from "lucide-react";

export const FOUNDERS = [
  {
    name: "Abdul Rauf",
    role: "Founder & Full Stack Developer",
    bio: `Passionate full-stack developer dedicated to crafting exceptional digital experiences. I transform complex ideas into elegant, high-performance web applications. Let's build something amazing together — your vision, my expertise.`,
    avatar: "https://avatars.githubusercontent.com/u/216373840?v=4",
    tags: ["Full Stack", "React", "Node", "Express", "PostgreSQL", "MongoDB", "Tailwind CSS", "REST API", "System Design", "UI/UX"],
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
];
