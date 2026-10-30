import { trackEvent } from "./analytics.js";
import { getCjenikCijena } from "./cjenikData.js";

export const PRODUCT_URL = "https://digitalnicjenik.nepar.hr";

/** Aktualne godišnje cijene moraju biti usklađene s digitalnicjenik.nepar.hr. */
export const LINK_PRICE_EUR = getCjenikCijena("cjenik-web-link").price;
export const PUBLISHER_PRICE_EUR = getCjenikCijena("cjenik-publisher").price;
export const SETUP_FIRST_YEAR_EUR = getCjenikCijena("cjenik-web-publisher").price;
export const INSTALLATION_EUR = getCjenikCijena("cjenik-ugradnja").price;

/** Backward-compatible aliases for older imports. */
export const LAUNCH_PRICE_EUR = PUBLISHER_PRICE_EUR;
export const FUTURE_LIST_PRICE_EUR = PUBLISHER_PRICE_EUR;
export const INTRO_SUBSCRIBER_CAP = 0;

export function formatPublisherEur(amount) {
  return `${amount.toFixed(2).replace(".", ",")} €`;
}

export const marketingPriceHr = {
  launchLine: `Publisher: ${formatPublisherEur(PUBLISHER_PRICE_EUR)}/god.`,
  afterLine: `Web Link: ${formatPublisherEur(LINK_PRICE_EUR)}/god · Web + Publisher: ${formatPublisherEur(SETUP_FIRST_YEAR_EUR)}/god · ugradnja: ${formatPublisherEur(INSTALLATION_EUR)} jednokratno.`,
  shortLaunch: `Publisher ${formatPublisherEur(PUBLISHER_PRICE_EUR)}/god.`,
};

export const marketingPriceEn = {
  launchLine: `Publisher: ${formatPublisherEur(PUBLISHER_PRICE_EUR)}/year.`,
  afterLine: `Web Link: ${formatPublisherEur(LINK_PRICE_EUR)}/year · Web + Publisher: ${formatPublisherEur(SETUP_FIRST_YEAR_EUR)}/year · installation: ${formatPublisherEur(INSTALLATION_EUR)} one-off.`,
  shortLaunch: `Publisher ${formatPublisherEur(PUBLISHER_PRICE_EUR)}/year.`,
};

export function goToProduct(event, eventName) {
  event.preventDefault();
  trackEvent(eventName).finally(() => {
    window.setTimeout(() => {
      window.location.href = PRODUCT_URL;
    }, 300);
  });
}
