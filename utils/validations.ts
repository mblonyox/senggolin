import { invalid, Validity } from "validasaur";

export const isValidUrl = (value: unknown): Validity => {
  try {
    if (!new URL(value as string)) return invalid("isValidUrl");
  } catch (_error) {
    return invalid("isValidUrl");
  }
};

export const onlyAlphaNumeric = (value: unknown): Validity => {
  if (!/^[A-Za-z0-9\-]*$/.test(value as string)) {
    return invalid("onlyAlphaNumeric");
  }
};
