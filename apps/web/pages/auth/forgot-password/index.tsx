import debounce from "lodash/debounce";
import { GetServerSidePropsContext } from "next";
import { getCsrfToken } from "next-auth/react";
import Link from "next/link";
import React, { SyntheticEvent } from "react";

import { getSession } from "@lib/auth";
import { useLocale } from "@lib/hooks/useLocale";

import { EmailField } from "@components/form/fields";
import AuthContainer from "@components/ui/AuthContainer";
import Button from "@components/ui/Button";

export default function ForgotPassword({ csrfToken }: { csrfToken: string }) {
  const { t, i18n } = useLocale();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<{ message: string } | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [email, setEmail] = React.useState("");

  const handleChange = (e: SyntheticEvent) => {
    const target = e.target as typeof e.target & { value: string };
    setEmail(target.value);
  };

  const submitForgotPasswordRequest = async ({ email }: { email: string }) => {
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email: email, language: i18n.language }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json);
      } else if ("resetLink" in json) {
        window.location = json.resetLink;
      } else {
        setSuccess(true);
      }

      return json;
    } catch (reason) {
      setError({ message: t("unexpected_error_try_again") });
    } finally {
      setLoading(false);
    }
  };

  const debouncedHandleSubmitPasswordRequest = debounce(submitForgotPasswordRequest, 250);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (!email) {
      return;
    }

    if (loading) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    await debouncedHandleSubmitPasswordRequest({ email });
  };

  const Success = () => {
    return (
      <div className="space-y-6">
        <p className="text-center">{t("check_email_reset_password")}</p>
        {error && <p className="text-center text-red-600">{error.message}</p>}
      </div>
    );
  };

  return (
    <AuthContainer
      title={t("forgot_password")}
      description={t("request_password_reset")}
      heading={t("forgot_password")}
      footerText={
        <>
          {t("already_have_an_account")}{" "}
          <Link href="/auth/login">
            <a className="font-medium text-neutral-900">{t("login_instead")}</a>
          </Link>
        </>
      }>
      {success && <Success />}
      {!success && (
        <>
          <div className="space-y-6">
            <p className="mb-4 text-sm text-gray-500">{t("reset_instructions")}</p>
            {error && <p className="text-red-600">{error.message}</p>}
          </div>
          <form className="space-y-6" onSubmit={handleSubmit} action="#">
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} hidden />
            <EmailField
              onChange={handleChange}
              id="email"
              name="email"
              label={t("email_address")}
              placeholder="john.doe@example.com"
              required
            />
            <div className="space-y-2">
              <Button
                className="w-full justify-center"
                type="submit"
                disabled={loading}
                aria-label={t("request_password_reset")}
                loading={loading}>
                {t("request_password_reset")}
              </Button>
            </div>
          </form>
        </>
      )}
    </AuthContainer>
  );
}

ForgotPassword.getInitialProps = async (context: GetServerSidePropsContext) => {
  const { req, res } = context;
  const session = await getSession({ req });

  if (session) {
    res.writeHead(302, { Location: "/" });
    res.end();
    return;
  }

  return {
    csrfToken: await getCsrfToken(context),
  };
};
