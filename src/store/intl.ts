import { observable, action } from "mobx";
import { en_US, zh_CN } from "./language";
import { IIntl } from "./interface/intl.interface";
import common from "./common";

class Intl implements IIntl {
    @observable public currentLang: Language;

    @observable public message: {
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
    } = en_US;

    @action public initLanguage = () => {
        const lang = localStorage.getItem('language');
        if (lang) {
            common.language = lang
            this.currentLang = lang === 'zh' ? Language.CN : Language.EN;
        }
        else {
            common.language = 'cn'
            this.currentLang = Language.CN;
        }
        this.changeLanguage(this.currentLang);
    }

    @action public changeLanguage = (language: Language) => {
        if (language === Language.CN) {
            this.currentLang = Language.CN;
            this.message = zh_CN;
            // console.log(language);

            localStorage.setItem('language', 'zh');
        } else {
            this.currentLang = Language.EN;
            this.message = en_US;
            // console.log(language);
            localStorage.setItem('language', 'en');
        }
    }
}

export enum Language {
    CN = '中',
    EN = 'En'
}

export default new Intl();