import React, { useEffect, useRef } from "react";
import useConfig from "@/hooks/useConfig";
import {
  useContact,
  useMotion,
  useBattery,
  useTemperature,
  useIlluminance,
  useHumidity,
} from "@/hooks/useSmartThings";
import AnimatedStack from "@/common/AnimatedStack";

import s from "./SensorsTab.module.css";

import { IonCard, IonCardHeader, IonCardContent } from "@ionic/react";

const SensorsTab = () => {
  const Config = useConfig();

  if (!Config || !Array.isArray(Config.sensors)) {
    return null;
  }
  const metric = Config.metric;

  const sensors = useRef({
    contact: {},
    motion: {},
    battery: {},
    temperature: {},
    illuminance: {},
    humidity: {},
  });
  const types = ["contact", "motion", "battery", "temperature", "illuminance", "humidity"];

  const clearSensors = () => {
    sensors.current.contact = {};
    sensors.current.motion = {};
    sensors.current.battery = {};
    sensors.current.temperature = {};
    sensors.current.illuminance = {};
    sensors.current.humidity = {};
  };

  useEffect(() => {
    return () => {
      console.log("CLEARING SENSORS");
      clearSensors();
    };
  }, []);

  for (const sensor of Config.sensors) {
    switch (sensor.type) {
      case "contact":
        sensors.current.contact[sensor.name] = useContact(sensor.name);
        break;
      case "motion":
        sensors.current.motion[sensor.name] = useMotion(sensor.name);
        break;
      case "battery":
        sensors.current.battery[sensor.name] = useBattery(sensor.name);
        break;
      case "temperature":
        sensors.current.temperature[sensor.name] = useTemperature(sensor.name);
        break;
      case "illuminance":
        sensors.current.illuminance[sensor.name] = useIlluminance(sensor.name);
        break;
      case "humidity":
        sensors.current.humidity[sensor.name] = useHumidity(sensor.name);
        break;
      default:
        break;
    }
  }

  const renderType = type => {
    let key = 0;

    const m = [],
      h = sensors.current[type];

    for (const s of Object.keys(h)) {
      m.push(h[s]);
    }

    return m.map(sensor => {
      if (!sensor) {
        return null;
      }
      return (
        <div key={"type" + key++}>
          {sensor.name}
          <span style={{ float: "right" }}>
            {metric && sensor.metric ? sensor.metric : sensor.formatted}
          </span>
        </div>
      );
    });
  };

  const renderCard = type => {
    return (
      <IonCard color="dark">
        <IonCardHeader color="dark">{type.toUpperCase()}</IonCardHeader>
        <IonCardContent>{renderType(type)}</IonCardContent>
      </IonCard>
    );
  };

  return <AnimatedStack className={s.gridContainer}>{types.map(renderCard)}</AnimatedStack>;
};

//
export default SensorsTab;
