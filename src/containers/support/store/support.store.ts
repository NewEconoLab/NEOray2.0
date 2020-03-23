import { observable, action } from 'mobx';
import { ISupportStore } from './interface/support.interface';
import { hasClaimGas, claimgas } from '@/store/api/common.api';
import common from '@/store/common';
class SupportStore implements ISupportStore {
    @observable public claimState = "3010";
    @action public initClaimState = async () => {
        const result = await hasClaimGas(common.address);
        if (result) {
            this.claimState = result[ 0 ][ 'code' ];
        }
    }
    @action public claimGas = async () => {
        const result = await claimgas(common.address, 10);
        if (result ? result[ 0 ] : false) {
            this.claimState = result[ 0 ][ "code" ];
        }
        return this.claimState;
    }
}
export default new SupportStore(); 