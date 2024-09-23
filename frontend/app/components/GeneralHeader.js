import Link from "next/link";

const GeneralHeader = () => {
  return (
    <header className="sticky top-0 bg-header h-16 px-20 py-5 mb-0">
      <div className="logo"></div>
      <ul>
        <li><Link href="#home">Home</Link></li>
        <li><Link href="#about">About Us</Link></li>
        <li><Link href="#faqs">FAQs</Link></li>
        <li><Link href="#contact">Contact Us</Link></li>
      </ul>
      <div className="inline-block absolute top-5 right-5 px-20">
          <Link href="../pages/GENERAL/Login">
              <h3>Sign in as Applicant</h3>
          </Link>
      </div>
    </header>
  );
};

export default GeneralHeader;
