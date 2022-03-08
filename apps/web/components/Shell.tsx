import { SelectorIcon } from "@heroicons/react/outline";
import {
  CalendarIcon,
  ArrowLeftIcon,
  ClockIcon,
  CogIcon,
  ExternalLinkIcon,
  LinkIcon,
  LogoutIcon,
  PuzzleIcon,
  MoonIcon,
  MapIcon,
} from "@heroicons/react/solid";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { ReactNode, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

import LicenseBanner from "@ee/components/LicenseBanner";
import TrialBanner from "@ee/components/TrialBanner";

import classNames from "@lib/classNames";
import { NEXT_PUBLIC_BASE_URL } from "@lib/config/constants";
import { shouldShowOnboarding } from "@lib/getting-started";
import { useLocale } from "@lib/hooks/useLocale";
import { collectPageParameters, telemetryEventTypes, useTelemetry } from "@lib/telemetry";
import { trpc } from "@lib/trpc";

import CustomBranding from "@components/CustomBranding";
import Loader from "@components/Loader";
import { HeadSeo } from "@components/seo/head-seo";
import Dropdown, {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/ui/Dropdown";

import { useViewerI18n } from "./I18nLanguageHandler";
import Logo from "./Logo";
import Button from "./ui/Button";

export function useMeQuery() {
  const meQuery = trpc.useQuery(["viewer.me"], {
    retry(failureCount) {
      return failureCount > 3;
    },
  });

  return meQuery;
}

function useRedirectToLoginIfUnauthenticated() {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const router = useRouter();

  useEffect(() => {
    if (!loading && !session) {
      router.replace({
        pathname: "/auth/login",
        query: {
          callbackUrl: `${NEXT_PUBLIC_BASE_URL}/${location.pathname}${location.search}`,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, session]);

  return {
    loading: loading && !session,
  };
}

function useRedirectToOnboardingIfNeeded() {
  const router = useRouter();
  const query = useMeQuery();
  const user = query.data;

  const [isRedirectingToOnboarding, setRedirecting] = useState(false);

  useEffect(() => {
    user && setRedirecting(shouldShowOnboarding(user));
  }, [router, user]);

  useEffect(() => {
    if (isRedirectingToOnboarding) {
      router.replace({
        pathname: "/getting-started",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRedirectingToOnboarding]);
  return {
    isRedirectingToOnboarding,
  };
}

export function ShellSubHeading(props: {
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div className={classNames("mb-3 block justify-between sm:flex", props.className)}>
      <div>
        <h2 className="flex items-center content-center space-x-2 text-base font-bold leading-6 text-gray-900 rtl:space-x-reverse">
          {props.title}
        </h2>
        {props.subtitle && <p className="text-sm text-neutral-500 ltr:mr-4">{props.subtitle}</p>}
      </div>
      {props.actions && <div className="flex-shrink-0">{props.actions}</div>}
    </div>
  );
}

export default function Shell(props: {
  centered?: boolean;
  title?: string;
  heading: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  CTA?: ReactNode;
  HeadingLeftIcon?: ReactNode;
  backPath?: string; // renders back button to specified path
  // use when content needs to expand with flex
  flexChildrenContainer?: boolean;
}) {
  const { t } = useLocale();
  const router = useRouter();
  const { loading } = useRedirectToLoginIfUnauthenticated();
  const { isRedirectingToOnboarding } = useRedirectToOnboardingIfNeeded();

  const telemetry = useTelemetry();

  const navigation = [
    {
      name: t("event_types_page_title"),
      href: "/event-types",
      icon: LinkIcon,
      current: router.asPath.startsWith("/event-types"),
    },
    {
      name: t("bookings"),
      href: "/bookings/upcoming",
      icon: CalendarIcon,
      current: router.asPath.startsWith("/bookings"),
    },
    {
      name: t("availability"),
      href: "/availability",
      icon: ClockIcon,
      current: router.asPath.startsWith("/availability"),
    },
    {
      name: t("integrations"),
      href: "/integrations",
      icon: PuzzleIcon,
      current: router.asPath.startsWith("/integrations"),
    },
    {
      name: t("settings"),
      href: "/settings/profile",
      icon: CogIcon,
      current: router.asPath.startsWith("/settings"),
    },
  ];

  useEffect(() => {
    telemetry.withJitsu((jitsu) => {
      return jitsu.track(telemetryEventTypes.pageView, collectPageParameters(router.asPath));
    });
  }, [telemetry, router.asPath]);

  const pageTitle = typeof props.heading === "string" ? props.heading : props.title;

  const query = useMeQuery();
  const user = query.data;

  const i18n = useViewerI18n();

  if (i18n.status === "loading" || isRedirectingToOnboarding || loading) {
    // show spinner whilst i18n is loading to avoid language flicker
    return (
      <div className="absolute z-50 flex items-center w-full h-screen bg-gray-50">
        <Loader />
      </div>
    );
  }
  return (
    <>
      <CustomBranding lightVal={user?.brandColor} darkVal={user?.darkBrandColor} />
      <HeadSeo
        title={pageTitle ?? "PV"}
        description={props.subtitle ? props.subtitle?.toString() : ""}
        nextSeoProps={{
          nofollow: true,
          noindex: true,
        }}
      />
      <div>
        <Toaster position="bottom-right" />
      </div>

      <div className="flex h-screen overflow-hidden bg-gray-100" data-testid="dashboard-shell">
        <div className="hidden md:flex lg:flex-shrink-0">
          <div className="flex flex-col w-14 lg:w-56">
            <div className="flex flex-col flex-1 h-0 bg-white border-r border-gray-200">
              <div className="flex flex-col flex-1 pt-3 pb-4 overflow-y-auto lg:pt-5">
                <Link href="/event-types">
                  <a className="px-4 md:hidden lg:inline">
                    <Logo small />
                  </a>
                </Link>
                {/* logo icon for tablet */}
                <Link href="/event-types">
                  <a className="md:inline lg:hidden">
                    <Logo small icon />
                  </a>
                </Link>
                <nav className="flex-1 px-2 mt-2 space-y-1 bg-white lg:mt-5">
                  {navigation.map((item) => (
                    <Link key={item.name} href={item.href}>
                      <a
                        className={classNames(
                          item.current
                            ? "bg-neutral-100 text-neutral-900"
                            : "text-neutral-500 hover:bg-gray-50 hover:text-neutral-900",
                          "group flex items-center rounded-sm px-2 py-2 text-sm font-medium"
                        )}>
                        <item.icon
                          className={classNames(
                            item.current
                              ? "text-neutral-500"
                              : "text-neutral-400 group-hover:text-neutral-500",
                            "h-5 w-5 flex-shrink-0 ltr:mr-3 rtl:ml-3"
                          )}
                          aria-hidden="true"
                        />
                        <span className="hidden lg:inline">{item.name}</span>
                      </a>
                    </Link>
                  ))}
                </nav>
              </div>
              <TrialBanner />
              <div className="p-2 pt-2 pr-2 m-2 rounded-sm hover:bg-gray-100">
                <span className="hidden lg:inline">
                  <UserDropdown />
                </span>
                <span className="hidden md:inline lg:hidden">
                  <UserDropdown small />
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col flex-1 w-0 overflow-hidden">
          <main
            className={classNames(
              "relative z-0 max-w-[1700px] flex-1 overflow-y-auto focus:outline-none",
              props.flexChildrenContainer && "flex flex-col"
            )}>
            {/* show top navigation for md and smaller (tablet and phones) */}
            <nav className="flex items-center justify-between p-4 bg-white border-b border-gray-200 md:hidden">
              <Link href="/event-types">
                <a>
                  <Logo />
                </a>
              </Link>
              <div className="flex items-center self-center gap-3">
                <button className="p-2 text-gray-400 bg-white rounded-full hover:bg-gray-50 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2">
                  <span className="sr-only">{t("view_notifications")}</span>
                  <Link href="/settings/profile">
                    <a>
                      <CogIcon className="w-6 h-6" aria-hidden="true" />
                    </a>
                  </Link>
                </button>
                <UserDropdown small />
              </div>
            </nav>
            <div
              className={classNames(
                props.centered && "mx-auto md:max-w-5xl",
                props.flexChildrenContainer && "flex flex-1 flex-col",
                "py-8"
              )}>
              {!!props.backPath && (
                <div className="mx-3 mb-8 sm:mx-8">
                  <Button
                    onClick={() => router.push(props.backPath as string)}
                    StartIcon={ArrowLeftIcon}
                    color="secondary">
                    Back
                  </Button>
                </div>
              )}
              <div className="block min-h-[80px] justify-between px-4 sm:flex sm:px-6 md:px-8">
                {props.HeadingLeftIcon && <div className="ltr:mr-4">{props.HeadingLeftIcon}</div>}
                <div className="w-full mb-8">
                  <h1 className="mb-1 text-xl font-bold tracking-wide text-gray-900 font-cal">
                    {props.heading}
                  </h1>
                  <p className="text-sm text-neutral-500 ltr:mr-4 rtl:ml-4">{props.subtitle}</p>
                </div>
                <div className="flex-shrink-0 mb-4">{props.CTA}</div>
              </div>
              <div
                className={classNames(
                  "px-4 sm:px-6 md:px-8",
                  props.flexChildrenContainer && "flex flex-1 flex-col"
                )}>
                {props.children}
              </div>
              {/* show bottom navigation for md and smaller (tablet and phones) */}
              <nav className="fixed bottom-0 z-30 flex w-full bg-white shadow bottom-nav md:hidden">
                {/* note(PeerRich): using flatMap instead of map to remove settings from bottom nav */}
                {navigation.flatMap((item, itemIdx) =>
                  item.href === "/settings/profile" ? (
                    []
                  ) : (
                    <Link key={item.name} href={item.href}>
                      <a
                        className={classNames(
                          item.current ? "text-gray-900" : "text-neutral-400 hover:text-gray-700",
                          itemIdx === 0 ? "rounded-l-lg" : "",
                          itemIdx === navigation.length - 1 ? "rounded-r-lg" : "",
                          "group relative min-w-0 flex-1 overflow-hidden bg-white py-2 px-2 text-center text-xs font-medium hover:bg-gray-50 focus:z-10 sm:text-sm"
                        )}
                        aria-current={item.current ? "page" : undefined}>
                        <item.icon
                          className={classNames(
                            item.current ? "text-gray-900" : "text-gray-400 group-hover:text-gray-500",
                            "mx-auto mb-1 block h-5 w-5 flex-shrink-0 text-center"
                          )}
                          aria-hidden="true"
                        />
                        <span className="truncate">{item.name}</span>
                      </a>
                    </Link>
                  )
                )}
              </nav>
              {/* add padding to content for mobile navigation*/}
              <div className="block pt-12 md:hidden" />
            </div>
            <LicenseBanner />
          </main>
        </div>
      </div>
    </>
  );
}

function UserDropdown({ small }: { small?: boolean }) {
  const { t } = useLocale();
  const query = useMeQuery();
  const user = query.data;
  const mutation = trpc.useMutation("viewer.away", {
    onSettled() {
      utils.invalidateQueries("viewer.me");
    },
  });
  const utils = trpc.useContext();

  return (
    <Dropdown>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center w-full appearance-none cursor-pointer group">
          <span
            className={classNames(
              small ? "h-8 w-8" : "h-10 w-10",
              "relative flex-shrink-0 rounded-full bg-gray-300  ltr:mr-3 rtl:ml-3"
            )}>
            <img
              className="rounded-full"
              src={
                (process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_BASE_URL) +
                "/" +
                user?.username +
                "/avatar.png"
              }
              alt={user?.username || "Nameless User"}
            />
            {!user?.away && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            )}
            {user?.away && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-yellow-500 border-2 border-white rounded-full"></div>
            )}
          </span>
          {!small && (
            <span className="flex items-center flex-grow truncate">
              <span className="flex-grow text-sm truncate">
                <span className="block font-medium text-gray-900 truncate">
                  {user?.username || "Nameless User"}
                </span>
                <span className="block font-normal truncate text-neutral-500">
                  {user?.username ? `cal.pv.dev/${user.username}` : "No public page"}
                </span>
              </span>
              <SelectorIcon
                className="flex-shrink-0 w-5 h-5 text-gray-400 group-hover:text-gray-500"
                aria-hidden="true"
              />
            </span>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <a
            onClick={() => {
              mutation.mutate({ away: !user?.away });
              utils.invalidateQueries("viewer.me");
            }}
            className="flex px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 hover:text-gray-900">
            <MoonIcon
              className={classNames(
                user?.away
                  ? "text-purple-500 group-hover:text-purple-700"
                  : "text-gray-500 group-hover:text-gray-700",
                "h-5 w-5 flex-shrink-0 ltr:mr-3 rtl:ml-3"
              )}
              aria-hidden="true"
            />
            {user?.away ? t("set_as_free") : t("set_as_away")}
          </a>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="h-px bg-gray-200" />
        {user?.username && (
          <DropdownMenuItem>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`${process.env.NEXT_PUBLIC_APP_URL}/${user.username}`}
              className="flex items-center px-4 py-2 text-sm text-gray-700">
              <ExternalLinkIcon className="w-5 h-5 text-gray-500 ltr:mr-3 rtl:ml-3" /> {t("view_public_page")}
            </a>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator className="h-px bg-gray-200" />
        <DropdownMenuItem>
          <a
            onClick={() => signOut({ callbackUrl: "/auth/logout" })}
            className="flex px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 hover:text-gray-900">
            <LogoutIcon
              className={classNames(
                "text-gray-500 group-hover:text-gray-700",
                "h-5 w-5 flex-shrink-0 ltr:mr-3 rtl:ml-3"
              )}
              aria-hidden="true"
            />
            {t("sign_out")}
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </Dropdown>
  );
}
