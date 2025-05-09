"use client";

import Script from "next/script";
import { createClient } from "@/utils/supabase/client";
import { CredentialResponse } from "google-one-tap";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

export default function GoogleOneTapComponent() {
  const supabase = createClient();
  const router = useRouter();
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const [isGoogleInitialized, setIsGoogleInitialized] = useState(false);
  const googleButtonContainerRef = useRef<HTMLDivElement>(null);

  // generate nonce to use for google id token sign-in
  const generateNonce = async (): Promise<string[]> => {
    // Create a random array
    const randomArray = new Uint8Array(32);
    crypto.getRandomValues(randomArray);

    // Convert to string without using spread operator
    let nonce = "";
    for (let i = 0; i < randomArray.length; i++) {
      nonce += String.fromCharCode(randomArray[i]);
    }
    nonce = btoa(nonce);

    // Hash the nonce
    const encoder = new TextEncoder();
    const encodedNonce = encoder.encode(nonce);
    const hashBuffer = await crypto.subtle.digest("SHA-256", encodedNonce);

    // Convert hash to hex string without using Array.from
    const hashArray = new Uint8Array(hashBuffer);
    let hashedNonce = "";
    for (let i = 0; i < hashArray.length; i++) {
      hashedNonce += hashArray[i].toString(16).padStart(2, "0");
    }

    return [nonce, hashedNonce];
  };

  const initializeGoogleSignIn = async () => {
    try {
      if (isGoogleInitialized) {
        // Avoid re-initializing if already done
        return;
      }

      const [nonce, hashedNonce] = await generateNonce();

      if (
        typeof window !== "undefined" &&
        window.google?.accounts &&
        process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
      ) {
        // First check if there's an existing session
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error getting session", error);
          return;
        }
        if (data.session) {
          router.push("/dashboard");
          return;
        }

        const googleSignInCallback = async (response: CredentialResponse) => {
          try {
            console.log("Received credential response from Google");

            if (!response.credential) {
              console.error("Invalid credential response - missing credential");
              return;
            }

            // Log credential details (truncated for security)
            console.log(
              "Credential received length:",
              response.credential.length
            );
            console.log(
              "Credential prefix:",
              response.credential.substring(0, 10) + "..."
            );

            // send id token to supabase
            console.log("Sending token to Supabase...");
            const { data, error } = await supabase.auth.signInWithIdToken({
              provider: "google",
              token: response.credential,
              nonce: nonce,
            });

            if (error) {
              console.error("Supabase auth error:", error);
              return;
            }

            console.log("Successfully logged in with Google");

            // Force router to refetch data
            router.refresh();

            // Navigate to dashboard
            router.push("/dashboard");
          } catch (error) {
            console.error("Error in Google Sign-In callback:", error);
          }
        };

        // Initialize Google One Tap
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: googleSignInCallback,
          nonce: hashedNonce,
          use_fedcm_for_prompt: false,
        });

        setIsGoogleInitialized(true);
        renderGoogleButton();
      } else {
        console.error("Google One Tap not available");
      }
    } catch (error) {
      console.error("Error initializing Google Sign-In", error);
    }
  };

  const renderGoogleButton = () => {
    if (googleButtonContainerRef.current && window.google?.accounts?.id) {
      // Clear the container first to prevent duplicate buttons
      googleButtonContainerRef.current.innerHTML = "";

      console.log("Rendering Google Sign-In button...");
      window.google.accounts.id.renderButton(googleButtonContainerRef.current, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: "signin_with",
        shape: "rectangular",
        logo_alignment: "left",
        width: 240,
      });
      console.log("Google Sign-In button rendered");
    } else {
      console.error("Button container ref not found or Google not loaded");
    }
  };

  // Check if Google script is already loaded (handles the case where script is already in DOM)
  useEffect(() => {
    if (typeof window !== "undefined" && window.google?.accounts) {
      console.log("Google script already loaded");
      setIsGoogleLoaded(true);
    }
  }, []);

  // Initialize when Google script is loaded
  useEffect(() => {
    if (isGoogleLoaded) {
      initializeGoogleSignIn();
    }
  }, [isGoogleLoaded]);

  // Re-render button when ref or initialization state changes
  useEffect(() => {
    if (isGoogleInitialized && googleButtonContainerRef.current) {
      renderGoogleButton();
    }
  }, [isGoogleInitialized, googleButtonContainerRef.current]);

  // This effect ensures the button is rendered when the component is mounted via client navigation
  useEffect(() => {
    // If the script is already loaded but the button isn't rendered
    if (
      typeof window !== "undefined" &&
      window.google?.accounts &&
      isGoogleInitialized
    ) {
      renderGoogleButton();
    }
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 mt-4">
      <Script
        src="https://accounts.google.com/gsi/client"
        onLoad={() => {
          console.log("Google script loaded");
          setIsGoogleLoaded(true);
        }}
        strategy="afterInteractive"
      />

      {/* Container for the Google Sign-In button */}
      <div ref={googleButtonContainerRef} className="my-2 min-h-10" />
    </div>
  );
}
