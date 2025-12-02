import { FileText } from "lucide-react";
import styles from "../styles/navbar.module.css";

export default function NavLogo() {
  return (
    <div className={styles.logo}>
      <FileText className={styles.logoIcon} />
      <span className={styles.logoText}>Article Hub</span>
    </div>
  );
}
