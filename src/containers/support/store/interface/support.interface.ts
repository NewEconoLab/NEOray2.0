export interface ISupportStore {
    claimState: string;
    initClaimState: () => void;
    claimGas: () => Promise<any>;
}