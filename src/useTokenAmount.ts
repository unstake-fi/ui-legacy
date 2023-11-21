import { BigNumber, formatFixed } from "@ethersproject/bignumber";
import { Denom, fromHumanString } from "kujira.js";
import { useState } from "react";

export const toPrecision = (num: string, precision: number): string => {
  if (Number(Number(num).toFixed(precision)) === Number(num)) {
    return num;
  } else {
    return Number(num).toFixed(precision);
  }
};

export const validInput = (str: string) => {
  const clipped = str.replaceAll(/[^\d.+-]|\.(?=.*\.)/g, "");
  return clipped;
};

export type UseTokenAmount = [
  [value: string, setValue: (i: string) => void],
  [value: BigNumber, setValue: (i: BigNumber) => void]
];

export const useTokenAmount = (denom: Denom | number): UseTokenAmount => {
  const decimals = typeof denom === "number" ? denom : denom.decimals;
  const [value, setValue_] = useState("");
  const setValue = (v: string) => {
    const x = toPrecision(validInput(v), decimals);
    setValue_(x);
  };
  const intValue = fromHumanString(value, decimals);
  const setIntValue = (v: BigNumber) => {
    setValue_(formatFixed(v, decimals));
  };

  return [
    [value, setValue],
    [intValue, setIntValue],
  ];
};
