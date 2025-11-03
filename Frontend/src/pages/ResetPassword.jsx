import eyeHidden from "../assets/eye-hidden.png";
import eyeShow from "../assets/eye-show.png";
import Input from "../components/Input";
import { useInput } from "../hooks/useInput";
import { isPasswordValid } from "../util/validation";

export default function ResetPassword() {
  const {
    enteredValue: newPasswordValue,
    handleChange: handleNewPasswordChange,
    handleBlur: handleNewPasswordBlur,
    hasError: newPasswordError,
  } = useInput("", (val) => isPasswordValid(val));

  const {
    enteredValue: confirmPasswordValue,
    handleChange: handleConfirmPasswordChange,
    handleBlur: handleConfirmPasswordBlur,
    didEdit: confirmPasswordDidEdit,
  } = useInput("", () => {});

  const isPasswordMatch =
    confirmPasswordDidEdit && confirmPasswordValue === newPasswordValue;

  const confirmPasswordError =
    confirmPasswordDidEdit && !isPasswordMatch && "Passwords do not match!";

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>ArticleHub</h1>
        <h2>Set New Password</h2>
        <p className="desc">Enter your new password below</p>

        <form>
          <Input
            label="New Password"
            id="new-password"
            type="password"
            name="new-password"
            value={newPasswordValue}
            onChange={handleNewPasswordChange}
            onBlur={handleNewPasswordBlur}
            eyeShow={eyeShow}
            eyeHidden={eyeHidden}
          />
          <p
            className="error-msg"
            style={!newPasswordError ? { color: "black" } : undefined}
          >
            Password must be at least 8 characters long and include an uppercase
            letter, a lowercase letter, a number, and a special symbol.
          </p>

          <Input
            label="Confirm Password"
            id="confirm-password"
            type="password"
            name="confirm-password"
            value={confirmPasswordValue}
            onChange={handleConfirmPasswordChange}
            onBlur={handleConfirmPasswordBlur}
            error={confirmPasswordError}
            eyeShow={eyeShow}
            eyeHidden={eyeHidden}
          />

          <button className="btn" id="submitBtn">
            Set Password
          </button>
        </form>
      </div>
    </div>
  );
}
