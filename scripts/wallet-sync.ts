/**
 * PrivAI Finance — bounded Preprod wallet synchronization helper.
 *
 * Why this exists:
 * `syncWallet` from `@midnight-ntwrk/testkit-js@4.1.1` waits for ALL THREE
 * wallet state machines (shielded, unshielded, dust) to report
 * `progress.isStrictlyComplete()` (applied lag of exactly 0 while connected).
 * On Preprod, a fresh wallet derived from a new seed never reports a complete
 * shielded/dust sync (`shielded=false, dust=false`), so `syncWallet` repeats
 * its "Wallet synced state emission (synced=false)" log forever and the
 * configured timeout never fires while emissions keep arriving — the process
 * hangs before any balance is printed.
 *
 * For a funding probe / fee payment the UNSHIELDED state (tNIGHT) plus the
 * DUST state (fees) are what matter. This helper:
 *   - waits until unshielded + dust are fully synced (strictly complete) and
 *     the shielded wallet is connected and caught up within a bounded lag;
 *   - enforces a hard WALL-CLOCK timeout (unlike `Rx.timeout({ each })`, which
 *     resets on every emission and can therefore wait indefinitely);
 *   - unsubscribes from the wallet state observable as soon as the first
 *     synced state arrives, so the subscription cannot keep the process alive.
 *
 * It never touches, prints, or persists the wallet seed or any secret key
 * material: it only reads public sync progress, balances, and addresses.
 */
import { firstValueFrom, filter, tap, take } from 'rxjs';
import type { WalletFacade } from '@midnight-ntwrk/wallet-sdk';

type FacadeState = ReturnType<WalletFacade['state']> extends import('rxjs').Observable<infer T>
  ? T
  : never;

export interface SyncedWalletProgress {
  readonly shieldedComplete: boolean;
  readonly unshieldedComplete: boolean;
  readonly dustComplete: boolean;
}

/** Extract the three public sync-completion flags from a facade state. */
export const readSyncProgress = (state: FacadeState): SyncedWalletProgress => ({
  shieldedComplete: state.shielded.state.progress.isStrictlyComplete(),
  unshieldedComplete: state.unshielded.progress.isStrictlyComplete(),
  dustComplete: state.dust.state.progress.isStrictlyComplete(),
});

/**
 * Deployability requires a fully-synced unshielded (tNIGHT) state — the token
 * that pays for transactions on Midnight. The shielded wallet is NOT gated:
 * a fresh seed must replay every Preprod shielded event since genesis
 * (~1.5M+ events, which exhausted Node's default 2 GB heap during testing),
 * while this project's funding/deploy flow uses only unshielded tNIGHT. The
 * dust wallet is optional: when `ignoreDust` is set (funding probe), it is
 * skipped entirely; deployment gates on it so fee generation is ready.
 */
const isSyncedEnough = (state: FacadeState, maxGap: bigint, ignoreShielded: boolean, ignoreDust: boolean): boolean =>
  state.unshielded.progress.isStrictlyComplete() &&
  (ignoreDust || state.dust.state.progress.isStrictlyComplete()) &&
  (ignoreShielded ||
    (state.shielded.state.progress.isConnected &&
      state.shielded.state.progress.isCompleteWithin(maxGap)));

/**
 * Waits for the wallet to reach a deployable sync state.
 *
 * @param wallet         The running WalletFacade (already started).
 * @param timeoutMs      Hard wall-clock timeout; always enforced.
 * @param throttleLogMs  Minimum interval between progress log lines.
 * @param maxGap         Max tolerated shielded sync lag (default 50 events).
 * @param ignoreShielded When true, do not wait on shielded sync at all.
 * @param ignoreDust     When true, do not wait on dust sync at all
 *                       (used by check-funds, which only reports balances).
 */
export const syncWalletBounded = (
  wallet: WalletFacade,
  timeoutMs: number,
  throttleLogMs = 2_000,
  maxGap = 50n,
  ignoreShielded = false,
  ignoreDust = false,
): Promise<FacadeState> => {
  let lastLog = 0;

  const waitForSyncedState = firstValueFrom(
    wallet.state().pipe(
      tap((state) => {
        const now = Date.now();
        if (now - lastLog >= throttleLogMs) {
          lastLog = now;
          const progress = readSyncProgress(state);
          const lag =
            state.shielded.state.progress.highestRelevantWalletIndex -
            state.shielded.state.progress.appliedIndex;
          console.log(
            `  sync: shielded=${progress.shieldedComplete} (lag ${lag}) ` +
              `unshielded=${progress.unshieldedComplete} dust=${progress.dustComplete}`,
          );
        }
      }),
      filter((state) => isSyncedEnough(state, maxGap, ignoreShielded, ignoreDust)),
      // Completing after the first synced state unsubscribes from the wallet
      // observable so the stream cannot keep the process alive afterwards.
      take(1),
    ),
  );

  const hardTimeout = new Promise<never>((_resolve, reject) => {
    const timer = setTimeout(() => {
      reject(
        new Error(
          `Wallet sync timed out after ${Math.round(timeoutMs / 1000)}s of wall-clock time. ` +
            'The Preprod indexer/node may be unreachable or overloaded — retry later.',
        ),
      );
    }, timeoutMs);
    // Do not let this timer itself hold the event loop open.
    if (typeof timer.unref === 'function') timer.unref();
  });

  return Promise.race([waitForSyncedState, hardTimeout]);
};
