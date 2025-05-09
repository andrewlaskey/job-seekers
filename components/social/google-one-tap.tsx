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

        // Initialize Google One Tap
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: async (response: CredentialResponse) => {
            try {
              // send id token returned in response.credential to supabase
              const { data, error } = await supabase.auth.signInWithIdToken({
                provider: "google",
                token: response.credential,
                nonce,
              });

              if (error) throw error;
              console.log("Successfully logged in with Google One Tap");

              // redirect to protected page
              router.push("/dashboard");
            } catch (error) {
              console.error("Error logging in with Google One Tap", error);
            }
          },
          nonce: hashedNonce,
          use_fedcm_for_prompt: false,
        });

        // Display the Google One Tap UI
        window.google.accounts.id.prompt();

        // Render the standard Google Sign-In button
        if (googleButtonContainerRef.current) {
          window.google.accounts.id.renderButton(
            googleButtonContainerRef.current,
            {
              type: "standard",
              theme: "outline",
              size: "large",
              text: "signin_with",
              shape: "rectangular",
              logo_alignment: "left",
              width: 240,
            }
          );
        }
      } else {
        console.error("Google One Tap not available");
      }
    } catch (error) {
      console.error("Error initializing Google Sign-In", error);
    }
  };

  useEffect(() => {
    // Initialize Google Sign-In when the script is fully loaded
    if (isGoogleLoaded) {
      initializeGoogleSignIn();
    }
  }, [isGoogleLoaded]);

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

      {/* Container for automatic One Tap prompt */}
      <div id="oneTap" className="my-2" />

      {/* Container for the Google Sign-In button */}
      <div ref={googleButtonContainerRef} className="my-2" />
    </div>
  );
}
