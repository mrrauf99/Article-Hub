import { useCallback, useEffect, useRef, useState } from "react";
import { useGoogleOAuth } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../api/authApi";

let hasAttemptedOneTap = false;

function GoogleButtonPlaceholder({ isLoading }) {
  return (
    <button
      type="button"
      className="flex w-full items-center justify-center rounded-full border border-hairline-strong bg-paper-raised px-4 py-3 font-ui text-[0.9375rem] font-medium text-ink opacity-65"
      disabled
      aria-busy={isLoading}
    >
      {isLoading ? "Connecting to Google..." : "Continue with Google"}
    </button>
  );
}

function GoogleAuthFallback() {
  return (
    <div className="mt-3 flex w-full flex-col items-center justify-center gap-2">
      <GoogleButtonPlaceholder isLoading={false} />
      <p className="text-center text-sm text-red-600" role="alert">
        Google sign-in is not configured for this site.
      </p>
    </div>
  );
}

function ConfiguredGoogleAuthButton({ disabled, onSubmittingChange }) {
  const { clientId, scriptLoadedSuccessfully } = useGoogleOAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const requestInFlight = useRef(false);
  const attemptPending = useRef(false);
  const disabledRef = useRef(disabled);
  const buttonContainerRef = useRef(null);
  disabledRef.current = disabled;

  const setGoogleSubmitting = useCallback(
    (value) => {
      setIsSubmitting(value);
      onSubmittingChange?.(value);
    },
    [onSubmittingChange],
  );

  const clearPendingAttempt = useCallback(() => {
    if (!attemptPending.current || requestInFlight.current) return;
    attemptPending.current = false;
    setGoogleSubmitting(false);
  }, [setGoogleSubmitting]);

  const handleButtonClick = useCallback(() => {
    if (disabledRef.current || attemptPending.current || requestInFlight.current) {
      return;
    }
    attemptPending.current = true;
    setError("");
    setGoogleSubmitting(true);
  }, [setGoogleSubmitting]);

  useEffect(() => {
    const handleWindowFocus = () => {
      window.setTimeout(clearPendingAttempt, 0);
    };
    window.addEventListener("focus", handleWindowFocus);
    return () => window.removeEventListener("focus", handleWindowFocus);
  }, [clearPendingAttempt]);

  const handleCredential = useCallback(
    async (response) => {
      if (requestInFlight.current) return;
      if (!response.credential) {
        setError("Google sign-in could not be verified. Please try again.");
        attemptPending.current = false;
        setGoogleSubmitting(false);
        return;
      }

      requestInFlight.current = true;
      attemptPending.current = false;
      setGoogleSubmitting(true);
      setError("");

      try {
        const result = await authApi.googleLogin({
          credential: response.credential,
        });
        navigate(result.data.redirectTo, { replace: true });
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "Google sign-in failed. Please try again.",
        );
      } finally {
        requestInFlight.current = false;
        setGoogleSubmitting(false);
      }
    },
    [navigate, setGoogleSubmitting],
  );

  useEffect(() => {
    if (!clientId || !scriptLoadedSuccessfully) return undefined;

    const googleIdentity = window.google?.accounts?.id;
    if (!googleIdentity) return undefined;

    try {
      googleIdentity.initialize({
        client_id: clientId,
        callback: handleCredential,
        auto_select: false,
        context: "signin",
      });

      const buttonContainer = buttonContainerRef.current;
      if (buttonContainer) {
        buttonContainer.replaceChildren();
        googleIdentity.renderButton(buttonContainer, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: "continue_with",
          shape: "pill",
          logo_alignment: "left",
          width: Math.min(400, Math.floor(buttonContainer.clientWidth)),
          click_listener: handleButtonClick,
        });
      }

      if (!hasAttemptedOneTap) {
        hasAttemptedOneTap = true;
        try {
          googleIdentity.prompt();
        } catch {}
      }
    } catch {
      setError("Google sign-in is temporarily unavailable. Try again.");
    }

    return () => googleIdentity.cancel();
  }, [clientId, handleButtonClick, handleCredential, scriptLoadedSuccessfully]);

  if (!scriptLoadedSuccessfully) {
    return (
      <div className="mt-3 flex w-full flex-col items-center justify-center gap-2">
        <GoogleButtonPlaceholder isLoading={!disabled} />
        {error && (
          <p className="text-center text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="mt-3 flex w-full flex-col items-center justify-center gap-2">
      <div className="relative min-h-12 w-full">
        <div
          ref={buttonContainerRef}
          className={`flex w-full justify-center rounded-full transition-shadow duration-150 hover:shadow-sm motion-reduce:transition-none ${disabled || isSubmitting ? "invisible pointer-events-none" : ""}`}
        />
        {(disabled || isSubmitting) && (
          <div className="absolute inset-0">
            <GoogleButtonPlaceholder isLoading={isSubmitting} />
          </div>
        )}
      </div>
      {error && (
        <p className="text-center text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default function GoogleAuthButton({ disabled = false, onSubmittingChange }) {
  if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
    return <GoogleAuthFallback />;
  }

  return (
    <ConfiguredGoogleAuthButton
      disabled={disabled}
      onSubmittingChange={onSubmittingChange}
    />
  );
}
