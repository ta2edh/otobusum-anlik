import { getPlannedDepartures, PlannedDeparture } from "@/api/getPlannedDepartures";
import { ScrollView, StyleSheet, View } from "react-native";
import { useState } from "react";

import { UiText } from "./ui/UiText";
import { UiSegmentedButtons } from "./ui/UiSegmentedButtons";

import { DayType } from "@/types/departure";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "@/hooks/useTheme";
import { colors } from "@/constants/colors";
import { i18n } from "@/translations/i18n";

function groupDeparturesByHour(obj: PlannedDeparture[]) {
  const res: Record<string, PlannedDeparture[]> = {};

  for (let index = 0; index < obj.length; index++) {
    const element = obj[index];
    const hour = element?.["DT"].split(":").at(0);

    if (!hour || !element) continue;

    if (!res[hour]) {
      res[hour] = [element];
    } else {
      res[hour].push(element);
    }
  }

  return res;
}

interface Props {
  code: string;
}

export function LineTimetable(props: Props) {
  const { theme } = useTheme();
  // const currentRoute = useFilters(useShallow(state => state.selectedRoutes[props.code]))
  const [dayType, setDayType] = useState<DayType>(() => "I");

  const query = useQuery({
    queryKey: [`timetable-${props.code}`],
    queryFn: () => getPlannedDepartures(props.code),
  });

  // const queryStopLocations = useQuery<Awaited<ReturnType<typeof getLineBusStopLocations>>>({
  //   queryKey: [`${props.code}-stop-locations`],
  // });

  const dir = undefined
  // const dir = getRouteFromBusStopLocations(props.code, currentRoute, queryStopLocations.data || [])
  
  const filteredData =
    query.data?.filter((it) => (dir ? it.SYON === dir : true) && it.SGUNTIPI === dayType) || [];

  const groupedByHour = groupDeparturesByHour(filteredData || []);
  const hours = Object.keys(groupedByHour).sort();

  if (!query.data) {
    return <UiText>{i18n.t("loading")}</UiText>;
  }

  const title = query.data.at(0)?.HATADI;

  return (
    <View style={[styles.wrapper, { backgroundColor: theme.surfaceContainer }]}>
      <UiText style={styles.title}>{title}</UiText>

      <View style={styles.filters}>
        {/* <UiSegmentedButtons
          value={dir}
          onValueChange={setRoute}
          style={{flexGrow: 1}}
          buttons={[
            {
              value: "D",
              label: i18n.t("departure"),
            },
            {
              value: "G",
              label: i18n.t("return"),
            },
          ]}
        /> */}

        <UiSegmentedButtons
          value={dayType}
          onValueChange={setDayType}
          style={{flexGrow: 1}}
          buttons={[
            {
              value: "I",
              label: i18n.t("workday"),
            },
            {
              value: "C",
              label: i18n.t("saturday"),
            },
            {
              value: "P",
              label: i18n.t("sunday"),
            },
          ]}
        />
      </View>

      <View style={styles.container}>
        {/* Fixed column this will be */}
        <View style={styles.fixed}>
          {hours.map((hour) => (
            <UiText key={hour} style={[styles.cell, , { backgroundColor: colors.primary }]}>
              {hour}
            </UiText>
          ))}
        </View>

        <ScrollView contentContainerStyle={{ flexDirection: "column", gap: 4 }} horizontal>
          {hours.map((hour) => {
            return (
              <View key={hour} style={styles.row}>
                {groupedByHour[hour]?.map((departure) => (
                  <UiText
                    key={`${props.code}-${departure.SSERVISTIPI}-${departure.SGUZERAH}-${hour}-${departure.DT.split(":").at(-1)}`}
                    style={styles.cell}
                  >
                    {departure.DT.split(":").at(-1)}
                  </UiText>
                ))}
              </View>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    padding: 8,
    borderRadius: 8,
    gap: 8,
  },
  container: {
    flexDirection: "row",
  },
  cell: {
    width: 30,
    height: 30,
    textAlign: "center",
    textAlignVertical: "center",
    borderRadius: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  filters: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  fixed: {
    gap: 4,
  },
  row: {
    flexDirection: "row",
  },
});
