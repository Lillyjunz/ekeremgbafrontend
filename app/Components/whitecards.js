"use client";

import Image from "next/image";

const subjects = [
  {
    icon: "/images/math.svg",
    title: "Math Bowl",
    description:
      "Rapid-fire problem solving under pressure. Mental speed meets accuracy.",
  },
  {
    icon: "/images/mic.svg", // Replace with your debate image path
    title: "Debate",
    description:
      "Students battle ideas and logic on current issues in structured rounds",
  },
  {
    icon: "/images/science.svg", // Replace with your science image path
    title: "Science Showdown",
    description: "A STEM-focused quiz testing concepts and critical thinking",
  },
  {
    icon: "/images/spell.svg", // Replace with your spelling image path
    title: "Spelling Bee",
    description: "Spell your way to the top. Vocabulary, memory, and poise.",
  },
  {
    icon: "/images/essay.svg", // Replace with your essay image path
    title: "Essay Slam",
    description: "Express creativity and structure ideas under pressure.",
  },
];

export default function SubjectsEvents() {
  return (
    <section className="subjects-section container py-5">
      <h2 className="fw-bold mb-2">Subjects & Events</h2>
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
