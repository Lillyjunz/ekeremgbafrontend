"use client";

import Image from "next/image";

const subjects = [
  {
    icon: "/images/essay.svg",
    title: "Ọlanchọ (Debate)",
    description: "Sharp minds, sharp words.",
  },
  {
    icon: "/images/spell.svg",
    title: "Ịgọ Ọjị (Kolanut Presentation)",
    description: "Culture meets respect.",
  },
  {
    icon: "/images/science.svg",
    title: "Ịkpọ Ụga (Proverbs & Wisdom)",
    description: "The heartbeat of Igbo philosophy.",
  },
  {
    icon: "/images/mic.svg",
    title: "Storytelling & Song",
    description: "Creativity through oral tradition.",
  },
];

export default function SubjectsEvents() {
  return (
    <section className="subjects-section container py-5">
      <h2 className="fw-bold mb-2" style={{ color: "#4f4f4f" }}>
        Categories
      </h2>
      <p className="text-muted mb-4">
        The competition will feature the following
      </p>
      <div className="row gy-4">
        {subjects.map((item, idx) => (
          <div key={idx} className="col-md-4">
            <div className="subject-card p-4 h-100 rounded-4 bg-light">
              <div className="subject-icon mb-3">
                <Image
                  src={item.icon}
                  alt={`${item.title} icon`}
                  width={40}
                  height={40}
                  className="subject-icon-img"
                />
              </div>
              <h5 className="fw-semibold">{item.title}</h5>
              <p className="mb-0">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
