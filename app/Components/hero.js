"use client";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
// import "swiper/css/pagination";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
// Styles should be added to your global.css file

const HeroSwiper = () => {
  const heroSlides = [
    {
      id: 1,
      backgroundImage: "/images/for.jpg",
      title: "Discover Amazing Places",
      subtitle: "Explore the world with us",
      description:
        "Embark on unforgettable journeys to breathtaking destinations around the globe.",
      primaryButton: {
        text: "Register your school",
        link: "#explore",
      },
      secondaryButton: {
        text: "View fixtures",
        link: "#video",
      },
    },
    {
      id: 2,
      backgroundImage: "/images/forr.jpg",
      title: "Adventure Awaits",
      subtitle: "Push your boundaries",
      description:
        "Challenge yourself with thrilling adventures and create memories that last a lifetime.",
      primaryButton: {
        text: "Book Adventure",
        link: "#book",
      },
      secondaryButton: {
        text: "Learn More",
        link: "#about",
      },
    },
    {
      id: 3,
      backgroundImage: "/images/for.jpg",
      title: "Relax & Unwind",
      subtitle: "Find your peace",
      description:
        "Escape to serene locations where tranquility meets natural beauty.",
      primaryButton: {
        text: "Find Peace",
        link: "#relax",
      },
      secondaryButton: {
        text: "View Gallery",
        link: "#gallery",
      },
    },
  ];

  return (
    <section className="hero-section">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        // pagination={{ clickable: true }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop={true}
        className="hero-swiper"
      >
        {heroSlides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="slide-content">
              <div
                className="slide-background"
                style={{ backgroundImage: `url(${slide.backgroundImage})` }}
              >
                <div className="slide-overlay"></div>
              </div>

              <div className="container h-100">
                <div className="row h-100 align-items-center justify-content-center text-center">
                  <div className="col-lg-8 col-xl-6">
                    <div className="slide-text">
                      <p className="hero-subtitle text-uppercase mb-3">
                        {slide.subtitle}
                      </p>
                      <h1 className="hero-title display-2 fw-bold mb-4">
                        {slide.title}
                      </h1>
                      <p className="hero-description lead mb-4">
                        {slide.description}
                      </p>
                      <div className="hero-buttons d-flex flex-column flex-sm-row gap-3 justify-content-center align-items-center">
                        <a
                          href={slide.primaryButton.link}
                          className="btn hero-btn-primary btn-lg px-5 py-3"
                        >
                          {slide.primaryButton.text}
                        </a>
                        <a
                          href={slide.secondaryButton.link}
                          className="btn hero-btn-secondary btn-lg px-5 py-3"
                        >
                          {slide.secondaryButton.text}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default HeroSwiper;
