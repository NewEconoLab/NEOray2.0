import { Language } from "../intl";

export interface IIntl {
    currentLang: Language;
    message: {
        button: { [ key: number ]: string };
        code: { [ key: number ]: string };
        files: { [ key: number ]: string };
        deploy: { [ key: number ]: string };
        invoke: { [ key: number ]: string };
        debug: { [ key: number ]: string };
        about: { [ key: number ]: string };
        output: { [ key: number ]: string };
        toast: { [ key: number ]: string };
        url: {
            invoke: string;
            debug: string;
        }
    };
    initLanguage: () => void;
    changeLanguage: (language: Language) => void;
}