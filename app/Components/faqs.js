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
    {
      question: "Who can register for the competition?",
      answer:
        "The competition is open to students from secondary schools across the Abia State and beyond. Each school may register a team of students under the supervision of a teacher or school coordinator.",
    },
    {
      question: "How are competitions judged?",
      answer:
        "All competitions are judged by a panel of qualified educators, linguists, and cultural experts. Entries are evaluated based on accuracy, creativity, presentation, and understanding of Igbo language and cultural values. The judging process is transparent and guided by clearly defined criteria.",
    },
    {
      question: "Is there a registration fee?",
      answer:
        "No. Participation in Ekeremgba Akpauche is completely free. The programme is organised as an educational and cultural service to develop the Igbo language and heritage through engaging ideas and innovations from students and researchers.",
    },
    {
      question: "How do I track event schedules and results?",
      answer:
        "Event schedules, updates, and results will be published on the Ekeremgba Akpauche website and official social media channels. Registered schools will also receive direct notifications via email or WhatsApp from the organising committee.",
    },
    {
      question: "Will participants receive certificates?",
      answer:
        "Yes. All participants, as well as their schools and teachers, will receive certificates of participation. Winners and outstanding performers will also receive special awards and recognitions during the Grand Finale.",
    },
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
                    <span>{item.question}</span>
                    <span
                      className={`faq-icon ${openItems[index] ? "open" : ""}`}
                    >
                      {openItems[index] ? "−" : "+"}
                    </span>
                  </button>
                  {openItems[index] && (
                    <div className="faq-answer">
                      <p>{item.answer}</p>
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
