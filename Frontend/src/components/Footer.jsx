import styles from "./styles/Footer.module.css";

import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Slack,
  Gamepad2,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* LEFT SECTION */}
        <div className={styles.left}>
          <h2 className={styles.title}>Article Hub</h2>

          <p className={styles.description}>
            We are Computer Science students at UET RCET, currently in our 3rd
            semester. Article Hub is our semester project, created with the aim
            of sharing interesting and informative articles on a variety of
            topics.
          </p>

          <div className="gap-4 flex mt-4 sm:justify-start justify-center">
            <Facebook className="w-6 h-6 text-blue-400 cursor-pointer" />
            <Instagram className="w-6 h-6 text-pink-400 cursor-pointer" />
            <Twitter className="w-6 h-6 text-sky-400 cursor-pointer" />
            <Linkedin className="w-6 h-6 text-blue-600 cursor-pointer" />
            <Youtube className="w-6 h-6 text-red-500 cursor-pointer" />
            <Slack className="w-6 h-6 text-purple-700 cursor-pointer" />
            <Gamepad2 className="w-6 h-6 text-green-400 cursor-pointer" />
          </div>
        </div>

        <div className={styles.linksCol}>
          <span className={styles.heading}>Home</span>
          <a className={styles.link}>Blogs</a>
          <a className={styles.link}>Courses</a>
          <a className={styles.link}>YouTube</a>
        </div>

        <div className={styles.linksCol}>
          <span className={styles.heading}>About</span>
          <a className="{styles.link}">Contact</a>
          <a className={styles.link}>Privacy Policy</a>
          <a className={styles.link}>Terms & Conditions</a>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <span>COPYRIGHT @ {new Date().getFullYear()} Article Hub</span>
        <span>
          Developed by:{" "}
          <strong className={styles.devName}>Rauf & Tayyab</strong>
        </span>
      </div>
    </footer>
  );
}
