import type { NextApiRequest, NextApiResponse } from "next";

import { getSession } from "@lib/auth";
import { getCalendarCredentials, getConnectedCalendars } from "@lib/integrations/calendar/CalendarManager";
import notEmpty from "@lib/notEmpty";
import prisma from "@lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session?.user?.id) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      credentials: true,
      timeZone: true,
      id: true,
      selectedCalendars: true,
    },
  });

  if (!user) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }

  if (req.method === "POST") {
    await prisma.selectedCalendar.upsert({
      where: {
        userId_integration_externalId: {
          userId: user.id,
          integration: req.body.integration,
          externalId: req.body.externalId,
        },
      },
      create: {
        userId: user.id,
        integration: req.body.integration,
        externalId: req.body.externalId,
      },
      // already exists
      update: {},
    });
    res.status(200).json({ message: "Calendar Selection Saved" });
  }

  if (req.method === "DELETE") {
    await prisma.selectedCalendar.delete({
      where: {
        userId_integration_externalId: {
          userId: user.id,
          externalId: req.body.externalId,
          integration: req.body.integration,
        },
      },
    });

    res.status(200).json({ message: "Calendar Selection Saved" });
  }

  if (req.method === "GET") {
    const selectedCalendarIds = await prisma.selectedCalendar.findMany({
      where: {
        userId: user.id,
      },
      select: {
        externalId: true,
      },
    });

    // get user's credentials + their connected integrations
    const calendarCredentials = getCalendarCredentials(user.credentials, user.id);
    // get all the connected integrations' calendars (from third party)
    const connectedCalendars = await getConnectedCalendars(calendarCredentials, user.selectedCalendars);
    const calendars = connectedCalendars.flatMap((c) => c.calendars).filter(notEmpty);
    const selectableCalendars = calendars.map((cal) => {
      return { selected: selectedCalendarIds.findIndex((s) => s.externalId === cal.externalId) > -1, ...cal };
    });
    res.status(200).json(selectableCalendars);
  }
}
