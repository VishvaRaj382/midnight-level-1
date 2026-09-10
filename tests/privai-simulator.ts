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
  VerificationStatus,
} from "../managed/contract/index.js";
import { type PrivAIPrivateState, witnesses } from "../witnesses.js";

export class PrivAISimulator {
  readonly contract: Contract<PrivAIPrivateState>;
  circuitContext: CircuitContext<PrivAIPrivateState>;

  constructor(secretKey: Uint8Array, monthlyIncome: bigint, financialSalt: Uint8Array) {
    this.contract = new Contract<PrivAIPrivateState>(witnesses);
    const {
      currentPrivateState,
      currentContractState,
      currentZswapLocalState,
    } = this.contract.initialState(
      createConstructorContext(
        {
          localSecretKey: secretKey,
          monthlyIncome: monthlyIncome,
          financialSalt: financialSalt,
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

  public setUser(secretKey: Uint8Array, monthlyIncome: bigint, financialSalt: Uint8Array) {
    this.circuitContext.currentPrivateState = {
      localSecretKey: secretKey,
      monthlyIncome: monthlyIncome,
      financialSalt: financialSalt,
    };
  }

  public getLedger(): Ledger {
    return ledger(this.circuitContext.currentQueryContext.state);
  }

  public getPrivateState(): PrivAIPrivateState {
    return this.circuitContext.currentPrivateState;
  }

  public proveIncomeEligibility(minIncome: bigint): boolean {
    const result = this.contract.impureCircuits.proveIncomeEligibility(
      this.circuitContext,
      minIncome
    );
    this.circuitContext = result.context;
    return result.result;
  }

  public setRequirementThreshold(minIncome: bigint, metric: Uint8Array): void {
    const result = this.contract.impureCircuits.setRequirementThreshold(
      this.circuitContext,
      minIncome,
      metric
    );
    this.circuitContext = result.context;
  }

  public queryVerificationResult(): VerificationStatus {
    const result = this.contract.impureCircuits.queryVerificationResult(
      this.circuitContext
    );
    this.circuitContext = result.context;
    return result.result;
  }

  public deriveUserCommitment(sk: Uint8Array, salt: Uint8Array): Uint8Array {
    return this.contract.circuits.deriveUserCommitment(
      this.circuitContext,
      sk,
      salt
    ).result;
  }
}
