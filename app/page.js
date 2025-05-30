import CallToAction from "./Components/call";
import FaqSection from "./Components/faqs";
import Footer from "./Components/footer";
import HeroSwiper from "./Components/hero";
import HowItWorks from "./Components/how";
import SchoolLegacyStats from "./Components/intro";
import ExcitingMomentsCarousel from "./Components/moments";
import Navbar from "./Components/navbar";
import Topbar from "./Components/topbar";
import TopSchools from "./Components/topschools";
import SubjectsEvents from "./Components/whitecards";

const page = () => {
  return (
    <div>
      <Topbar></Topbar>
      <Navbar></Navbar>
      <HeroSwiper></HeroSwiper>
      <SchoolLegacyStats></SchoolLegacyStats>
      <HowItWorks></HowItWorks>
      <SubjectsEvents></SubjectsEvents>
      <TopSchools></TopSchools>
      <ExcitingMomentsCarousel></ExcitingMomentsCarousel>
      <FaqSection></FaqSection>
      <CallToAction></CallToAction>
      <Footer></Footer>
    </div>
  );
};

export default page;
