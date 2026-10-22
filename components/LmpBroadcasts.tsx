"use client";

import {
  useEffect,
  useState,
} from "react";

type LmpChannel = {
  name: string;
  url?: string;
};

type Props = {
  awayTeamId: number;
  homeTeamId: number;
  awayTeamName: string;
  homeTeamName: string;
  gameDate?: string;
};

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .toLowerCase()
    .trim();
}

function mexicoToday() {
  const parts =
    new Intl.DateTimeFormat(
      "en-US",
      {
        timeZone:
          "America/Mexico_City",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }
    ).formatToParts(new Date());

  const year =
    parts.find(
      (part) =>
        part.type === "year"
    )?.value ?? "";

  const month =
    parts.find(
      (part) =>
        part.type === "month"
    )?.value ?? "";

  const day =
    parts.find(
      (part) =>
        part.type === "day"
    )?.value ?? "";

  return `${year}-${month}-${day}`;
}

export default function LmpBroadcasts({
  awayTeamId,
  homeTeamId,
  awayTeamName,
  homeTeamName,
  gameDate,
}: Props) {
  const [channels, setChannels] =
    useState<LmpChannel[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const date =
          gameDate?.slice(0, 10) ||
          mexicoToday();

        const response =
          await fetch(
            `https://api.lmp.mx/3.00/scoreboard?date=${encodeURIComponent(
              date
            )}&days_next=1&days_prev=1`,
            {
              cache: "no-store",
            }
          );

        if (!response.ok) {
          return;
        }

        const data =
          await response.json();

        const games: any[] = [];

        const collectGames = (
          value: any
        ) => {
          if (!value) {
            return;
          }

          if (Array.isArray(value)) {
            value.forEach(
              collectGames
            );

            return;
          }

          if (
            typeof value === "object"
          ) {
            const hasTeams =
              value.awayTeamID !==
                undefined ||
              value.awayTeamId !==
                undefined ||
              value.homeTeamID !==
                undefined ||
              value.homeTeamId !==
                undefined;

            if (hasTeams) {
              games.push(value);
            }

            Object.values(
              value
            ).forEach(collectGames);
          }
        };

        collectGames(data);

        const normalizedAway =
          normalize(awayTeamName);

        const normalizedHome =
          normalize(homeTeamName);

        const lmpGame =
          games.find(
            (item) =>
              Number(
                item?.awayTeamID ??
                  item?.awayTeamId
              ) === awayTeamId &&
              Number(
                item?.homeTeamID ??
                  item?.homeTeamId
              ) === homeTeamId
          ) ??
          games.find((item) => {
            const away =
              normalize(
                String(
                  item?.awayTeam ??
                    item?.awayTeamShort ??
                    ""
                )
              );

            const home =
              normalize(
                String(
                  item?.homeTeam ??
                    item?.homeTeamShort ??
                    ""
                )
              );

            return (
              (
                away.includes(
                  normalizedAway
                ) ||
                normalizedAway.includes(
                  away
                )
              ) &&
              (
                home.includes(
                  normalizedHome
                ) ||
                normalizedHome.includes(
                  home
                )
              )
            );
          });

        if (!lmpGame) {
          return;
        }

        const officialChannels =
          Array.isArray(
            lmpGame.channels
          )
            ? lmpGame.channels
            : [];

        const mapped =
          officialChannels
            .filter(
              (channel: any) =>
                channel?.title
            )
            .map(
              (
                channel: any
              ): LmpChannel => ({
                name: String(
                  channel.title
                ),
                url:
                  channel.url ||
                  undefined,
              })
            );

        if (!cancelled) {
          setChannels(mapped);
        }
      } catch {
        if (!cancelled) {
          setChannels([]);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [
    awayTeamId,
    homeTeamId,
    awayTeamName,
    homeTeamName,
    gameDate,
  ]);

  if (channels.length === 0) {
    return null;
  }

  return (
    <>
      {channels.map(
        (channel, index) =>
          channel.url ? (
            <a
              key={`${channel.name}-${index}`}
              href={channel.url}
              target="_blank"
              rel="noopener noreferrer"
              className="watchButton"
            >
              Ver en {channel.name}
            </a>
          ) : (
            <span
              key={`${channel.name}-${index}`}
              className="watchButtonDisabled"
            >
              {channel.name}
            </span>
          )
      )}
    </>
  );
}
