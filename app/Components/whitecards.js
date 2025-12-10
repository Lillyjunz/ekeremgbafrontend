"use client";

import Image from "next/image";

const subjects = [
  {
    icon: "/images/essay.svg",
    title: "Ọlanchọ (Traditional Game)",
    description: "Sharp minds, sharp words.",
  },
  {
    icon: "/images/spell.svg",
    title: "Arụmụka (Debate)",
    description: "Where culture meets respect.",
  },
  {
    icon: "/images/mic.svg",
    title: "Ịkpọ Ụga (Traditional Game)",
    description: "The heartbeat of Igbo philosophy.",
  },
  {
    icon: "/images/mic.svg",
    title: "Akụkọ ifo na Egwu (Storytelling and Song)",
    description: "Creativity through oral tradition.",
  },
  {
    icon: "/images/science.svg",
    title: "Sayensị na NkanaỤzụ (Science and Technology)",
    description: "A battle of the minds.",
  },
];

export default function SubjectsEvents() {
  return (
    <section className="subjects-section container py-5">
      <h2
        className="fw-bold mb-2"
        style={{ color: "#4f4f4f" }}
        data-aos="fade-up"
        data-aos-duration="800"
      >
        Categories
      </h2>
      <p
        className="text-muted mb-4"
        data-aos="fade-up"
        data-aos-delay="100"
        data-aos-duration="800"
      >
        The competition will feature the following
      </p>
      <div className="row gy-4">
        {subjects.map((item, idx) => (
          <div key={idx} className="col-md-4">
            <div
              className="subject-card p-4 h-100 rounded-4 bg-light"
              data-aos="zoom-in"
              data-aos-delay={idx * 100}
              data-aos-duration="800"
            >
              <div className="subject-icon mb-3">
                <Image
                  src={item.icon}
                  alt={`${item.title} icon`}
                  width={40}
                  height={40}
                  className="subject-icon-img"
                />
              </div>
              <h5 className="fw-semibold text-black">{item.title}</h5>
              <p className="mb-0 text-black">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
