import { CalendarIcon, XIcon } from "@heroicons/react/outline";
import { ArrowRightIcon } from "@heroicons/react/solid";
import dayjs from "dayjs";
import { NextPageContext } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

import prisma from "@lib/prisma";
import { detectBrowserTimeFormat } from "@lib/timeFormat";
import { inferSSRProps } from "@lib/types/inferSSRProps";

import { HeadSeo } from "@components/seo/head-seo";
import Button from "@components/ui/Button";

export default function MeetingNotStarted(props: inferSSRProps<typeof getServerSideProps>) {
  const router = useRouter();

  //if no booking redirectis to the 404 page
  const emptyBooking = props.booking === null;
  useEffect(() => {
    if (emptyBooking) {
      router.push("/video/no-meeting-found");
    }
  });
  if (!emptyBooking) {
    return (
      <div>
        <HeadSeo title={`Meeting Unavaialble`} description={`Meeting Unavailable`} />
        <main className="mx-auto my-24 max-w-3xl">
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 my-4 transition-opacity sm:my-0" aria-hidden="true">
                <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">
                  &#8203;
                </span>
                <div
                  className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6 sm:align-middle"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="modal-headline">
                  <div>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                      <XIcon className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="mt-3 text-center sm:mt-5">
                      <h3 className="text-lg font-medium leading-6 text-gray-900" id="modal-headline">
                        This meeting has not started yet
                      </h3>
                    </div>
                    <div className="mt-4 border-t border-b py-4">
                      <h2 className="font-cal mb-2 text-center text-lg font-medium text-gray-600">
                        {props.booking.title}
                      </h2>
                      <p className="text-center text-gray-500">
                        <CalendarIcon className="mr-1 -mt-1 inline-block h-4 w-4" />
                        {dayjs(props.booking.startTime).format(
                          detectBrowserTimeFormat + ", dddd DD MMMM YYYY"
                        )}
                      </p>
                    </div>
                    <div className="mt-3 text-center sm:mt-5">
                      <p className="text-sm text-gray-500">
                        This meeting will be accessible 60 minutes in advance.
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 text-center sm:mt-6">
                    <div className="mt-5">
                      <Button data-testid="return-home" href="/event-types" EndIcon={ArrowRightIcon}>
                        Go back home
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
  return null;
}

export async function getServerSideProps(context: NextPageContext) {
  const booking = await prisma.booking.findUnique({
    where: {
      uid: context.query.uid as string,
    },
    select: {
      uid: true,
      id: true,
      title: true,
      description: true,
      startTime: true,
      endTime: true,
      user: {
        select: {
          credentials: true,
        },
      },
      attendees: true,
      dailyRef: {
        select: {
          dailyurl: true,
          dailytoken: true,
        },
      },
      references: {
        select: {
          uid: true,
          type: true,
        },
      },
    },
  });

  if (!booking) {
    // TODO: Booking is already cancelled
    return {
      props: { booking: null },
    };
  }

  const bookingObj = Object.assign({}, booking, {
    startTime: booking.startTime.toString(),
    endTime: booking.endTime.toString(),
  });
  const session = await getSession();

  return {
    props: {
      booking: bookingObj,
      session: session,
    },
  };
}
