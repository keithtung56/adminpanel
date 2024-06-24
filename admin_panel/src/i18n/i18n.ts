import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { cn, en } from "../lang";


const resources = {
    en: {
        translation: en
    },
    cn: {
        translation: cn
    }
}
i18next.use(initReactI18next).init({
    resources,
    lng: 'en',
    interpolation: {
        escapeValue: false
    }
})

export default i18next