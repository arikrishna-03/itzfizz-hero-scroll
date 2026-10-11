import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  gsap.config({
    autoSleep: 60,
    force3D: true,
  });
}

export { gsap, ScrollTrigger, useGSAP };
