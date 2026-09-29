import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { IntlProvider } from "react-intl";
import { messages } from "./Content";

const LanguageContext = createContext({
  locale: "en",
  setLocale: () => {},
});

export function useLanguage() {
  return useContext(LanguageContext);
}

export const LanguageProvider = ({ children }) => {
  const [locale, setLocale] = useState(() => {
    return window.localStorage.getItem("app_locale") || "en";
  });

  useEffect(() => {
    document.documentElement.lang = locale;
    window.localStorage.setItem("app_locale", locale);
  }, [locale]);

  const contextValue = useMemo(() => ({ locale, setLocale }), [locale]);

  return React.createElement(
    LanguageContext.Provider,
    { value: contextValue },
    React.createElement(
      IntlProvider,
      {
        key: locale,
        locale,
        messages: messages[locale],
        defaultLocale: "en",
      },
      children,
    ),
  );
};
