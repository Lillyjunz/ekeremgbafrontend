// components/FAQ.js
"use client";
import { useState } from "react";

const FaqSection = () => {
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (index) => {
    setOpenItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const faqItems = [
    "Who can register for the competition?",
    "How are competitions judged?",
    "Is there a registration fee?",
    "How do I track event schedules and results?",
    "Will participants receive certificates?",
  ];

  return (
    <section className="faq-section">
      <div className="container">
        <div className="row">
          <div className="col-lg-5 col-md-6">
            <div className="faq-intro">
              <h2 className="faq-title">Check Our FAQs</h2>
              <p className="faq-description">
                Have a question about Ekeremgba? Our FAQ section has got you
                covered with helpful information on all of our offerings.
              </p>
              <p className="faq-subtitle">
                Do you have any questions or could not find what you are looking
                for?
              </p>
              <button className="btn-contact">Contact us</button>
            </div>
          </div>
          <div className="col-lg-7 col-md-6">
            <div className="faq-items">
              {faqItems.map((item, index) => (
                <div key={index} className="faq-item">
                  <button
                    className="faq-question"
                    onClick={() => toggleItem(index)}
                    aria-expanded={openItems[index]}
                  >
                    <span>{item}</span>
                    <span
                      className={`faq-icon ${openItems[index] ? "open" : ""}`}
                    >
                      {openItems[index] ? "−" : "+"}
                    </span>
                  </button>
                  {openItems[index] && (
                    <div className="faq-answer">
                      <p>
                        This is a sample answer for "{item}". Replace this
                        content with the actual answer for each FAQ item.
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
