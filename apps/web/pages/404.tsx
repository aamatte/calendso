import { BookOpenIcon, CheckIcon, DocumentTextIcon } from "@heroicons/react/outline";
import { ChevronRightIcon } from "@heroicons/react/solid";
import { GetStaticPropsContext } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import { useLocale } from "@lib/hooks/useLocale";

import { HeadSeo } from "@components/seo/head-seo";

import { ssgInit } from "@server/lib/ssg";

export default function Custom404() {
  const { t } = useLocale();

  const router = useRouter();
  const username = router.asPath.replace("%20", "-");

  const links = [
    {
      title: t("documentation"),
      description: t("documentation_description"),
      icon: DocumentTextIcon,
      href: "https://docs.cal.com",
    },
    {
      title: t("blog"),
      description: t("blog_description"),
      icon: BookOpenIcon,
      href: "https://cal.com/blog",
    },
  ];

  const [url, setUrl] = useState("https://cal.com/signup?username=");
  useEffect(() => {
    setUrl(`https://cal.com/signup?username=${username.replace("/", "")}`);
  }, [router.query]);

  const isSubpage = router.asPath.includes("/", 2);
  const isSignup = router.asPath.includes("/signup");
  const isCalcom = process.env.NEXT_PUBLIC_BASE_URL === "https://app.cal.com";

  return (
    <>
      <HeadSeo
        title={isSignup ? t("signup_requires") : t("404_page_not_found")}
        description={t("404_page_not_found")}
        nextSeoProps={{
          nofollow: true,
          noindex: true,
        }}
      />
      <div className="min-h-screen bg-white px-4">
        <main className="mx-auto max-w-xl pt-16 pb-6 sm:pt-24">
          {isSignup && process.env.NEXT_PUBLIC_BASE_URL !== "https://app.cal.com" ? (
            <div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-black">
                  {t("missing_license")}
                </p>
                <h1 className="font-cal mt-2 text-3xl font-extrabold text-gray-900">
                  {t("signup_requires")}
                </h1>
                <p className="mt-4">{t("signup_requires_description")}</p>
              </div>
              <div className="mt-12">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                  {t("next_steps")}
                </h2>
                <ul role="list" className="mt-4">
                  <li className="border-2 border-green-500 px-4 py-2">
                    <a
                      href="https://cal.com/pricing?infra"
                      className="relative flex items-start space-x-4 py-6 rtl:space-x-reverse">
                      <div className="flex-shrink-0">
                        <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-50">
                          <CheckIcon className="h-6 w-6 text-green-500" aria-hidden="true" />
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-medium text-gray-900">
                          <span className="rounded-sm focus-within:ring-2 focus-within:ring-gray-500 focus-within:ring-offset-2">
                            <span className="focus:outline-none">
                              <span className="absolute inset-0" aria-hidden="true" />
                              {t("acquire_commercial_license")}
                            </span>
                          </span>
                        </h3>
                        <p className="text-base text-gray-500">{t("the_infrastructure_plan")}</p>
                      </div>
                      <div className="flex-shrink-0 self-center">
                        <ChevronRightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                    </a>
                  </li>
                </ul>

                <ul role="list" className="divide-y divide-gray-200 border-gray-200">
                  <li className="px-4 py-2">
                    <Link href="https://docs.cal.com/self-hosting/install#setting-up-your-first-user">
                      <a className="relative flex items-start space-x-4 py-6 rtl:space-x-reverse">
                        <div className="flex-shrink-0">
                          <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-50">
                            <DocumentTextIcon className="h-6 w-6 text-gray-700" aria-hidden="true" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-base font-medium text-gray-900">
                            <span className="rounded-sm focus-within:ring-2 focus-within:ring-gray-500 focus-within:ring-offset-2">
                              <span className="absolute inset-0" aria-hidden="true" />
                              {t("prisma_studio_tip")}
                            </span>
                          </h3>
                          <p className="text-base text-gray-500">{t("prisma_studio_tip_description")}</p>
                        </div>
                        <div className="flex-shrink-0 self-center">
                          <ChevronRightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                      </a>
                    </Link>
                  </li>
                  <li className="px-4 py-2">
                    <a
                      href="https://cal.com/slack"
                      className="relative flex items-start space-x-4 py-6 rtl:space-x-reverse">
                      <div className="flex-shrink-0">
                        <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-50">
                          <svg
                            viewBox="0 0 2447.6 2452.5"
                            className="h-6 w-6"
                            xmlns="http://www.w3.org/2000/svg">
                            <g clipRule="evenodd" fillRule="evenodd">
                              <path
                                d="m897.4 0c-135.3.1-244.8 109.9-244.7 245.2-.1 135.3 109.5 245.1 244.8 245.2h244.8v-245.1c.1-135.3-109.5-245.1-244.9-245.3.1 0 .1 0 0 0m0 654h-652.6c-135.3.1-244.9 109.9-244.8 245.2-.2 135.3 109.4 245.1 244.7 245.3h652.7c135.3-.1 244.9-109.9 244.8-245.2.1-135.4-109.5-245.2-244.8-245.3z"
                                fill="rgba(55, 65, 81)"></path>
                              <path
                                d="m2447.6 899.2c.1-135.3-109.5-245.1-244.8-245.2-135.3.1-244.9 109.9-244.8 245.2v245.3h244.8c135.3-.1 244.9-109.9 244.8-245.3zm-652.7 0v-654c.1-135.2-109.4-245-244.7-245.2-135.3.1-244.9 109.9-244.8 245.2v654c-.2 135.3 109.4 245.1 244.7 245.3 135.3-.1 244.9-109.9 244.8-245.3z"
                                fill="rgba(55, 65, 81)"></path>
                              <path
                                d="m1550.1 2452.5c135.3-.1 244.9-109.9 244.8-245.2.1-135.3-109.5-245.1-244.8-245.2h-244.8v245.2c-.1 135.2 109.5 245 244.8 245.2zm0-654.1h652.7c135.3-.1 244.9-109.9 244.8-245.2.2-135.3-109.4-245.1-244.7-245.3h-652.7c-135.3.1-244.9 109.9-244.8 245.2-.1 135.4 109.4 245.2 244.7 245.3z"
                                fill="rgba(55, 65, 81)"></path>
                              <path
                                d="m0 1553.2c-.1 135.3 109.5 245.1 244.8 245.2 135.3-.1 244.9-109.9 244.8-245.2v-245.2h-244.8c-135.3.1-244.9 109.9-244.8 245.2zm652.7 0v654c-.2 135.3 109.4 245.1 244.7 245.3 135.3-.1 244.9-109.9 244.8-245.2v-653.9c.2-135.3-109.4-245.1-244.7-245.3-135.4 0-244.9 109.8-244.8 245.1 0 0 0 .1 0 0"
                                fill="rgba(55, 65, 81)"></path>
                            </g>
                          </svg>
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-medium text-gray-900">
                          <span className="rounded-sm focus-within:ring-2 focus-within:ring-gray-500 focus-within:ring-offset-2">
                            <span className="absolute inset-0" aria-hidden="true" />
                            Slack
                          </span>
                        </h3>
                        <p className="text-base text-gray-500">{t("join_our_community")}</p>
                      </div>
                      <div className="flex-shrink-0 self-center">
                        <ChevronRightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                    </a>
                  </li>
                </ul>
                <div className="mt-8">
                  <Link href="https://cal.com/enterprise">
                    <a className="text-base font-medium text-black hover:text-gray-500">
                      {t("contact_sales")}
                      <span aria-hidden="true"> &rarr;</span>
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center">
                <p className="text-sm font-semibold uppercase tracking-wide text-black">{t("error_404")}</p>
                <h1 className="font-cal mt-2 text-4xl font-extrabold text-gray-900 sm:text-5xl">
                  {t("page_doesnt_exist")}
                </h1>
                {isSubpage ? (
                  <span className="mt-2 inline-block text-lg ">
                    {t("check_spelling_mistakes_or_go_back")}
                  </span>
                ) : isCalcom ? (
                  <Link href={url}>
                    <a className="mt-2 inline-block text-lg">
                      {t("the_username")} <strong className="text-blue-500">cal.com{username}</strong>{" "}
                      {t("is_still_available")} <span className="text-blue-500">{t("register_now")}</span>.
                    </a>
                  </Link>
                ) : (
                  <span className="mt-2 inline-block text-lg">
                    {t("the_username")}{" "}
                    <strong className="text-lgtext-green-500 mt-2 inline-block">{username}</strong>{" "}
                    {t("is_still_available")}
                  </span>
                )}
              </div>
              <div className="mt-12">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                  {t("popular_pages")}
                </h2>
                {!isSubpage && isCalcom && (
                  <ul role="list" className="mt-4">
                    <li className="border-2 border-green-500 px-4 py-2">
                      <Link href={url}>
                        <a className="relative flex items-start space-x-4 py-6 rtl:space-x-reverse">
                          <div className="flex-shrink-0">
                            <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-50">
                              <CheckIcon className="h-6 w-6 text-green-500" aria-hidden="true" />
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-base font-medium text-gray-900">
                              <span className="rounded-sm focus-within:ring-2 focus-within:ring-gray-500 focus-within:ring-offset-2">
                                <span className="focus:outline-none">
                                  <span className="absolute inset-0" aria-hidden="true" />
                                  {t("register")} <strong className="text-green-500">{username}</strong>
                                </span>
                              </span>
                            </h3>
                            <p className="text-base text-gray-500">
                              {t("claim_username_and_schedule_events")}
                            </p>
                          </div>
                          <div className="flex-shrink-0 self-center">
                            <ChevronRightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                          </div>
                        </a>
                      </Link>
                    </li>
                  </ul>
                )}

                <ul role="list" className="mt-4 divide-y divide-gray-200 border-gray-200">
                  {links.map((link, linkIdx) => (
                    <li key={linkIdx} className="px-4 py-2">
                      <Link href={link.href}>
                        <a className="relative flex items-start space-x-4 py-6 rtl:space-x-reverse">
                          <div className="flex-shrink-0">
                            <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-50">
                              <link.icon className="h-6 w-6 text-gray-700" aria-hidden="true" />
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-base font-medium text-gray-900">
                              <span className="rounded-sm focus-within:ring-2 focus-within:ring-gray-500 focus-within:ring-offset-2">
                                <span className="absolute inset-0" aria-hidden="true" />
                                {link.title}
                              </span>
                            </h3>
                            <p className="text-base text-gray-500">{link.description}</p>
                          </div>
                          <div className="flex-shrink-0 self-center">
                            <ChevronRightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                          </div>
                        </a>
                      </Link>
                    </li>
                  ))}
                  <li className="px-4 py-2">
                    <a
                      href="https://cal.com/slack"
                      className="relative flex items-start space-x-4 py-6 rtl:space-x-reverse">
                      <div className="flex-shrink-0">
                        <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-50">
                          <svg
                            viewBox="0 0 2447.6 2452.5"
                            className="h-6 w-6"
                            xmlns="http://www.w3.org/2000/svg">
                            <g clipRule="evenodd" fillRule="evenodd">
                              <path
                                d="m897.4 0c-135.3.1-244.8 109.9-244.7 245.2-.1 135.3 109.5 245.1 244.8 245.2h244.8v-245.1c.1-135.3-109.5-245.1-244.9-245.3.1 0 .1 0 0 0m0 654h-652.6c-135.3.1-244.9 109.9-244.8 245.2-.2 135.3 109.4 245.1 244.7 245.3h652.7c135.3-.1 244.9-109.9 244.8-245.2.1-135.4-109.5-245.2-244.8-245.3z"
                                fill="rgba(55, 65, 81)"></path>
                              <path
                                d="m2447.6 899.2c.1-135.3-109.5-245.1-244.8-245.2-135.3.1-244.9 109.9-244.8 245.2v245.3h244.8c135.3-.1 244.9-109.9 244.8-245.3zm-652.7 0v-654c.1-135.2-109.4-245-244.7-245.2-135.3.1-244.9 109.9-244.8 245.2v654c-.2 135.3 109.4 245.1 244.7 245.3 135.3-.1 244.9-109.9 244.8-245.3z"
                                fill="rgba(55, 65, 81)"></path>
                              <path
                                d="m1550.1 2452.5c135.3-.1 244.9-109.9 244.8-245.2.1-135.3-109.5-245.1-244.8-245.2h-244.8v245.2c-.1 135.2 109.5 245 244.8 245.2zm0-654.1h652.7c135.3-.1 244.9-109.9 244.8-245.2.2-135.3-109.4-245.1-244.7-245.3h-652.7c-135.3.1-244.9 109.9-244.8 245.2-.1 135.4 109.4 245.2 244.7 245.3z"
                                fill="rgba(55, 65, 81)"></path>
                              <path
                                d="m0 1553.2c-.1 135.3 109.5 245.1 244.8 245.2 135.3-.1 244.9-109.9 244.8-245.2v-245.2h-244.8c-135.3.1-244.9 109.9-244.8 245.2zm652.7 0v654c-.2 135.3 109.4 245.1 244.7 245.3 135.3-.1 244.9-109.9 244.8-245.2v-653.9c.2-135.3-109.4-245.1-244.7-245.3-135.4 0-244.9 109.8-244.8 245.1 0 0 0 .1 0 0"
                                fill="rgba(55, 65, 81)"></path>
                            </g>
                          </svg>
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-medium text-gray-900">
                          <span className="rounded-sm focus-within:ring-2 focus-within:ring-gray-500 focus-within:ring-offset-2">
                            <span className="absolute inset-0" aria-hidden="true" />
                            Slack
                          </span>
                        </h3>
                        <p className="text-base text-gray-500">{t("join_our_community")}</p>
                      </div>
                      <div className="flex-shrink-0 self-center">
                        <ChevronRightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                    </a>
                  </li>
                </ul>
                <div className="mt-8">
                  <Link href="/">
                    <a className="text-base font-medium text-black hover:text-gray-500">
                      {t("or_go_back_home")}
                      <span aria-hidden="true"> &rarr;</span>
                    </a>
                  </Link>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
}

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const ssr = await ssgInit(context);

  return {
    props: {
      trpcState: ssr.dehydrate(),
    },
  };
};
