import { initReactI18next } from "react-i18next";
import i18n from "i18next";
import ptBR from "./ptBR.json";
import enUS from "./enUS.json";

const resources = {
  pt: { translation: ptBR },
  en: { translation: enUS },
};

const browserLang =
  typeof window !== "undefined" && window.navigator.language
    ? window.navigator.language
    : "pt";
const lng = browserLang.startsWith("en") ? "en" : "pt";

i18n.use(initReactI18next).init({
  resources,
  lng,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
