import React, { useReducer } from "react";
import { IonIcon, IonLabel } from "@ionic/react";

import ActionButton from "@/common/ActionButton";
import denonReducer from "@/hooks/reducers/denonReducer";

const format = n => {
  if (n === null) {
    return 0;
  }
  if (typeof n === "number") {
    if (n > 99) {
      return n / 10;
    }
    return n;
  }
  if (n.length === 3) {
    return Number(n) / 10;
  }
  return Number(n);
};

const Button = ({ avr, action, children, variant }) => {
  const [, dispatch] = useReducer(denonReducer, { device: avr ? avr.device : null });

  if (action === "mute") {
    action = avr.mute ? "unmute" : "mute";
  }

  return (
    <div>
      <ActionButton variant={variant} dispatch={dispatch} action={action}>
        {children}
      </ActionButton>
    </div>
  );
};

const AudioControl = ({ avr }) =>
  avr ? (
    <>
      <div>
        <div>Master Volume</div>
        <Button avr={avr} action="mute" variant={avr.mute ? "primary" : "tertiary"}>
          <IonIcon name="volume-off" />
        </Button>
        <Button avr={avr} action="masterup">
          <IonIcon name="volume-high" />
        </Button>
        <IonLabel>{format(avr.masterVolume)}</IonLabel>
        <Button avr={avr} action="masterdown">
          <IonIcon name="volume-low" />
        </Button>
      </div>

      <div>
        <div>Center Channel</div>
        <Button avr={avr} action="centerup">
          <IonIcon name="volume-high" />
        </Button>
        <IonLabel>{format(avr.centerVolume)}</IonLabel>
        <Button avr={avr} action="centerdown">
          <IonIcon name="volume-low" />
        </Button>
      </div>

      <div>
        <div>{avr.surroundMode}</div>
        <Button avr={avr} action="auto">
          "Auto"
        </Button>
        <Button avr={avr} action="movie">
          "Movie"
        </Button>
        <Button avr={avr} action="music">
          "Music"
        </Button>
      </div>
    </>
  ) : null;

//
export default AudioControl;
