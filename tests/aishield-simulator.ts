import {
  type CircuitContext,
  QueryContext,
  sampleContractAddress,
  createConstructorContext,
  CostModel,
} from "@midnight-ntwrk/compact-runtime";
import {
  Contract,
  type Ledger,
  ledger,
  AccessTier,
} from "../managed/contract/index.js";
import { type AIShieldPrivateState, witnesses } from "../witnesses.js";

export class AIShieldSimulator {
  readonly contract: Contract<AIShieldPrivateState>;
  circuitContext: CircuitContext<AIShieldPrivateState>;

  constructor(secretKey: Uint8Array, identitySecret: Uint8Array, apiTokenSecret: Uint8Array) {
    this.contract = new Contract<AIShieldPrivateState>(witnesses);
    const {
      currentPrivateState,
      currentContractState,
      currentZswapLocalState,
    } = this.contract.initialState(
      createConstructorContext(
        {
          localSecretKey: secretKey,
          rawIdentitySecret: identitySecret,
          rawApiTokenSecret: apiTokenSecret,
        },
        "0".repeat(64)
      )
    );
    this.circuitContext = {
      currentPrivateState,
      currentZswapLocalState,
      costModel: CostModel.initialCostModel(),
      currentQueryContext: new QueryContext(
        currentContractState.data,
        sampleContractAddress()
      ),
    };
  }

  public setUser(secretKey: Uint8Array, identitySecret: Uint8Array, apiTokenSecret: Uint8Array) {
    this.circuitContext.currentPrivateState = {
      localSecretKey: secretKey,
      rawIdentitySecret: identitySecret,
      rawApiTokenSecret: apiTokenSecret,
    };
  }

  public getLedger(): Ledger {
    return ledger(this.circuitContext.currentQueryContext.state);
  }

  public getPrivateState(): AIShieldPrivateState {
    return this.circuitContext.currentPrivateState;
  }

  public verifyAndGrantAccess(requestedTier: AccessTier): Uint8Array {
    const result = this.contract.impureCircuits.verifyAndGrantAccess(
      this.circuitContext,
      requestedTier
    );
    this.circuitContext = result.context;
    return result.result;
  }

  public revokeAccess(): void {
    const result = this.contract.impureCircuits.revokeAccess(this.circuitContext);
    this.circuitContext = result.context;
  }

  public checkAccessTier(targetTier: AccessTier): boolean {
    const result = this.contract.impureCircuits.checkAccessTier(
      this.circuitContext,
      targetTier
    );
    this.circuitContext = result.context;
    return result.result;
  }

  public deriveUserHash(sk: Uint8Array, credSecret: Uint8Array): Uint8Array {
    return this.contract.circuits.deriveUserHash(
      this.circuitContext,
      sk,
      credSecret
    ).result;
  }
}
