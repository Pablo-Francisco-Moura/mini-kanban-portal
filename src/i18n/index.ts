import { initReactI18next } from "react-i18next";
import i18n from "i18next";
import ptBR from "./ptBR.json";
import enUS from "./enUS.json";

const resources = {
  pt: { translation: ptBR },
  en: { translation: enUS },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "pt",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
