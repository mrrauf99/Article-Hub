import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, Copy, KeyRound, Loader2, Lock, QrCode, ShieldCheck } from "lucide-react";
import { useProfile } from "../hooks/useProfile";
import { userApi } from "@/features/api/userApi";
import InputField from "@/components/InputField";
import PasswordRequirements from "@/features/auth/components/PasswordRequirements";
import {
  isEmpty,
  validatePassword,
  getPasswordGenericError,
} from "@/features/auth/util/authValidation";
import { BTN_DANGER, BTN_GHOST, BTN_PRIMARY, BTN_SECONDARY, ICON_BTN } from "@/styles/panelClasses";

export default function SecuritySettings() {
  const { user } = useProfile();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordMessage, setPasswordMessage] = useState(null);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({});

  const [setupPassword, setSetupPassword] = useState("");
  const [setupToken, setSetupToken] = useState("");
  const [setupData, setSetupData] = useState(null);
  const [setupMessage, setSetupMessage] = useState(null);
  const [setupLoading, setSetupLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [setupErrors, setSetupErrors] = useState({});

  const [disablePassword, setDisablePassword] = useState("");
  const [disableToken, setDisableToken] = useState("");
  const [disableLoading, setDisableLoading] = useState(false);
  const [disableMessage, setDisableMessage] = useState(null);
  const [disableErrors, setDisableErrors] = useState({});
  const [copiedSecret, setCopiedSecret] = useState(false);

  useEffect(() => {
    setTwoFactorEnabled(Boolean(user?.two_factor_enabled));
  }, [user?.two_factor_enabled]);

  const passwordRuleErrors = useMemo(
    () =>
      validatePassword(passwordForm.newPassword, passwordForm.confirmPassword),
    [passwordForm.newPassword, passwordForm.confirmPassword],
  );

  const passwordEntered = useMemo(
    () => passwordForm.newPassword.length > 0,
    [passwordForm.newPassword],
  );

  const confirmEntered = useMemo(
    () => passwordForm.confirmPassword.length > 0,
    [passwordForm.confirmPassword],
  );

  const handlePasswordFocus = useCallback((e) => {
    const { name } = e.target;
    setPasswordErrors((prev) =>
      prev[name] ? { ...prev, [name]: null } : prev,
    );
  }, []);

  const handlePasswordChange = useCallback((e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => {
      const next = { ...prev, [name]: value };

      if (name === "newPassword" && prev.confirmPassword) {
        setPasswordErrors((err) => {
          if (value === prev.confirmPassword) {
            return { ...err, confirmPassword: null };
          }
          return { ...err, confirmPassword: "Passwords do not match." };
        });
      }

      return next;
    });

    setPasswordErrors((prev) =>
      prev[name] ? { ...prev, [name]: null } : prev,
    );
  }, []);

  const handlePasswordBlur = useCallback(
    (e) => {
      const { name, value } = e.target;

      if (name === "currentPassword") {
        const error = isEmpty(value) ? "Please fill out this field." : null;
        setPasswordErrors((prev) => ({ ...prev, [name]: error }));
        return;
      }

      if (name === "newPassword") {
        const error = isEmpty(value)
          ? "Please fill out this field."
          : getPasswordGenericError(passwordRuleErrors, value);
        setPasswordErrors((prev) => ({ ...prev, [name]: error }));
        return;
      }

      if (name === "confirmPassword") {
        const error = isEmpty(value)
          ? "Please fill out this field."
          : value !== passwordForm.newPassword
            ? "Passwords do not match."
            : null;
        setPasswordErrors((prev) => ({ ...prev, [name]: error }));
      }
    },
    [passwordForm.newPassword, passwordRuleErrors],
  );

  const validatePasswordForm = useCallback(() => {
    const nextErrors = {};

    if (isEmpty(passwordForm.currentPassword)) {
      nextErrors.currentPassword = "Please fill out this field.";
    }

    if (isEmpty(passwordForm.newPassword)) {
      nextErrors.newPassword = "Please fill out this field.";
    } else {
      const error = getPasswordGenericError(
        passwordRuleErrors,
        passwordForm.newPassword,
      );
      if (error) nextErrors.newPassword = error;
    }

    if (isEmpty(passwordForm.confirmPassword)) {
      nextErrors.confirmPassword = "Please fill out this field.";
    } else if (passwordForm.confirmPassword !== passwordForm.newPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    setPasswordErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [
    passwordForm.currentPassword,
    passwordForm.newPassword,
    passwordForm.confirmPassword,
    passwordRuleErrors,
  ]);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (!validatePasswordForm()) {
      return;
    }

    setPasswordSaving(true);

    try {
      const { data } = await userApi.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      setPasswordMessage({ success: data.success, message: data.message });
      if (data.success) {
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setPasswordErrors({});
      }
    } catch (err) {
      setPasswordMessage({
        success: false,
        message:
          err.response?.data?.message ||
          "Unable to change password. Please try again.",
      });
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleSetupTwoFactor = async (e) => {
    e.preventDefault();
    setSetupMessage(null);
    setSetupErrors({});

    if (isEmpty(setupPassword)) {
      setSetupErrors({ password: "Please fill out this field." });
      return;
    }

    setSetupLoading(true);

    try {
      const { data } = await userApi.twoFactorSetup({
        password: setupPassword,
      });
      setSetupData({
        qrCodeDataUrl: data.qrCodeDataUrl,
        secret: data.secret,
      });
      setSetupPassword("");
      setSetupMessage({
        success: true,
        message: "Scan the QR code and enter the 6-digit code to enable 2FA.",
      });
    } catch (err) {
      setSetupMessage({
        success: false,
        message:
          err.response?.data?.message ||
          "Unable to start 2FA setup. Please try again.",
      });
    } finally {
      setSetupLoading(false);
    }
  };

  const handleVerifyTwoFactor = async (e) => {
    e.preventDefault();
    setSetupMessage(null);
    setSetupErrors((prev) => ({ ...prev, token: null }));

    if (isEmpty(setupToken)) {
      setSetupErrors((prev) => ({
        ...prev,
        token: "Please fill out this field.",
      }));
      return;
    }

    setVerifyLoading(true);

    try {
      const { data } = await userApi.twoFactorVerify({ code: setupToken });
      setSetupMessage({ success: data.success, message: data.message });
      if (data.success) {
        setTwoFactorEnabled(true);
        setSetupData(null);
        setSetupPassword("");
        setSetupToken("");
      }
    } catch (err) {
      setSetupMessage({
        success: false,
        message:
          err.response?.data?.message ||
          "Unable to verify 2FA. Please try again.",
      });
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleDisableTwoFactor = async (e) => {
    e.preventDefault();
    setDisableMessage(null);
    setDisableErrors({});

    const nextErrors = {};
    if (isEmpty(disablePassword)) {
      nextErrors.password = "Please fill out this field.";
    }
    if (isEmpty(disableToken)) {
      nextErrors.token = "Please fill out this field.";
    }
    if (Object.keys(nextErrors).length > 0) {
      setDisableErrors(nextErrors);
      return;
    }

    setDisableLoading(true);

    try {
      const { data } = await userApi.twoFactorDisable({
        password: disablePassword,
        code: disableToken,
      });
      setDisableMessage({ success: data.success, message: data.message });
      if (data.success) {
        setTwoFactorEnabled(false);
        setDisablePassword("");
        setDisableToken("");
      }
    } catch (err) {
      setDisableMessage({
        success: false,
        message:
          err.response?.data?.message ||
          "Unable to disable 2FA. Please try again.",
      });
    } finally {
      setDisableLoading(false);
    }
  };

  const handleCopySecret = useCallback(async () => {
    if (!setupData?.secret) return;
    try {
      await navigator.clipboard.writeText(setupData.secret);
      setCopiedSecret(true);
      setTimeout(() => setCopiedSecret(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = setupData.secret;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopiedSecret(true);
      setTimeout(() => setCopiedSecret(false), 2000);
    }
  }, [setupData?.secret]);

  return (
    <section
      aria-labelledby="security-title"
      className="mt-10 overflow-hidden rounded-xl border border-hairline bg-paper-raised"
    >
      <div className="border-b border-hairline px-5 py-6 sm:px-8">
        <h2 id="security-title" className="font-editorial text-2xl text-ink">
          Security
        </h2>
        <p className="mt-1 text-sm text-ink-muted">
          Your password and the second step you use to sign in.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 lg:divide-x lg:divide-hairline">
        <div className="px-5 py-8 sm:px-8">
          <div className="flex items-center gap-2.5">
            <KeyRound className="h-5 w-5 text-ink-muted" aria-hidden="true" />
            <h3 className="text-base font-semibold text-ink">Change password</h3>
          </div>
          <p className="mt-1.5 text-sm text-ink-muted">
            You'll stay signed in on this device after changing it.
          </p>

          <form onSubmit={handleChangePassword} className="mt-6 space-y-4" noValidate>
            <input
              type="text"
              name="username"
              autoComplete="username"
              value={user?.username || ""}
              readOnly
              hidden
            />
            <InputField
              label="Current password"
              icon={Lock}
              type="password"
              name="currentPassword"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              onFocus={handlePasswordFocus}
              onBlur={handlePasswordBlur}
              error={passwordErrors.currentPassword}
              autoComplete="current-password"
            />
            <InputField
              label="New password"
              icon={Lock}
              type="password"
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              onFocus={handlePasswordFocus}
              onBlur={handlePasswordBlur}
              error={passwordErrors.newPassword}
              autoComplete="new-password"
            />
            <InputField
              label="Confirm new password"
              icon={Lock}
              type="password"
              name="confirmPassword"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              onFocus={handlePasswordFocus}
              onBlur={handlePasswordBlur}
              error={passwordErrors.confirmPassword}
              autoComplete="new-password"
            />

            <PasswordRequirements
              errors={passwordRuleErrors}
              passwordEntered={passwordEntered}
              confirmEntered={confirmEntered}
            />

            <FormMessage message={passwordMessage} />

            <button type="submit" disabled={passwordSaving} className={`${BTN_PRIMARY} w-full sm:w-auto`}>
              {passwordSaving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
              {passwordSaving ? "Updating…" : "Update password"}
            </button>
          </form>
        </div>

        <div className="border-t border-hairline px-5 py-8 sm:px-8 lg:border-t-0">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <ShieldCheck
                className={`h-5 w-5 ${twoFactorEnabled ? "text-moss-700" : "text-ink-muted"}`}
                aria-hidden="true"
              />
              <h3 className="text-base font-semibold text-ink">Two-factor authentication</h3>
            </div>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
                twoFactorEnabled
                  ? "bg-moss-50 text-moss-800 ring-moss-200"
                  : "bg-review-amber-bg text-review-amber-text ring-review-amber-ring"
              }`}
            >
              {twoFactorEnabled ? "On" : "Off"}
            </span>
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
            {twoFactorEnabled
              ? "Signing in asks for a 6-digit code from your authenticator app as well as your password."
              : "Add a 6-digit code from an authenticator app, such as Google Authenticator, to every sign-in. Recommended."}
          </p>

          {!twoFactorEnabled && !setupData && (
            <form onSubmit={handleSetupTwoFactor} className="mt-6 space-y-4" noValidate>
              <input
                type="text"
                name="username"
                autoComplete="username"
                value={user?.username || ""}
                readOnly
                hidden
              />
              <InputField
                label="Confirm your password to start"
                icon={Lock}
                type="password"
                name="setupPassword"
                value={setupPassword}
                onChange={(e) => {
                  setSetupPassword(e.target.value);
                  if (setupErrors.password) {
                    setSetupErrors((prev) => ({ ...prev, password: null }));
                  }
                }}
                error={setupErrors.password}
                autoComplete="current-password"
              />

              <FormMessage message={setupMessage} />

              <button type="submit" disabled={setupLoading} className={`${BTN_SECONDARY} w-full sm:w-auto`}>
                {setupLoading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                {setupLoading ? "Generating QR code…" : "Set up two-factor"}
              </button>
            </form>
          )}

          {!twoFactorEnabled && setupData && (
            <form onSubmit={handleVerifyTwoFactor} className="mt-6 space-y-5" noValidate>
              <ol className="space-y-5 text-sm text-ink">
                <li>
                  <p className="font-medium">1. Scan this code with your authenticator app.</p>
                  <div className="mt-3 inline-flex rounded-lg border border-hairline bg-paper-raised p-3">
                    <img
                      src={setupData.qrCodeDataUrl}
                      alt="QR code for your authenticator app"
                      className="h-40 w-40"
                    />
                  </div>
                  <p className="mt-3 text-ink-muted">Can't scan it? Enter this key instead:</p>
                  <div className="mt-2 flex items-center gap-2 rounded-lg border border-hairline bg-paper px-3 py-2">
                    <code className="flex-1 break-all font-mono text-xs text-ink">
                      {setupData.secret}
                    </code>
                    <button
                      type="button"
                      onClick={handleCopySecret}
                      className={`${ICON_BTN} h-9 w-auto gap-1.5 px-3 text-xs font-semibold`}
                      aria-label={copiedSecret ? "Key copied" : "Copy key"}
                    >
                      {copiedSecret ? (
                        <>
                          <Check className="h-4 w-4 text-moss-700" aria-hidden="true" />
                          Copied
                        </>
                      ) : (
                        <Copy className="h-4 w-4" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </li>
                <li>
                  <p className="mb-3 font-medium">2. Enter the 6-digit code it shows.</p>
                  <InputField
                    label="Verification code"
                    icon={QrCode}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    name="setupToken"
                    value={setupToken}
                    onChange={(e) => {
                      setSetupToken(e.target.value);
                      if (setupErrors.token) {
                        setSetupErrors((prev) => ({ ...prev, token: null }));
                      }
                    }}
                    error={setupErrors.token}
                  />
                </li>
              </ol>

              <FormMessage message={setupMessage} />

              <div className="flex flex-col gap-2 sm:flex-row">
                <button type="submit" disabled={verifyLoading} className={BTN_PRIMARY}>
                  {verifyLoading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                  {verifyLoading ? "Verifying…" : "Turn on two-factor"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSetupData(null);
                    setSetupToken("");
                    setSetupMessage(null);
                  }}
                  className={BTN_GHOST}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {twoFactorEnabled && (
            <form onSubmit={handleDisableTwoFactor} className="mt-6 space-y-4" noValidate>
              <input
                type="text"
                name="username"
                autoComplete="username"
                value={user?.username || ""}
                readOnly
                hidden
              />
              <p className="text-sm text-ink-muted">
                To turn it off, confirm your password and a current code.
              </p>
              <InputField
                label="Password"
                icon={Lock}
                type="password"
                name="disablePassword"
                value={disablePassword}
                onChange={(e) => {
                  setDisablePassword(e.target.value);
                  if (disableErrors.password) {
                    setDisableErrors((prev) => ({ ...prev, password: null }));
                  }
                }}
                error={disableErrors.password}
                autoComplete="current-password"
              />
              <InputField
                label="Verification code"
                icon={QrCode}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                name="disableToken"
                value={disableToken}
                onChange={(e) => {
                  setDisableToken(e.target.value);
                  if (disableErrors.token) {
                    setDisableErrors((prev) => ({ ...prev, token: null }));
                  }
                }}
                error={disableErrors.token}
              />

              <FormMessage message={disableMessage} />

              <button type="submit" disabled={disableLoading} className={`${BTN_DANGER} w-full sm:w-auto`}>
                {disableLoading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                {disableLoading ? "Turning off…" : "Turn off two-factor"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function FormMessage({ message }) {
  if (!message) return null;
  return (
    <p
      role={message.success ? "status" : "alert"}
      className={`text-sm ${message.success ? "text-moss-800" : "text-rejected-red-text"}`}
    >
      {message.message}
    </p>
  );
}
