import { useInput } from "../hooks/useInput";
import { hasMinLength, isEmailValid, isEmpty } from "../util/validation";
import Input from "../components/Input";
import "./auth.css";
import eyeHidden from "../assets/eye-hidden.png";
import eyeShow from "../assets/eye-show.png";

export default function Login() {
  const {
    enteredValue: emailValue,
    handleChange: handleEmailChange,
    handleBlur: handleEmailBlur,
    hasError: emailError,
  } = useInput("", (value) => isEmailValid(value) && !isEmpty(value));

  const {
    enteredValue: passwordValue,
    handleChange: handlePasswordChange,
    handleBlur: handlePasswordBlur,
    hasError: passwordError,
  } = useInput("", (val) => !isEmpty(val) && hasMinLength(val, 8));

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>ArticleHub</h1>
        <h2>Welcome Back</h2>

        <Input
          label="Email"
          id="email"
          placeholder="abc@example.com"
          type="email"
          name="email"
          value={emailValue}
          onChange={handleEmailChange}
          onBlur={handleEmailBlur}
          error={emailError && "Please enter a valid email."}
        />
        <Input
          label="Password"
          id="password"
          type="password"
          name="password"
          value={passwordValue}
          onChange={handlePasswordChange}
          onBlur={handlePasswordBlur}
          error={passwordError && "Password must be at least 8 characters"}
          eyeShow={eyeShow}
          eyeHidden={eyeHidden}
        />

        <a href="/forget-password" className="forgot-link">
          Forgot password?
        </a>

        <p className="divider">or</p>

        <a className="google-btn" href="/auth/google">
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google"
          />
          Sign in with Google
        </a>

        <p className="switch-page">
          Don’t have an account? <a href="/sign-up">Sign Up</a>
        </p>
      </div>
    </div>
  );
}
