import React, { useState, useEffect, useReducer } from "react";

import { IonContent, IonGrid, IonRow, IonCol } from "@ionic/react";
import s from "./TheaterTab.module.css";

import AudioControl from "./AudioControl";
import ActivitiesListGroup from "./ActivitiesListGroup";
import DevicesListGroup from "./DevicesListGroup";
import TheaterDevice from "./TheaterDevice";
import ButtonList from "./ButtonList";

import macrosReducer from "@/hooks/reducers/macrosReducer";

import useLGTV from "@/hooks/useLGTV";
import useBravia from "@/hooks/useBravia";
import useDenon from "@/hooks/useDenon";

const TheaterTab = ({ theater }) => {
  const [currentDevice, setCurrentDevice] = useState("None");
  const [currentActivity, setCurrentActivity] = useState("All Off");
  const [, dispatchActivity] = useReducer(macrosReducer);

  //  const avr = useRef(null);
  let tv = null,
    avr = null;
  //  const tv = useRef(null);

  // devices
  const devices = theater.devices || [],
    deviceMap = {};

  for (const device of devices) {
    deviceMap[device.type] = device;
    switch (device.type) {
      case "denon":
        avr = useDenon({ ...device, debug: "TheaterTab" });
        break;
      case "lgtv":
        tv = useLGTV({ ...device, debug: "TheaterTab" });
        break;
      case "bravia":
        tv = useBravia({ ...device, debug: "TheaterTab" });
        break;
      default:
        break;
    }
  }
  const handleDeviceClick = device => {
    setCurrentDevice(device.name);
  };

  // activities
  const activities = theater.activities || [],
    activitiesMap = {};

  for (const activity of activities) {
    activitiesMap[activity.name] = activities;
  }

  const handleActivityClick = activity => {
    setCurrentActivity(activity.name);
    setCurrentDevice(activity.defaultDevice);
    dispatchActivity({ macro: activity.macro });
  };

  useEffect(() => {
    if (!tv.power) {
      setCurrentActivity("All Off");
      setCurrentDevice(null);
      tv.input = "Off";
    } else {
      for (const activity of activities) {
        const inputs = activity.inputs || {};
        if (inputs.tv === tv.input && inputs.avr === avr.input) {
          if (currentActivity === "All Off") {
            setCurrentDevice(null);
            setCurrentActivity("All Off");
          }

          if (currentDevice != null) {
            setCurrentDevice(currentDevice);
            setCurrentActivity(activity.name);
          }
        }
      }
    }
  }, [
    tv.power,
    avr.power,
    currentActivity,
    currentDevice,
    tv.input,
    avr.input,
    activities,
    tv,
    avr,
  ]);

  return (
    <IonContent>
      <IonGrid class={s.grid}>
        <IonRow>
          <IonCol sizeMd="auto" size={12} class={s.column}>
            <ActivitiesListGroup
              activities={activities}
              currentActivity={currentActivity}
              onClick={handleActivityClick}
            />
            <DevicesListGroup
              devices={devices}
              currentDevice={currentDevice}
              tvInput={tv.input}
              avrInput={avr.input}
              onClick={handleDeviceClick}
            />
            <ButtonList theater={theater} />
          </IonCol>
          <IonCol size="auto" class={s.column}>
            <AudioControl avr={currentActivity !== "All Off" ? avr : false} />
          </IonCol>
          <IonCol class={s.column}>
            <TheaterDevice currentDevice={currentDevice} avr={avr} tv={tv} deviceMap={deviceMap} />
          </IonCol>
          <IonCol size="auto" class={s.column} />
        </IonRow>
      </IonGrid>
    </IonContent>
  );
};

export default TheaterTab;
