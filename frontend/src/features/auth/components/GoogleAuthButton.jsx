import { useCallback, useEffect, useRef, useState } from "react";
import { useGoogleOAuth } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../api/authApi";

let hasAttemptedOneTap = false;

function GoogleButtonPlaceholder() {
  return (
    <button
      type="button"
      className="flex w-full items-center justify-center rounded-full border border-hairline-strong bg-paper-raised px-4 py-3 font-ui text-[0.9375rem] font-medium text-ink"
      disabled
    >
      Continue with Google
    </button>
  );
}

function GoogleAuthFallback() {
  return (
    <div className="mt-3 flex w-full flex-col items-center justify-center gap-2">
      <GoogleButtonPlaceholder />
      <p className="text-center text-sm text-red-600" role="alert">
        Google sign-in is not configured for this site.
      </p>
    </div>
  );
}

function ConfiguredGoogleAuthButton({ disabled, onAuthStateChange }) {
  const { clientId, scriptLoadedSuccessfully } = useGoogleOAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [authAttempt, setAuthAttempt] = useState(null);
  const activeAttemptRef = useRef(null);
  const disabledRef = useRef(disabled);
  const mountedRef = useRef(true);
  const buttonContainerRef = useRef(null);
  const requestAbortControllerRef = useRef(null);
  const windowBlurredRef = useRef(false);
  disabledRef.current = disabled;

  const updateAuthAttempt = useCallback(
    (attempt) => {
      activeAttemptRef.current = attempt;
      if (!mountedRef.current) return;
      setAuthAttempt(attempt);
      onAuthStateChange?.(attempt);
    },
    [onAuthStateChange],
  );

  const handleButtonClick = useCallback(() => {
    if (disabledRef.current || activeAttemptRef.current) return;

    windowBlurredRef.current = false;
    setError("");
    updateAuthAttempt({ phase: "waiting", source: "button" });
  }, [updateAuthAttempt]);

  const handleCredential = useCallback(
    async (response) => {
      if (!mountedRef.current) return;

      const activeAttempt = activeAttemptRef.current;
      const selectBy = response?.select_by || "";
      const isButtonCredential =
        selectBy.startsWith("btn") || selectBy.startsWith("fedcm_button");
      const source = isButtonCredential || (!selectBy && activeAttempt?.source === "button")
        ? "button"
        : "one_tap";

      if (activeAttempt?.phase === "signing_in") return;
      if (activeAttempt?.source === "button" && source !== "button") return;
      if (!response?.credential) {
        setError("Google sign-in could not be verified. Please try again.");
        updateAuthAttempt(null);
        return;
      }

      const attempt = { phase: "signing_in", source };
      updateAuthAttempt(attempt);
      setError("");

      const controller = new AbortController();
      requestAbortControllerRef.current = controller;

      try {
        const result = await authApi.googleLogin(
          { credential: response.credential },
          { signal: controller.signal },
        );
        if (mountedRef.current) {
          navigate(result.data.redirectTo, { replace: true });
        }
      } catch (requestError) {
        if (requestError.code !== "ERR_CANCELED" && mountedRef.current) {
          setError(
            requestError.response?.data?.message ||
              "Google sign-in failed. Please try again.",
          );
        }
      } finally {
        if (requestAbortControllerRef.current === controller) {
          requestAbortControllerRef.current = null;
        }
        if (mountedRef.current && activeAttemptRef.current === attempt) {
          updateAuthAttempt(null);
        }
      }
    },
    [navigate, updateAuthAttempt],
  );

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      requestAbortControllerRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    const handleWindowBlur = () => {
      windowBlurredRef.current = true;
    };
    const handleWindowFocus = () => {
      if (!windowBlurredRef.current) return;
      windowBlurredRef.current = false;

      if (activeAttemptRef.current?.phase === "waiting") {
        updateAuthAttempt(null);
      }
    };

    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("focus", handleWindowFocus);
    return () => {
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("focus", handleWindowFocus);
    };
  }, [updateAuthAttempt]);

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

  const isDisabled = disabled || authAttempt !== null;

  if (!scriptLoadedSuccessfully) {
    return (
      <div className="mt-3 flex w-full flex-col items-center justify-center gap-2">
        <GoogleButtonPlaceholder />
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
          aria-hidden={isDisabled}
          className={`flex w-full justify-center rounded-full transition-shadow duration-150 hover:shadow-sm motion-reduce:transition-none ${isDisabled ? "invisible pointer-events-none" : ""}`}
        />
        {isDisabled && (
          <div className="absolute inset-0">
            <GoogleButtonPlaceholder />
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

export default function GoogleAuthButton({
  disabled = false,
  onAuthStateChange,
}) {
  if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
    return <GoogleAuthFallback />;
  }

  return (
    <ConfiguredGoogleAuthButton
      disabled={disabled}
      onAuthStateChange={onAuthStateChange}
    />
  );
}
