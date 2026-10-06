import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  // Configure GSAP defaults for silky 60fps rendering
  gsap.config({
    autoSleep: 60,
    force3D: true,
  });
}

export { gsap, ScrollTrigger };
