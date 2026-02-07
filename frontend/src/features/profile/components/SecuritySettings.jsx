import { useCallback, useEffect, useMemo, useState } from "react";
import { KeyRound, ShieldCheck, QrCode, Lock, Copy } from "lucide-react";
import { useProfile } from "../hooks/useProfile";
import { userApi } from "@/features/api/userApi";
import InputField from "@/components/InputField";
import PasswordRequirements from "@/features/auth/components/PasswordRequirements";
import {
  isEmpty,
  validatePassword,
  getPasswordGenericError,
} from "@/features/auth/util/authValidation";
import { SECTION_DESCRIPTION } from "../styles/profileClasses";

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
        confirmPassword: passwordForm.confirmPassword,
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
      const { data } = await userApi.twoFactorVerify({ token: setupToken });
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
        token: disableToken,
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

  const statusBadge = useMemo(
    () => (
      <span
        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
          twoFactorEnabled
            ? "bg-emerald-50 text-emerald-700"
            : "bg-slate-100 text-slate-600"
        }`}
      >
        {twoFactorEnabled ? "Enabled" : "Disabled"}
      </span>
    ),
    [twoFactorEnabled],
  );

  const panelClassName = "rounded-xl border border-slate-200 bg-slate-50 p-5";

  return (
    <div className="border-t border-gray-200 bg-white">
      <div className="p-4 lg:p-6 space-y-6">
        <div>
          <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-1">
            Security
          </h2>
          <p className={SECTION_DESCRIPTION}>
            Manage your password and two-factor authentication.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className={panelClassName}>
            <div className="flex items-center gap-2 text-slate-900 font-semibold">
              <KeyRound className="h-5 w-5 text-indigo-600" />
              Change Password
            </div>
            <p className="text-sm text-slate-600 mt-2">
              Use a strong password to keep your account secure.
            </p>

            <form onSubmit={handleChangePassword} className="mt-4 space-y-3">
              <InputField
                label="Current Password"
                icon={Lock}
                type="password"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                onFocus={handlePasswordFocus}
                onBlur={handlePasswordBlur}
                error={passwordErrors.currentPassword}
                autoComplete="current-password"
                placeholder="Enter your current password"
              />
              <InputField
                label="New Password"
                icon={Lock}
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                onFocus={handlePasswordFocus}
                onBlur={handlePasswordBlur}
                error={passwordErrors.newPassword}
                autoComplete="new-password"
                placeholder="Enter a new password"
              />
              <InputField
                label="Confirm Password"
                icon={Lock}
                type="password"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                onFocus={handlePasswordFocus}
                onBlur={handlePasswordBlur}
                error={passwordErrors.confirmPassword}
                autoComplete="new-password"
                placeholder="Re-enter your new password"
              />

              <PasswordRequirements
                errors={passwordRuleErrors}
                passwordEntered={passwordEntered}
                confirmEntered={confirmEntered}
              />

              {passwordMessage && (
                <p
                  className={`text-sm ${
                    passwordMessage.success
                      ? "text-emerald-600"
                      : "text-rose-600"
                  }`}
                >
                  {passwordMessage.message}
                </p>
              )}

              <button
                type="submit"
                disabled={passwordSaving}
                className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition disabled:opacity-60"
              >
                {passwordSaving ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>

          <div className={panelClassName}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-900 font-semibold">
                <ShieldCheck className="h-5 w-5 text-indigo-600" />
                Two-Factor Authentication
              </div>
              {statusBadge}
            </div>

            <p className="text-sm text-slate-600 mt-2">
              Use Google Authenticator to add an extra layer of protection.
            </p>

            {!twoFactorEnabled && (
              <form onSubmit={handleSetupTwoFactor} className="mt-4 space-y-3">
                <input
                  type="password"
                  placeholder="Confirm password to continue"
                  value={setupPassword}
                  onChange={(e) => {
                    setSetupPassword(e.target.value);
                    if (setupErrors.password) {
                      setSetupErrors((prev) => ({ ...prev, password: null }));
                    }
                  }}
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                    setupErrors.password
                      ? "border-rose-500 focus:border-rose-500 focus:ring-rose-200"
                      : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-200"
                  }`}
                  autoComplete="current-password"
                />
                {setupErrors.password && (
                  <p className="text-sm text-rose-600">
                    {setupErrors.password}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={setupLoading}
                  className="w-full rounded-lg border border-indigo-600 text-indigo-700 px-4 py-2.5 text-sm font-semibold hover:bg-indigo-50 transition disabled:opacity-60"
                >
                  {setupLoading ? "Generating QR..." : "Generate QR Code"}
                </button>

                {setupMessage && !setupData && (
                  <p
                    className={`text-sm ${
                      setupMessage.success
                        ? "text-emerald-600"
                        : "text-rose-600"
                    }`}
                  >
                    {setupMessage.message}
                  </p>
                )}
              </form>
            )}

            {!twoFactorEnabled && setupData && (
              <form onSubmit={handleVerifyTwoFactor} className="mt-5 space-y-4">
                <div className="rounded-lg border border-slate-200 bg-white p-4 text-center">
                  <QrCode className="h-5 w-5 text-indigo-600 mx-auto mb-2" />
                  <img
                    src={setupData.qrCodeDataUrl}
                    alt="2FA QR Code"
                    className="mx-auto h-40 w-40"
                  />
                  <p className="text-xs text-slate-500 mt-3">
                    Or enter this key manually:
                  </p>
                  <div className="mt-2 flex items-center justify-center gap-2 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
                    <p className="font-mono text-xs text-slate-800 break-all flex-1 text-center">
                      {setupData.secret}
                    </p>
                    <button
                      type="button"
                      onClick={handleCopySecret}
                      className="flex-shrink-0 w-16 px-2 py-1.5 rounded hover:bg-slate-200 transition-colors text-xs font-semibold flex items-center justify-center"
                      title={copiedSecret ? "Copied!" : "Copy secret"}
                    >
                      {copiedSecret ? (
                        <span className="text-slate-700">Copied!</span>
                      ) : (
                        <Copy className="w-4 h-4 text-slate-600" />
                      )}
                    </button>
                  </div>
                </div>

                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Enter 6-digit code"
                  value={setupToken}
                  onChange={(e) => {
                    setSetupToken(e.target.value);
                    if (setupErrors.token) {
                      setSetupErrors((prev) => ({ ...prev, token: null }));
                    }
                  }}
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                    setupErrors.token
                      ? "border-rose-500 focus:border-rose-500 focus:ring-rose-200"
                      : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-200"
                  }`}
                />
                {setupErrors.token && (
                  <p className="text-sm text-rose-600">{setupErrors.token}</p>
                )}

                {setupMessage && (
                  <p
                    className={`text-sm ${
                      setupMessage.success
                        ? "text-emerald-600"
                        : "text-rose-600"
                    }`}
                  >
                    {setupMessage.message}
                  </p>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    disabled={verifyLoading}
                    className="flex-1 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition disabled:opacity-60"
                  >
                    {verifyLoading ? "Verifying..." : "Enable 2FA"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSetupData(null);
                      setSetupToken("");
                      setSetupMessage(null);
                    }}
                    className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {twoFactorEnabled && (
              <form
                onSubmit={handleDisableTwoFactor}
                className="mt-4 space-y-3"
              >
                <input
                  type="password"
                  placeholder="Confirm password"
                  value={disablePassword}
                  onChange={(e) => {
                    setDisablePassword(e.target.value);
                    if (disableErrors.password) {
                      setDisableErrors((prev) => ({
                        ...prev,
                        password: null,
                      }));
                    }
                  }}
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                    disableErrors.password
                      ? "border-rose-500 focus:border-rose-500 focus:ring-rose-200"
                      : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-200"
                  }`}
                  autoComplete="current-password"
                />
                {disableErrors.password && (
                  <p className="text-sm text-rose-600">
                    {disableErrors.password}
                  </p>
                )}
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Enter 6-digit code"
                  value={disableToken}
                  onChange={(e) => {
                    setDisableToken(e.target.value);
                    if (disableErrors.token) {
                      setDisableErrors((prev) => ({ ...prev, token: null }));
                    }
                  }}
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                    disableErrors.token
                      ? "border-rose-500 focus:border-rose-500 focus:ring-rose-200"
                      : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-200"
                  }`}
                />
                {disableErrors.token && (
                  <p className="text-sm text-rose-600">{disableErrors.token}</p>
                )}

                {disableMessage && (
                  <p
                    className={`text-sm ${
                      disableMessage.success
                        ? "text-emerald-600"
                        : "text-rose-600"
                    }`}
                  >
                    {disableMessage.message}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={disableLoading}
                  className="w-full rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 transition disabled:opacity-60"
                >
                  {disableLoading ? "Disabling..." : "Disable 2FA"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
