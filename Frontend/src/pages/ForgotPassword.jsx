import Input from "../components/Input";
import { isEmailValid, isEmpty } from "../util/validation";
import { useInput } from "../hooks/useInput";
import "./auth.css";

export default function ForgotPassword() {
  const {
    enteredValue: emailValue,
    handleChange: handleEmailChange,
    handleBlur: handleEmailBlur,
    hasError: emailError,
  } = useInput("", (value) => isEmailValid(value) && !isEmpty(value));

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>Article Hub</h1>
        <h2>Forgot Password</h2>
        <p className="desc">Enter your email to reset your password</p>

        <form action="/forget-password" method="POST">
          <Input
            label="Email"
            id="email"
            type="email"
            name="email"
            value={emailValue}
            onChange={handleEmailChange}
            onBlur={handleEmailBlur}
            placeholder="Enter your email address"
            error={emailError && "Enter a valid email address"}
          />
          <button className="btn">Continue</button>
        </form>

        <p className="switch-page">
          Back to <a href="/sign-in">Sign In</a>
        </p>
      </div>
    </div>
  );
}
