import { Mail, MapPin, Clock } from "lucide-react";
import { SITE_CONFIG } from "@/config/site.config";

export const CONTACT_INFO = [
  {
    icon: Mail,
    title: "Email",
    content: SITE_CONFIG.email.support,
    link: `mailto:${SITE_CONFIG.email.support}`,
  },
  {
    icon: MapPin,
    title: "Location",
    content: "Gujranwala, Punjab, Pakistan",
  },
  {
    icon: Clock,
    title: "Working Hours",
    content: "Mon - Fri: 9:00 AM - 5:00 PM GMT+5",
  },
];
