import { observable, action } from 'mobx';
import { IOutputStore, IOutputMessage } from './interface/index.interface';
class OutputboxStore implements IOutputStore {
    @observable public outputList: IOutputMessage[] = [];
    @observable public currentPage: string = "output";
    @action public addOutputMessage = (message: IOutputMessage) => {
        this.outputList.push(message);
        sessionStorage.setItem("NEORAY_OUTPUT_STORAGER", JSON.stringify(this.outputList))

        const div = document.getElementById('outputbox');
        if (div) {
            setTimeout(() => {
                // div.scrollTop = div.scrollHeight - 1;
                const drag = document.getElementById('drag');
                if (drag) {
                    drag.scrollTop = div.scrollHeight;
                }
            }, 500);
        }
    }
    @action public initOutputMessage = () => {
        let arr = [];
        const result = sessionStorage.getItem("NEORAY_OUTPUT_STORAGER");
        if (result) {
            arr = JSON.parse(result);
        }
        this.outputList = arr;
    }
    @action public clearOutputMessage = () => {
        this.outputList = [];
        sessionStorage.removeItem("NEORAY_OUTPUT_STORAGER");
    }
    @action public toPage = (label: string) => {
        this.currentPage = label;
    }
}
export default new OutputboxStore(); 