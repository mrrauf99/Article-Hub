import { redirect } from "react-router-dom";

import { isEmpty, isEmailValid } from "../util/authValidation";

export default async function verifyOtpLoader({ request }) {
  const url = new URL(request.url);
  const email = url.searchParams.get("email");

  if (isEmpty(email) || !isEmailValid(email)) {
    return redirect("/login");
  }

  return null;
}
