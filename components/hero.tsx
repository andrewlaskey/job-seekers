"use client";

import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { draw } from "radash";
import { useEffect, useRef, useState } from "react";

gsap.registerPlugin(SplitText);

export default function Header() {
  const [adjective, setAdjective] = useState("miserable");
  const adjectiveRef = useRef(null);
  const splitRef = useRef<SplitText | null>(null);
  const adjectives = [
    "miserable",
    "depressing",
    "discouraging",
    "exhausting",
    "lonely",
    "stressful",
    "tiring",
    "demoralizing",
    "overwhelming"
  ];

  const getNewAdjective = () => {
    let newAdjective = adjective;
    
    while (newAdjective === adjective) {
      const picked = draw(adjectives);

      if (picked) {
        newAdjective = picked;
      }
    }

    return newAdjective;
  };

  const animateText = () => {
    if (!adjectiveRef.current) return;

    const newAdjective = getNewAdjective();

    const currentSplit = splitRef.current;

    if (currentSplit) {
      // Animate current text out (up and fade)
      const tl = gsap.timeline();

      tl.to(currentSplit.chars, {
        y: -20,
        opacity: 0,
        duration: 0.4,
        stagger: 0.05,
        ease: "expo.in",
      }).call(() => {
        gsap.set(adjectiveRef.current, { visibility: "hidden" });

        // Clean up previous split first
        if (splitRef.current) {
          splitRef.current.revert();
        }

        // Update the text content
        setAdjective(newAdjective);

        // Use requestAnimationFrame to ensure DOM update completes
        requestAnimationFrame(() => {
          if (adjectiveRef.current) {
            // Create new split
            const newSplit = SplitText.create(adjectiveRef.current, {
              type: "chars",
            });
            splitRef.current = newSplit;

            // Set initial state (below and invisible)
            gsap.set(newSplit.chars, {
              y: 20,
              opacity: 0,
            });

            gsap.set(adjectiveRef.current, { visibility: "visible" });

            // Animate new text in (from bottom, character by character)
            gsap.to(newSplit.chars, {
              y: 0,
              opacity: 1,
              duration: 0.6,
              stagger: 0.05,
              ease: "expo.out",
            });
          }
        });
      });
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (adjectiveRef.current) {
      // Create initial SplitText
      const initialSplit = SplitText.create(adjectiveRef.current, {
        type: "chars",
      });
      splitRef.current = initialSplit;

      // Set up interval for animation
      interval = setInterval(animateText, 3000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
      // Clean up SplitText
      if (splitRef.current) {
        splitRef.current.revert();
      }
    };
  }, []);

  return (
    <div className="flex flex-col gap-8 pt-8 items-center">
      <h1 className="text-5xl lg:text-6xl font-bold">Job Seekers</h1>
      <div className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center">
        Looking for work is <span ref={adjectiveRef}>{adjective}</span>.
        <br />
        It helps to stay organized.
      </div>
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
    </div>
  );
}
