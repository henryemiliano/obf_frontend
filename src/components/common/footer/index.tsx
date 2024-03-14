/* eslint-disable @next/next/no-img-element */
import styles from "./styles.module.scss";
import { Container } from "reactstrap";

const Footer = function () {
  return (
    <>
      <Container className={styles.footer}>
        <a href="https://www.onebitcode.com/" target={"blank"}>
          <img
            src="/logoOnebitcode.svg"
            alt="logoFooter"
            className={styles.footerLogo}
          />
        </a>

        <a
          href="https://www.linkedin.com/in/henry-emiliano/"
          target={"blank"}
          className={styles.footerLink}
        >
          Feito por Henry Emiliano 🎸
        </a>
      </Container>
    </>
  );
};

export default Footer;
