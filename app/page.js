import CallToAction from "./Components/call";
import FaqSection from "./Components/faqs";
import Footer from "./Components/footer";
import HeroSection from "./Components/hero";
import HowItWorks from "./Components/how";
import SchoolLegacyStats from "./Components/intro";
import ExcitingMomentsCarousel from "./Components/moments";
import Navbar from "./Components/navbar";
import TopSchools from "./Components/topschools";
import SubjectsEvents from "./Components/whitecards";

const page = () => {
  return (
    <div>
      <Navbar></Navbar>
      <HeroSection></HeroSection>

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
