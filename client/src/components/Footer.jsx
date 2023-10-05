import Logo from "../img/blog1logo.png";

const Footer = () => {
  return (
    <footer>
      <img src={Logo} alt="logo" />
      <span>
        Made with ❤ and <b>React.js</b>
      </span>
    </footer>
  );
};

export default Footer;
