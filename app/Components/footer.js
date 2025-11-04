import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <div>
      <div
        className="container-fluid footer  "
        style={{ backgroundColor: "#fff" }}
      >
        <div className="container pt-5 pb-4">
          <div className="row g-5">
            <div className="col-lg-3 col-md-6">
              <div>
                <Image
                  src="/images/logo.png"
                  width={130}
                  height={80}
                  alt="logo"
                ></Image>
              </div>
            </div>

            <div className="col-lg-2 col-md-6">
              <div
                className="d-flex flex-column help-link"
                style={{ color: "#4f4f4f" }}
              >
                <Link href="/about" className="mb-2 ">
                  About
                </Link>
                <Link href="#Faq" className="mb-2 ">
                  FQAs
                </Link>
              </div>
            </div>

            <div className="col-lg-2 col-md-6">
              <div
                className=" d-flex flex-column help-link"
                style={{ color: "#4f4f4f" }}
              >
                <Link href="" className="mb-2 ">
                  Events
                </Link>
                <Link href="" className="mb-2 ">
                  Debate
                </Link>
                <Link href="/about" className="mb-2 ">
                  English
                </Link>

                <Link href="/contact" className="mb-2 ">
                  Maths
                </Link>
              </div>
            </div>

            <div className="col-lg-3 col-md-6 align-items-center">
              <div
                className=" d-flex flex-column help-link"
                style={{ color: "#4f4f4f" }}
              >
                <Link href="" className="mb-2 ">
                  Contact
                </Link>
                <Link href="" className="mb-2 ">
                  ekeremgba@gmail.com
                </Link>
                <Link href="/about" className="mb-2 ">
                  (+234) 9049 9585 85
                </Link>
              </div>
            </div>

            <div className="col-lg-2 col-md-6">
              <div className="d-flex hightech-link">
                <Link href="https://www.facebook.com/share/17SitWbqNz/">
                  <Image
                    className="me-2"
                    src="/images/Facebook.png"
                    width={30}
                    height={30}
                    alt="footer"
                  ></Image>
                </Link>

                <Link href="https://www.tiktok.com/@ekeremgbaakpauche?_t=ZN-90akK2wuO02&_r=1">
                  <Image
                    className="me-2"
                    src="/images/tik.png"
                    width={30}
                    height={30}
                    alt="footer"
                  ></Image>
                </Link>
                <Link href="https://youtube.com/@ekeremgbaakpauche?si=Gn2pg-5vSO3exhmF">
                  <Image
                    className="me-2"
                    src="/images/Youtube.png"
                    width={30}
                    height={30}
                    alt="footer"
                  ></Image>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
