import { trackEvent } from "./analytics.js";

export const PRODUCT_URL = "https://digitalnicjenik.nepar.hr";

/** Aktualna maloprodajna cijena (marketing / landings). */
export const LAUNCH_PRICE_EUR = 39.9;
/** Planirana cijena nakon uvodnog razdoblja — nije sidrena niti druga MPC u /cjenik. */
export const FUTURE_LIST_PRICE_EUR = 49.9;
export const SETUP_FIRST_YEAR_EUR = 89.9;
export const INTRO_SUBSCRIBER_CAP = 100;

export function formatPublisherEur(amount) {
  return `${amount.toFixed(2).replace(".", ",")} €`;
}

export const marketingPriceHr = {
  launchLine: `Uvodna cijena: ${formatPublisherEur(LAUNCH_PRICE_EUR)}/god za prvih ${INTRO_SUBSCRIBER_CAP} aktiviranih pretplata.`,
  afterLine: `Nakon toga ${formatPublisherEur(FUTURE_LIST_PRICE_EUR)}/god.`,
  shortLaunch: `Launch cijena: ${formatPublisherEur(LAUNCH_PRICE_EUR)}/god za prvih ${INTRO_SUBSCRIBER_CAP} pretplata.`,
};

export const marketingPriceEn = {
  launchLine: `Introductory price: ${formatPublisherEur(LAUNCH_PRICE_EUR)}/year for the first ${INTRO_SUBSCRIBER_CAP} activated subscriptions.`,
  afterLine: `After that, ${formatPublisherEur(FUTURE_LIST_PRICE_EUR)}/year.`,
  shortLaunch: `Launch price: ${formatPublisherEur(LAUNCH_PRICE_EUR)}/year for the first ${INTRO_SUBSCRIBER_CAP} subscriptions.`,
};

export function goToProduct(event, eventName) {
  event.preventDefault();
  trackEvent(eventName).finally(() => {
    window.setTimeout(() => {
      window.location.href = PRODUCT_URL;
    }, 300);
  });
}
