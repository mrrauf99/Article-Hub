import { useInput } from "../hooks/useInput";
import {
  isEmailValid,
  isEmpty,
  isUsernameValid,
  isPasswordValid,
} from "../util/validation";
import Input from "../components/Input";
import eyeHidden from "../assets/eye-hidden.png";
import eyeShow from "../assets/eye-show.png";
import "./auth.css";

export default function SignUp() {
  const {
    enteredValue: name,
    handleChange: handleNameChange,
    handleBlur: handleNameBlur,
    hasError: nameError,
  } = useInput("", (val) => !isEmpty(val));
  const {
    enteredValue: username,
    hasError: usernameError,
    handleChange: handleUsernameChange,
    handleBlur: handleUsernameBlur,
  } = useInput("", (val) => isUsernameValid(val));

  const {
    enteredValue: email,
    handleChange: handleEmailChange,
    handleBlur: handleEmailBlur,
    hasError: emailError,
  } = useInput("", (value) => isEmailValid(value) && !isEmpty(value));

  const {
    enteredValue: password,
    handleChange: handlePasswordChange,
    handleBlur: handlePasswordBlur,
    hasError: passwordError,
  } = useInput("", (val) => isPasswordValid(val));

  const {
    enteredValue: confirmPassword,
    handleChange: handleConfirmPasswordChange,
    handleBlur: handleConfirmPasswordBlur,
    didEdit: confirmPasswordDidEdit,
  } = useInput("", () => {});

  const isPasswordMatch =
    confirmPasswordDidEdit && confirmPassword === password;

  const confirmPasswordError =
    confirmPasswordDidEdit && !isPasswordMatch && "Passwords do not match!";

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>ArticleHub</h1>
        <h2>Create Account</h2>

        <form action="/signup" method="POST">
          <Input
            type="text"
            label="Name"
            id="name"
            onChange={handleNameChange}
            onBlur={handleNameBlur}
            value={name}
            error={nameError && "Please fill out this field"}
          />
          <Input
            type="text"
            label="Username"
            id="username"
            onChange={handleUsernameChange}
            onBlur={handleUsernameBlur}
            value={username}
          />
          <p
            className="error-msg"
            style={!usernameError ? { color: "black" } : undefined}
          >
            Username may only contain alphanumeric characters or single hyphens,
            and cannot begin or end with a hyphen.
          </p>

          <Input
            label="Email"
            id="email"
            placeholder="abc@example.com"
            type="email"
            name="email"
            value={email}
            onChange={handleEmailChange}
            onBlur={handleEmailBlur}
            error={emailError && "Please enter a valid email"}
          />
          <Input
            label="Password"
            id="password"
            type="password"
            name="password"
            value={password}
            onChange={handlePasswordChange}
            onBlur={handlePasswordBlur}
            eyeShow={eyeShow}
            eyeHidden={eyeHidden}
          />

          <p
            className="error-msg"
            style={!passwordError ? { color: "black" } : undefined}
          >
            Password must be at least 8 characters long and include an uppercase
            letter, a lowercase letter, a number, and a special symbol.
          </p>

          <Input
            label="Confirm Password"
            id="confirm-password"
            type="password"
            name="confirm-password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            onBlur={handleConfirmPasswordBlur}
            error={confirmPasswordError}
            eyeShow={eyeShow}
            eyeHidden={eyeHidden}
          />

          <button type="submit" className="btn">
            Sign Up
          </button>
        </form>

        <p className="divider">or</p>

        <button className="google-btn">
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google"
          />
          Sign up with Google
        </button>

        <p className="switch-page">
          Already have an account? <a href="signin.html">Sign In</a>
        </p>
      </div>
    </div>
  );
}
