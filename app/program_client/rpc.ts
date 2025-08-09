import {
  AnchorProvider,
  BN,
  IdlAccounts,
  Program,
  web3,
} from "@coral-xyz/anchor";
import { MethodsBuilder } from "@coral-xyz/anchor/dist/cjs/program/namespace/methods";
import { TreasuryManagement } from "../../target/types/treasury_management";
import idl from "../../target/idl/treasury_management.json";
import * as pda from "./pda";

import { CslSplToken } from "../../target/types/csl_spl_token";
import idlCslSplToken from "../../target/idl/csl_spl_token.json";



let _program: Program<TreasuryManagement>;
let _programCslSplToken: Program<CslSplToken>;


export const initializeClient = (
    programId: web3.PublicKey,
    anchorProvider = AnchorProvider.env(),
) => {
    _program = new Program<TreasuryManagement>(
        idl as never,
        programId,
        anchorProvider,
    );

    _programCslSplToken = new Program<CslSplToken>(
        idlCslSplToken as never,
        new web3.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
        anchorProvider,
    );

};

export type InitializeTreasuryArgs = {
  authority: web3.PublicKey;
  name: string;
  signers: web3.PublicKey[];
  threshold: number;
  adminLimit: bigint;
  treasurerLimit: bigint;
  contributorLimit: bigint;
  resetPeriod: bigint;
  autoStake: boolean;
  stakeTargetPercentage: number;
};

/**
 * ### Returns a {@link MethodsBuilder}
 * Accounts:
 * 0. `[signer]` authority: {@link PublicKey} 
 * 1. `[writable]` treasury: {@link Treasury} 
 * 2. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 * - name: {@link string} 
 * - signers: {@link PublicKey[]} 
 * - threshold: {@link number} 
 * - admin_limit: {@link BigInt} 
 * - treasurer_limit: {@link BigInt} 
 * - contributor_limit: {@link BigInt} 
 * - reset_period: {@link BigInt} 
 * - auto_stake: {@link boolean} 
 * - stake_target_percentage: {@link number} 
 */
export const initializeTreasuryBuilder = (
	args: InitializeTreasuryArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): MethodsBuilder<TreasuryManagement, never> => {
    const [treasuryPubkey] = pda.deriveTreasuryPDA({
        name: args.name,
    }, _program.programId);

  return _program
    .methods
    .initializeTreasury(
      args.name,
      args.signers,
      args.threshold,
      new BN(args.adminLimit.toString()),
      new BN(args.treasurerLimit.toString()),
      new BN(args.contributorLimit.toString()),
      new BN(args.resetPeriod.toString()),
      args.autoStake,
      args.stakeTargetPercentage,
    )
    .accountsStrict({
      authority: args.authority,
      treasury: treasuryPubkey,
      systemProgram: new web3.PublicKey("11111111111111111111111111111111"),
    })
    .remainingAccounts(remainingAccounts);
};

/**
 * ### Returns a {@link web3.TransactionInstruction}
 * Accounts:
 * 0. `[signer]` authority: {@link PublicKey} 
 * 1. `[writable]` treasury: {@link Treasury} 
 * 2. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 * - name: {@link string} 
 * - signers: {@link PublicKey[]} 
 * - threshold: {@link number} 
 * - admin_limit: {@link BigInt} 
 * - treasurer_limit: {@link BigInt} 
 * - contributor_limit: {@link BigInt} 
 * - reset_period: {@link BigInt} 
 * - auto_stake: {@link boolean} 
 * - stake_target_percentage: {@link number} 
 */
export const initializeTreasury = (
	args: InitializeTreasuryArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionInstruction> =>
    initializeTreasuryBuilder(args, remainingAccounts).instruction();

/**
 * ### Returns a {@link web3.TransactionSignature}
 * Accounts:
 * 0. `[signer]` authority: {@link PublicKey} 
 * 1. `[writable]` treasury: {@link Treasury} 
 * 2. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 * - name: {@link string} 
 * - signers: {@link PublicKey[]} 
 * - threshold: {@link number} 
 * - admin_limit: {@link BigInt} 
 * - treasurer_limit: {@link BigInt} 
 * - contributor_limit: {@link BigInt} 
 * - reset_period: {@link BigInt} 
 * - auto_stake: {@link boolean} 
 * - stake_target_percentage: {@link number} 
 */
export const initializeTreasurySendAndConfirm = async (
  args: Omit<InitializeTreasuryArgs, "authority"> & {
    signers: {
      authority: web3.Signer,
    },
  },
  remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionSignature> => {
  const preInstructions: Array<web3.TransactionInstruction> = [];


  return initializeTreasuryBuilder({
      ...args,
      authority: args.signers.authority.publicKey,
    }, remainingAccounts)
    .preInstructions(preInstructions)
    .signers([args.signers.authority])
    .rpc();
}

export type UpdateTreasuryConfigArgs = {
  authority: web3.PublicKey;
  name: string;
  newSigners: web3.PublicKey[];
  newThreshold: number;
  adminLimit: bigint;
  treasurerLimit: bigint;
  contributorLimit: bigint;
  resetPeriod: bigint;
  autoStake: boolean;
  stakeTargetPercentage: number;
};

/**
 * ### Returns a {@link MethodsBuilder}
 * Accounts:
 * 0. `[signer]` authority: {@link PublicKey} 
 * 1. `[writable]` treasury: {@link Treasury} 
 *
 * Data:
 * - name: {@link string} 
 * - new_signers: {@link PublicKey[]} 
 * - new_threshold: {@link number} 
 * - admin_limit: {@link BigInt} 
 * - treasurer_limit: {@link BigInt} 
 * - contributor_limit: {@link BigInt} 
 * - reset_period: {@link BigInt} 
 * - auto_stake: {@link boolean} 
 * - stake_target_percentage: {@link number} 
 */
export const updateTreasuryConfigBuilder = (
	args: UpdateTreasuryConfigArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): MethodsBuilder<TreasuryManagement, never> => {
    const [treasuryPubkey] = pda.deriveTreasuryPDA({
        name: args.name,
    }, _program.programId);

  return _program
    .methods
    .updateTreasuryConfig(
      args.name,
      args.newSigners,
      args.newThreshold,
      new BN(args.adminLimit.toString()),
      new BN(args.treasurerLimit.toString()),
      new BN(args.contributorLimit.toString()),
      new BN(args.resetPeriod.toString()),
      args.autoStake,
      args.stakeTargetPercentage,
    )
    .accountsStrict({
      authority: args.authority,
      treasury: treasuryPubkey,
    })
    .remainingAccounts(remainingAccounts);
};

/**
 * ### Returns a {@link web3.TransactionInstruction}
 * Accounts:
 * 0. `[signer]` authority: {@link PublicKey} 
 * 1. `[writable]` treasury: {@link Treasury} 
 *
 * Data:
 * - name: {@link string} 
 * - new_signers: {@link PublicKey[]} 
 * - new_threshold: {@link number} 
 * - admin_limit: {@link BigInt} 
 * - treasurer_limit: {@link BigInt} 
 * - contributor_limit: {@link BigInt} 
 * - reset_period: {@link BigInt} 
 * - auto_stake: {@link boolean} 
 * - stake_target_percentage: {@link number} 
 */
export const updateTreasuryConfig = (
	args: UpdateTreasuryConfigArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionInstruction> =>
    updateTreasuryConfigBuilder(args, remainingAccounts).instruction();

/**
 * ### Returns a {@link web3.TransactionSignature}
 * Accounts:
 * 0. `[signer]` authority: {@link PublicKey} 
 * 1. `[writable]` treasury: {@link Treasury} 
 *
 * Data:
 * - name: {@link string} 
 * - new_signers: {@link PublicKey[]} 
 * - new_threshold: {@link number} 
 * - admin_limit: {@link BigInt} 
 * - treasurer_limit: {@link BigInt} 
 * - contributor_limit: {@link BigInt} 
 * - reset_period: {@link BigInt} 
 * - auto_stake: {@link boolean} 
 * - stake_target_percentage: {@link number} 
 */
export const updateTreasuryConfigSendAndConfirm = async (
  args: Omit<UpdateTreasuryConfigArgs, "authority"> & {
    signers: {
      authority: web3.Signer,
    },
  },
  remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionSignature> => {
  const preInstructions: Array<web3.TransactionInstruction> = [];


  return updateTreasuryConfigBuilder({
      ...args,
      authority: args.signers.authority.publicKey,
    }, remainingAccounts)
    .preInstructions(preInstructions)
    .signers([args.signers.authority])
    .rpc();
}

export type DepositTokensArgs = {
  depositor: web3.PublicKey;
  tokenMint: web3.PublicKey;
  source: web3.PublicKey;
  destination: web3.PublicKey;
  authority: web3.PublicKey;
  name: string;
  amount: bigint;
};

/**
 * ### Returns a {@link MethodsBuilder}
 * Accounts:
 * 0. `[signer]` depositor: {@link PublicKey} 
 * 1. `[writable]` treasury: {@link Treasury} 
 * 2. `[]` token_mint: {@link Mint} 
 * 3. `[writable]` source: {@link PublicKey} The source account.
 * 4. `[writable]` destination: {@link PublicKey} The destination account.
 * 5. `[signer]` authority: {@link PublicKey} The source account's owner/delegate.
 * 6. `[]` csl_spl_token_v0_0_0: {@link PublicKey} Auto-generated, CslSplTokenProgram v0.0.0
 *
 * Data:
 * - name: {@link string} 
 * - amount: {@link BigInt} 
 */
export const depositTokensBuilder = (
	args: DepositTokensArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): MethodsBuilder<TreasuryManagement, never> => {
    const [treasuryPubkey] = pda.deriveTreasuryPDA({
        name: args.name,
    }, _program.programId);

  return _program
    .methods
    .depositTokens(
      args.name,
      new BN(args.amount.toString()),
    )
    .accountsStrict({
      depositor: args.depositor,
      treasury: treasuryPubkey,
      tokenMint: args.tokenMint,
      source: args.source,
      destination: args.destination,
      authority: args.authority,
      cslSplTokenV000: new web3.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
    })
    .remainingAccounts(remainingAccounts);
};

/**
 * ### Returns a {@link web3.TransactionInstruction}
 * Accounts:
 * 0. `[signer]` depositor: {@link PublicKey} 
 * 1. `[writable]` treasury: {@link Treasury} 
 * 2. `[]` token_mint: {@link Mint} 
 * 3. `[writable]` source: {@link PublicKey} The source account.
 * 4. `[writable]` destination: {@link PublicKey} The destination account.
 * 5. `[signer]` authority: {@link PublicKey} The source account's owner/delegate.
 * 6. `[]` csl_spl_token_v0_0_0: {@link PublicKey} Auto-generated, CslSplTokenProgram v0.0.0
 *
 * Data:
 * - name: {@link string} 
 * - amount: {@link BigInt} 
 */
export const depositTokens = (
	args: DepositTokensArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionInstruction> =>
    depositTokensBuilder(args, remainingAccounts).instruction();

/**
 * ### Returns a {@link web3.TransactionSignature}
 * Accounts:
 * 0. `[signer]` depositor: {@link PublicKey} 
 * 1. `[writable]` treasury: {@link Treasury} 
 * 2. `[]` token_mint: {@link Mint} 
 * 3. `[writable]` source: {@link PublicKey} The source account.
 * 4. `[writable]` destination: {@link PublicKey} The destination account.
 * 5. `[signer]` authority: {@link PublicKey} The source account's owner/delegate.
 * 6. `[]` csl_spl_token_v0_0_0: {@link PublicKey} Auto-generated, CslSplTokenProgram v0.0.0
 *
 * Data:
 * - name: {@link string} 
 * - amount: {@link BigInt} 
 */
export const depositTokensSendAndConfirm = async (
  args: Omit<DepositTokensArgs, "depositor" | "authority"> & {
    signers: {
      depositor: web3.Signer,
      authority: web3.Signer,
    },
  },
  remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionSignature> => {
  const preInstructions: Array<web3.TransactionInstruction> = [];


  return depositTokensBuilder({
      ...args,
      depositor: args.signers.depositor.publicKey,
      authority: args.signers.authority.publicKey,
    }, remainingAccounts)
    .preInstructions(preInstructions)
    .signers([args.signers.depositor, args.signers.authority])
    .rpc();
}

export type DepositSolArgs = {
  depositor: web3.PublicKey;
  name: string;
  amount: bigint;
};

/**
 * ### Returns a {@link MethodsBuilder}
 * Accounts:
 * 0. `[writable, signer]` depositor: {@link PublicKey} 
 * 1. `[writable]` treasury: {@link Treasury} 
 *
 * Data:
 * - name: {@link string} 
 * - amount: {@link BigInt} 
 */
export const depositSolBuilder = (
	args: DepositSolArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): MethodsBuilder<TreasuryManagement, never> => {
    const [treasuryPubkey] = pda.deriveTreasuryPDA({
        name: args.name,
    }, _program.programId);

  return _program
    .methods
    .depositSol(
      args.name,
      new BN(args.amount.toString()),
    )
    .accountsStrict({
      depositor: args.depositor,
      treasury: treasuryPubkey,
    })
    .remainingAccounts(remainingAccounts);
};

/**
 * ### Returns a {@link web3.TransactionInstruction}
 * Accounts:
 * 0. `[writable, signer]` depositor: {@link PublicKey} 
 * 1. `[writable]` treasury: {@link Treasury} 
 *
 * Data:
 * - name: {@link string} 
 * - amount: {@link BigInt} 
 */
export const depositSol = (
	args: DepositSolArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionInstruction> =>
    depositSolBuilder(args, remainingAccounts).instruction();

/**
 * ### Returns a {@link web3.TransactionSignature}
 * Accounts:
 * 0. `[writable, signer]` depositor: {@link PublicKey} 
 * 1. `[writable]` treasury: {@link Treasury} 
 *
 * Data:
 * - name: {@link string} 
 * - amount: {@link BigInt} 
 */
export const depositSolSendAndConfirm = async (
  args: Omit<DepositSolArgs, "depositor"> & {
    signers: {
      depositor: web3.Signer,
    },
  },
  remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionSignature> => {
  const preInstructions: Array<web3.TransactionInstruction> = [];


  return depositSolBuilder({
      ...args,
      depositor: args.signers.depositor.publicKey,
    }, remainingAccounts)
    .preInstructions(preInstructions)
    .signers([args.signers.depositor])
    .rpc();
}

export type WithdrawTokensArgs = {
  authority: web3.PublicKey;
  tokenMint: web3.PublicKey;
  recipient: web3.PublicKey;
  source: web3.PublicKey;
  destination: web3.PublicKey;
  name: string;
  amount: bigint;
};

/**
 * ### Returns a {@link MethodsBuilder}
 * Accounts:
 * 0. `[signer]` authority: {@link PublicKey} 
 * 1. `[writable]` treasury: {@link Treasury} 
 * 2. `[]` token_mint: {@link Mint} 
 * 3. `[]` recipient: {@link PublicKey} 
 * 4. `[writable]` source: {@link PublicKey} The source account.
 * 5. `[writable]` destination: {@link PublicKey} The destination account.
 * 6. `[]` csl_spl_token_v0_0_0: {@link PublicKey} Auto-generated, CslSplTokenProgram v0.0.0
 *
 * Data:
 * - name: {@link string} 
 * - amount: {@link BigInt} 
 */
export const withdrawTokensBuilder = (
	args: WithdrawTokensArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): MethodsBuilder<TreasuryManagement, never> => {
    const [treasuryPubkey] = pda.deriveTreasuryPDA({
        name: args.name,
    }, _program.programId);

  return _program
    .methods
    .withdrawTokens(
      args.name,
      new BN(args.amount.toString()),
    )
    .accountsStrict({
      authority: args.authority,
      treasury: treasuryPubkey,
      tokenMint: args.tokenMint,
      recipient: args.recipient,
      source: args.source,
      destination: args.destination,
      cslSplTokenV000: new web3.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
    })
    .remainingAccounts(remainingAccounts);
};

/**
 * ### Returns a {@link web3.TransactionInstruction}
 * Accounts:
 * 0. `[signer]` authority: {@link PublicKey} 
 * 1. `[writable]` treasury: {@link Treasury} 
 * 2. `[]` token_mint: {@link Mint} 
 * 3. `[]` recipient: {@link PublicKey} 
 * 4. `[writable]` source: {@link PublicKey} The source account.
 * 5. `[writable]` destination: {@link PublicKey} The destination account.
 * 6. `[]` csl_spl_token_v0_0_0: {@link PublicKey} Auto-generated, CslSplTokenProgram v0.0.0
 *
 * Data:
 * - name: {@link string} 
 * - amount: {@link BigInt} 
 */
export const withdrawTokens = (
	args: WithdrawTokensArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionInstruction> =>
    withdrawTokensBuilder(args, remainingAccounts).instruction();

/**
 * ### Returns a {@link web3.TransactionSignature}
 * Accounts:
 * 0. `[signer]` authority: {@link PublicKey} 
 * 1. `[writable]` treasury: {@link Treasury} 
 * 2. `[]` token_mint: {@link Mint} 
 * 3. `[]` recipient: {@link PublicKey} 
 * 4. `[writable]` source: {@link PublicKey} The source account.
 * 5. `[writable]` destination: {@link PublicKey} The destination account.
 * 6. `[]` csl_spl_token_v0_0_0: {@link PublicKey} Auto-generated, CslSplTokenProgram v0.0.0
 *
 * Data:
 * - name: {@link string} 
 * - amount: {@link BigInt} 
 */
export const withdrawTokensSendAndConfirm = async (
  args: Omit<WithdrawTokensArgs, "authority"> & {
    signers: {
      authority: web3.Signer,
    },
  },
  remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionSignature> => {
  const preInstructions: Array<web3.TransactionInstruction> = [];


  return withdrawTokensBuilder({
      ...args,
      authority: args.signers.authority.publicKey,
    }, remainingAccounts)
    .preInstructions(preInstructions)
    .signers([args.signers.authority])
    .rpc();
}

export type WithdrawSolArgs = {
  authority: web3.PublicKey;
  recipient: web3.PublicKey;
  name: string;
  amount: bigint;
};

/**
 * ### Returns a {@link MethodsBuilder}
 * Accounts:
 * 0. `[signer]` authority: {@link PublicKey} 
 * 1. `[writable]` treasury: {@link Treasury} 
 * 2. `[writable]` recipient: {@link PublicKey} 
 *
 * Data:
 * - name: {@link string} 
 * - amount: {@link BigInt} 
 */
export const withdrawSolBuilder = (
	args: WithdrawSolArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): MethodsBuilder<TreasuryManagement, never> => {
    const [treasuryPubkey] = pda.deriveTreasuryPDA({
        name: args.name,
    }, _program.programId);

  return _program
    .methods
    .withdrawSol(
      args.name,
      new BN(args.amount.toString()),
    )
    .accountsStrict({
      authority: args.authority,
      treasury: treasuryPubkey,
      recipient: args.recipient,
    })
    .remainingAccounts(remainingAccounts);
};

/**
 * ### Returns a {@link web3.TransactionInstruction}
 * Accounts:
 * 0. `[signer]` authority: {@link PublicKey} 
 * 1. `[writable]` treasury: {@link Treasury} 
 * 2. `[writable]` recipient: {@link PublicKey} 
 *
 * Data:
 * - name: {@link string} 
 * - amount: {@link BigInt} 
 */
export const withdrawSol = (
	args: WithdrawSolArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionInstruction> =>
    withdrawSolBuilder(args, remainingAccounts).instruction();

/**
 * ### Returns a {@link web3.TransactionSignature}
 * Accounts:
 * 0. `[signer]` authority: {@link PublicKey} 
 * 1. `[writable]` treasury: {@link Treasury} 
 * 2. `[writable]` recipient: {@link PublicKey} 
 *
 * Data:
 * - name: {@link string} 
 * - amount: {@link BigInt} 
 */
export const withdrawSolSendAndConfirm = async (
  args: Omit<WithdrawSolArgs, "authority"> & {
    signers: {
      authority: web3.Signer,
    },
  },
  remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionSignature> => {
  const preInstructions: Array<web3.TransactionInstruction> = [];


  return withdrawSolBuilder({
      ...args,
      authority: args.signers.authority.publicKey,
    }, remainingAccounts)
    .preInstructions(preInstructions)
    .signers([args.signers.authority])
    .rpc();
}

export type AssignRoleArgs = {
  authority: web3.PublicKey;
  name: string;
  user: web3.PublicKey;
  roleType: number;
  canExecutePayments: boolean;
  canCreateStreams: boolean;
  canManageRoles: boolean;
  canViewTreasury: boolean;
  canPropose: boolean;
  canVote: boolean;
};

/**
 * ### Returns a {@link MethodsBuilder}
 * Accounts:
 * 0. `[signer]` authority: {@link PublicKey} 
 * 1. `[]` treasury: {@link Treasury} 
 *
 * Data:
 * - name: {@link string} 
 * - user: {@link PublicKey} 
 * - role_type: {@link number} 
 * - can_execute_payments: {@link boolean} 
 * - can_create_streams: {@link boolean} 
 * - can_manage_roles: {@link boolean} 
 * - can_view_treasury: {@link boolean} 
 * - can_propose: {@link boolean} 
 * - can_vote: {@link boolean} 
 */
export const assignRoleBuilder = (
	args: AssignRoleArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): MethodsBuilder<TreasuryManagement, never> => {
    const [treasuryPubkey] = pda.deriveTreasuryPDA({
        name: args.name,
    }, _program.programId);

  return _program
    .methods
    .assignRole(
      args.name,
      args.user,
      args.roleType,
      args.canExecutePayments,
      args.canCreateStreams,
      args.canManageRoles,
      args.canViewTreasury,
      args.canPropose,
      args.canVote,
    )
    .accountsStrict({
      authority: args.authority,
      treasury: treasuryPubkey,
    })
    .remainingAccounts(remainingAccounts);
};

/**
 * ### Returns a {@link web3.TransactionInstruction}
 * Accounts:
 * 0. `[signer]` authority: {@link PublicKey} 
 * 1. `[]` treasury: {@link Treasury} 
 *
 * Data:
 * - name: {@link string} 
 * - user: {@link PublicKey} 
 * - role_type: {@link number} 
 * - can_execute_payments: {@link boolean} 
 * - can_create_streams: {@link boolean} 
 * - can_manage_roles: {@link boolean} 
 * - can_view_treasury: {@link boolean} 
 * - can_propose: {@link boolean} 
 * - can_vote: {@link boolean} 
 */
export const assignRole = (
	args: AssignRoleArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionInstruction> =>
    assignRoleBuilder(args, remainingAccounts).instruction();

/**
 * ### Returns a {@link web3.TransactionSignature}
 * Accounts:
 * 0. `[signer]` authority: {@link PublicKey} 
 * 1. `[]` treasury: {@link Treasury} 
 *
 * Data:
 * - name: {@link string} 
 * - user: {@link PublicKey} 
 * - role_type: {@link number} 
 * - can_execute_payments: {@link boolean} 
 * - can_create_streams: {@link boolean} 
 * - can_manage_roles: {@link boolean} 
 * - can_view_treasury: {@link boolean} 
 * - can_propose: {@link boolean} 
 * - can_vote: {@link boolean} 
 */
export const assignRoleSendAndConfirm = async (
  args: Omit<AssignRoleArgs, "authority"> & {
    signers: {
      authority: web3.Signer,
    },
  },
  remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionSignature> => {
  const preInstructions: Array<web3.TransactionInstruction> = [];


  return assignRoleBuilder({
      ...args,
      authority: args.signers.authority.publicKey,
    }, remainingAccounts)
    .preInstructions(preInstructions)
    .signers([args.signers.authority])
    .rpc();
}

export type RemoveRoleArgs = {
  authority: web3.PublicKey;
  name: string;
  user: web3.PublicKey;
};

/**
 * ### Returns a {@link MethodsBuilder}
 * Accounts:
 * 0. `[signer]` authority: {@link PublicKey} 
 * 1. `[]` treasury: {@link Treasury} 
 *
 * Data:
 * - name: {@link string} 
 * - user: {@link PublicKey} 
 */
export const removeRoleBuilder = (
	args: RemoveRoleArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): MethodsBuilder<TreasuryManagement, never> => {
    const [treasuryPubkey] = pda.deriveTreasuryPDA({
        name: args.name,
    }, _program.programId);

  return _program
    .methods
    .removeRole(
      args.name,
      args.user,
    )
    .accountsStrict({
      authority: args.authority,
      treasury: treasuryPubkey,
    })
    .remainingAccounts(remainingAccounts);
};

/**
 * ### Returns a {@link web3.TransactionInstruction}
 * Accounts:
 * 0. `[signer]` authority: {@link PublicKey} 
 * 1. `[]` treasury: {@link Treasury} 
 *
 * Data:
 * - name: {@link string} 
 * - user: {@link PublicKey} 
 */
export const removeRole = (
	args: RemoveRoleArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionInstruction> =>
    removeRoleBuilder(args, remainingAccounts).instruction();

/**
 * ### Returns a {@link web3.TransactionSignature}
 * Accounts:
 * 0. `[signer]` authority: {@link PublicKey} 
 * 1. `[]` treasury: {@link Treasury} 
 *
 * Data:
 * - name: {@link string} 
 * - user: {@link PublicKey} 
 */
export const removeRoleSendAndConfirm = async (
  args: Omit<RemoveRoleArgs, "authority"> & {
    signers: {
      authority: web3.Signer,
    },
  },
  remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionSignature> => {
  const preInstructions: Array<web3.TransactionInstruction> = [];


  return removeRoleBuilder({
      ...args,
      authority: args.signers.authority.publicKey,
    }, remainingAccounts)
    .preInstructions(preInstructions)
    .signers([args.signers.authority])
    .rpc();
}

export type CreatePaymentStreamArgs = {
  authority: web3.PublicKey;
  name: string;
  recipient: web3.PublicKey;
  tokenMint: web3.PublicKey;
  amountPerPeriod: bigint;
  periodDuration: bigint;
  startTime: bigint;
  endTime: bigint;
  category: number;
};

/**
 * ### Returns a {@link MethodsBuilder}
 * Accounts:
 * 0. `[signer]` authority: {@link PublicKey} 
 * 1. `[]` treasury: {@link Treasury} 
 * 2. `[writable]` payment_stream: {@link PaymentStream} 
 * 3. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 * - name: {@link string} 
 * - recipient: {@link PublicKey} 
 * - token_mint: {@link PublicKey} 
 * - amount_per_period: {@link BigInt} 
 * - period_duration: {@link BigInt} 
 * - start_time: {@link BigInt} 
 * - end_time: {@link BigInt} 
 * - category: {@link number} 
 */
export const createPaymentStreamBuilder = (
	args: CreatePaymentStreamArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): MethodsBuilder<TreasuryManagement, never> => {
    const [treasuryPubkey] = pda.deriveTreasuryPDA({
        name: args.name,
    }, _program.programId);
    const [paymentStreamPubkey] = pda.derivePaymentStreamPDA({
        treasury: args.treasury,
        recipient: args.recipient,
    }, _program.programId);

  return _program
    .methods
    .createPaymentStream(
      args.name,
      args.recipient,
      args.tokenMint,
      new BN(args.amountPerPeriod.toString()),
      new BN(args.periodDuration.toString()),
      new BN(args.startTime.toString()),
      new BN(args.endTime.toString()),
      args.category,
    )
    .accountsStrict({
      authority: args.authority,
      treasury: treasuryPubkey,
      paymentStream: paymentStreamPubkey,
      systemProgram: new web3.PublicKey("11111111111111111111111111111111"),
    })
    .remainingAccounts(remainingAccounts);
};

/**
 * ### Returns a {@link web3.TransactionInstruction}
 * Accounts:
 * 0. `[signer]` authority: {@link PublicKey} 
 * 1. `[]` treasury: {@link Treasury} 
 * 2. `[writable]` payment_stream: {@link PaymentStream} 
 * 3. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 * - name: {@link string} 
 * - recipient: {@link PublicKey} 
 * - token_mint: {@link PublicKey} 
 * - amount_per_period: {@link BigInt} 
 * - period_duration: {@link BigInt} 
 * - start_time: {@link BigInt} 
 * - end_time: {@link BigInt} 
 * - category: {@link number} 
 */
export const createPaymentStream = (
	args: CreatePaymentStreamArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionInstruction> =>
    createPaymentStreamBuilder(args, remainingAccounts).instruction();

/**
 * ### Returns a {@link web3.TransactionSignature}
 * Accounts:
 * 0. `[signer]` authority: {@link PublicKey} 
 * 1. `[]` treasury: {@link Treasury} 
 * 2. `[writable]` payment_stream: {@link PaymentStream} 
 * 3. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 * - name: {@link string} 
 * - recipient: {@link PublicKey} 
 * - token_mint: {@link PublicKey} 
 * - amount_per_period: {@link BigInt} 
 * - period_duration: {@link BigInt} 
 * - start_time: {@link BigInt} 
 * - end_time: {@link BigInt} 
 * - category: {@link number} 
 */
export const createPaymentStreamSendAndConfirm = async (
  args: Omit<CreatePaymentStreamArgs, "authority"> & {
    signers: {
      authority: web3.Signer,
    },
  },
  remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionSignature> => {
  const preInstructions: Array<web3.TransactionInstruction> = [];


  return createPaymentStreamBuilder({
      ...args,
      authority: args.signers.authority.publicKey,
    }, remainingAccounts)
    .preInstructions(preInstructions)
    .signers([args.signers.authority])
    .rpc();
}

export type ExecuteStreamPaymentArgs = {
  executor: web3.PublicKey;
  tokenMint: web3.PublicKey;
  source: web3.PublicKey;
  destination: web3.PublicKey;
  authority: web3.PublicKey;
  name: string;
  recipient: web3.PublicKey;
};

/**
 * ### Returns a {@link MethodsBuilder}
 * Accounts:
 * 0. `[signer]` executor: {@link PublicKey} 
 * 1. `[writable]` treasury: {@link Treasury} 
 * 2. `[writable]` payment_stream: {@link PaymentStream} 
 * 3. `[]` token_mint: {@link Mint} 
 * 4. `[writable]` source: {@link PublicKey} The source account.
 * 5. `[writable]` destination: {@link PublicKey} The destination account.
 * 6. `[signer]` authority: {@link PublicKey} The source account's owner/delegate.
 * 7. `[]` csl_spl_token_v0_0_0: {@link PublicKey} Auto-generated, CslSplTokenProgram v0.0.0
 *
 * Data:
 * - name: {@link string} 
 * - recipient: {@link PublicKey} 
 */
export const executeStreamPaymentBuilder = (
	args: ExecuteStreamPaymentArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): MethodsBuilder<TreasuryManagement, never> => {
    const [treasuryPubkey] = pda.deriveTreasuryPDA({
        name: args.name,
    }, _program.programId);
    const [paymentStreamPubkey] = pda.derivePaymentStreamPDA({
        treasury: args.treasury,
        recipient: args.recipient,
    }, _program.programId);

  return _program
    .methods
    .executeStreamPayment(
      args.name,
      args.recipient,
    )
    .accountsStrict({
      executor: args.executor,
      treasury: treasuryPubkey,
      paymentStream: paymentStreamPubkey,
      tokenMint: args.tokenMint,
      source: args.source,
      destination: args.destination,
      authority: args.authority,
      cslSplTokenV000: new web3.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
    })
    .remainingAccounts(remainingAccounts);
};

/**
 * ### Returns a {@link web3.TransactionInstruction}
 * Accounts:
 * 0. `[signer]` executor: {@link PublicKey} 
 * 1. `[writable]` treasury: {@link Treasury} 
 * 2. `[writable]` payment_stream: {@link PaymentStream} 
 * 3. `[]` token_mint: {@link Mint} 
 * 4. `[writable]` source: {@link PublicKey} The source account.
 * 5. `[writable]` destination: {@link PublicKey} The destination account.
 * 6. `[signer]` authority: {@link PublicKey} The source account's owner/delegate.
 * 7. `[]` csl_spl_token_v0_0_0: {@link PublicKey} Auto-generated, CslSplTokenProgram v0.0.0
 *
 * Data:
 * - name: {@link string} 
 * - recipient: {@link PublicKey} 
 */
export const executeStreamPayment = (
	args: ExecuteStreamPaymentArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionInstruction> =>
    executeStreamPaymentBuilder(args, remainingAccounts).instruction();

/**
 * ### Returns a {@link web3.TransactionSignature}
 * Accounts:
 * 0. `[signer]` executor: {@link PublicKey} 
 * 1. `[writable]` treasury: {@link Treasury} 
 * 2. `[writable]` payment_stream: {@link PaymentStream} 
 * 3. `[]` token_mint: {@link Mint} 
 * 4. `[writable]` source: {@link PublicKey} The source account.
 * 5. `[writable]` destination: {@link PublicKey} The destination account.
 * 6. `[signer]` authority: {@link PublicKey} The source account's owner/delegate.
 * 7. `[]` csl_spl_token_v0_0_0: {@link PublicKey} Auto-generated, CslSplTokenProgram v0.0.0
 *
 * Data:
 * - name: {@link string} 
 * - recipient: {@link PublicKey} 
 */
export const executeStreamPaymentSendAndConfirm = async (
  args: Omit<ExecuteStreamPaymentArgs, "executor" | "authority"> & {
    signers: {
      executor: web3.Signer,
      authority: web3.Signer,
    },
  },
  remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionSignature> => {
  const preInstructions: Array<web3.TransactionInstruction> = [];


  return executeStreamPaymentBuilder({
      ...args,
      executor: args.signers.executor.publicKey,
      authority: args.signers.authority.publicKey,
    }, remainingAccounts)
    .preInstructions(preInstructions)
    .signers([args.signers.executor, args.signers.authority])
    .rpc();
}

export type CancelPaymentStreamArgs = {
  authority: web3.PublicKey;
  name: string;
  recipient: web3.PublicKey;
};

/**
 * ### Returns a {@link MethodsBuilder}
 * Accounts:
 * 0. `[signer]` authority: {@link PublicKey} 
 * 1. `[]` treasury: {@link Treasury} 
 * 2. `[writable]` payment_stream: {@link PaymentStream} 
 *
 * Data:
 * - name: {@link string} 
 * - recipient: {@link PublicKey} 
 */
export const cancelPaymentStreamBuilder = (
	args: CancelPaymentStreamArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): MethodsBuilder<TreasuryManagement, never> => {
    const [treasuryPubkey] = pda.deriveTreasuryPDA({
        name: args.name,
    }, _program.programId);
    const [paymentStreamPubkey] = pda.derivePaymentStreamPDA({
        treasury: args.treasury,
        recipient: args.recipient,
    }, _program.programId);

  return _program
    .methods
    .cancelPaymentStream(
      args.name,
      args.recipient,
    )
    .accountsStrict({
      authority: args.authority,
      treasury: treasuryPubkey,
      paymentStream: paymentStreamPubkey,
    })
    .remainingAccounts(remainingAccounts);
};

/**
 * ### Returns a {@link web3.TransactionInstruction}
 * Accounts:
 * 0. `[signer]` authority: {@link PublicKey} 
 * 1. `[]` treasury: {@link Treasury} 
 * 2. `[writable]` payment_stream: {@link PaymentStream} 
 *
 * Data:
 * - name: {@link string} 
 * - recipient: {@link PublicKey} 
 */
export const cancelPaymentStream = (
	args: CancelPaymentStreamArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionInstruction> =>
    cancelPaymentStreamBuilder(args, remainingAccounts).instruction();

/**
 * ### Returns a {@link web3.TransactionSignature}
 * Accounts:
 * 0. `[signer]` authority: {@link PublicKey} 
 * 1. `[]` treasury: {@link Treasury} 
 * 2. `[writable]` payment_stream: {@link PaymentStream} 
 *
 * Data:
 * - name: {@link string} 
 * - recipient: {@link PublicKey} 
 */
export const cancelPaymentStreamSendAndConfirm = async (
  args: Omit<CancelPaymentStreamArgs, "authority"> & {
    signers: {
      authority: web3.Signer,
    },
  },
  remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionSignature> => {
  const preInstructions: Array<web3.TransactionInstruction> = [];


  return cancelPaymentStreamBuilder({
      ...args,
      authority: args.signers.authority.publicKey,
    }, remainingAccounts)
    .preInstructions(preInstructions)
    .signers([args.signers.authority])
    .rpc();
}

export type CreateMilestonePaymentArgs = {
  authority: web3.PublicKey;
  name: string;
  id: bigint;
  recipient: web3.PublicKey;
  tokenMint: web3.PublicKey;
  amount: bigint;
  description: string;
  category: number;
};

/**
 * ### Returns a {@link MethodsBuilder}
 * Accounts:
 * 0. `[signer]` authority: {@link PublicKey} 
 * 1. `[]` treasury: {@link Treasury} 
 * 2. `[writable]` milestone_payment: {@link MilestonePayment} 
 * 3. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 * - name: {@link string} 
 * - id: {@link BigInt} 
 * - recipient: {@link PublicKey} 
 * - token_mint: {@link PublicKey} 
 * - amount: {@link BigInt} 
 * - description: {@link string} type
 * - category: {@link number} 
 */
export const createMilestonePaymentBuilder = (
	args: CreateMilestonePaymentArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): MethodsBuilder<TreasuryManagement, never> => {
    const [treasuryPubkey] = pda.deriveTreasuryPDA({
        name: args.name,
    }, _program.programId);
    const [milestonePaymentPubkey] = pda.deriveMilestonePaymentPDA({
        treasury: args.treasury,
        id: args.id,
    }, _program.programId);

  return _program
    .methods
    .createMilestonePayment(
      args.name,
      new BN(args.id.toString()),
      args.recipient,
      args.tokenMint,
      new BN(args.amount.toString()),
      args.description,
      args.category,
    )
    .accountsStrict({
      authority: args.authority,
      treasury: treasuryPubkey,
      milestonePayment: milestonePaymentPubkey,
      systemProgram: new web3.PublicKey("11111111111111111111111111111111"),
    })
    .remainingAccounts(remainingAccounts);
};

/**
 * ### Returns a {@link web3.TransactionInstruction}
 * Accounts:
 * 0. `[signer]` authority: {@link PublicKey} 
 * 1. `[]` treasury: {@link Treasury} 
 * 2. `[writable]` milestone_payment: {@link MilestonePayment} 
 * 3. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 * - name: {@link string} 
 * - id: {@link BigInt} 
 * - recipient: {@link PublicKey} 
 * - token_mint: {@link PublicKey} 
 * - amount: {@link BigInt} 
 * - description: {@link string} type
 * - category: {@link number} 
 */
export const createMilestonePayment = (
	args: CreateMilestonePaymentArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionInstruction> =>
    createMilestonePaymentBuilder(args, remainingAccounts).instruction();

/**
 * ### Returns a {@link web3.TransactionSignature}
 * Accounts:
 * 0. `[signer]` authority: {@link PublicKey} 
 * 1. `[]` treasury: {@link Treasury} 
 * 2. `[writable]` milestone_payment: {@link MilestonePayment} 
 * 3. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 * - name: {@link string} 
 * - id: {@link BigInt} 
 * - recipient: {@link PublicKey} 
 * - token_mint: {@link PublicKey} 
 * - amount: {@link BigInt} 
 * - description: {@link string} type
 * - category: {@link number} 
 */
export const createMilestonePaymentSendAndConfirm = async (
  args: Omit<CreateMilestonePaymentArgs, "authority"> & {
    signers: {
      authority: web3.Signer,
    },
  },
  remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionSignature> => {
  const preInstructions: Array<web3.TransactionInstruction> = [];


  return createMilestonePaymentBuilder({
      ...args,
      authority: args.signers.authority.publicKey,
    }, remainingAccounts)
    .preInstructions(preInstructions)
    .signers([args.signers.authority])
    .rpc();
}

export type CompleteMilestoneArgs = {
  authority: web3.PublicKey;
  tokenMint: web3.PublicKey;
  source: web3.PublicKey;
  destination: web3.PublicKey;
  name: string;
  id: bigint;
};

/**
 * ### Returns a {@link MethodsBuilder}
 * Accounts:
 * 0. `[signer]` authority: {@link PublicKey} 
 * 1. `[writable]` treasury: {@link Treasury} 
 * 2. `[writable]` milestone_payment: {@link MilestonePayment} 
 * 3. `[]` token_mint: {@link Mint} 
 * 4. `[writable]` source: {@link PublicKey} The source account.
 * 5. `[writable]` destination: {@link PublicKey} The destination account.
 * 6. `[]` csl_spl_token_v0_0_0: {@link PublicKey} Auto-generated, CslSplTokenProgram v0.0.0
 *
 * Data:
 * - name: {@link string} 
 * - id: {@link BigInt} 
 */
export const completeMilestoneBuilder = (
	args: CompleteMilestoneArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): MethodsBuilder<TreasuryManagement, never> => {
    const [treasuryPubkey] = pda.deriveTreasuryPDA({
        name: args.name,
    }, _program.programId);
    const [milestonePaymentPubkey] = pda.deriveMilestonePaymentPDA({
        treasury: args.treasury,
        id: args.id,
    }, _program.programId);

  return _program
    .methods
    .completeMilestone(
      args.name,
      new BN(args.id.toString()),
    )
    .accountsStrict({
      authority: args.authority,
      treasury: treasuryPubkey,
      milestonePayment: milestonePaymentPubkey,
      tokenMint: args.tokenMint,
      source: args.source,
      destination: args.destination,
      cslSplTokenV000: new web3.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
    })
    .remainingAccounts(remainingAccounts);
};

/**
 * ### Returns a {@link web3.TransactionInstruction}
 * Accounts:
 * 0. `[signer]` authority: {@link PublicKey} 
 * 1. `[writable]` treasury: {@link Treasury} 
 * 2. `[writable]` milestone_payment: {@link MilestonePayment} 
 * 3. `[]` token_mint: {@link Mint} 
 * 4. `[writable]` source: {@link PublicKey} The source account.
 * 5. `[writable]` destination: {@link PublicKey} The destination account.
 * 6. `[]` csl_spl_token_v0_0_0: {@link PublicKey} Auto-generated, CslSplTokenProgram v0.0.0
 *
 * Data:
 * - name: {@link string} 
 * - id: {@link BigInt} 
 */
export const completeMilestone = (
	args: CompleteMilestoneArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionInstruction> =>
    completeMilestoneBuilder(args, remainingAccounts).instruction();

/**
 * ### Returns a {@link web3.TransactionSignature}
 * Accounts:
 * 0. `[signer]` authority: {@link PublicKey} 
 * 1. `[writable]` treasury: {@link Treasury} 
 * 2. `[writable]` milestone_payment: {@link MilestonePayment} 
 * 3. `[]` token_mint: {@link Mint} 
 * 4. `[writable]` source: {@link PublicKey} The source account.
 * 5. `[writable]` destination: {@link PublicKey} The destination account.
 * 6. `[]` csl_spl_token_v0_0_0: {@link PublicKey} Auto-generated, CslSplTokenProgram v0.0.0
 *
 * Data:
 * - name: {@link string} 
 * - id: {@link BigInt} 
 */
export const completeMilestoneSendAndConfirm = async (
  args: Omit<CompleteMilestoneArgs, "authority"> & {
    signers: {
      authority: web3.Signer,
    },
  },
  remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionSignature> => {
  const preInstructions: Array<web3.TransactionInstruction> = [];


  return completeMilestoneBuilder({
      ...args,
      authority: args.signers.authority.publicKey,
    }, remainingAccounts)
    .preInstructions(preInstructions)
    .signers([args.signers.authority])
    .rpc();
}

export type CreateRecurringPaymentArgs = {
  authority: web3.PublicKey;
  name: string;
  recipient: web3.PublicKey;
  tokenMint: web3.PublicKey;
  amount: bigint;
  interval: bigint;
  category: number;
};

/**
 * ### Returns a {@link MethodsBuilder}
 * Accounts:
 * 0. `[signer]` authority: {@link PublicKey} 
 * 1. `[]` treasury: {@link Treasury} 
 * 2. `[writable]` recurring_payment: {@link RecurringPayment} 
 * 3. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 * - name: {@link string} 
 * - recipient: {@link PublicKey} 
 * - token_mint: {@link PublicKey} 
 * - amount: {@link BigInt} 
 * - interval: {@link BigInt} 
 * - category: {@link number} 
 */
export const createRecurringPaymentBuilder = (
	args: CreateRecurringPaymentArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): MethodsBuilder<TreasuryManagement, never> => {
    const [treasuryPubkey] = pda.deriveTreasuryPDA({
        name: args.name,
    }, _program.programId);
    const [recurringPaymentPubkey] = pda.deriveRecurringPaymentPDA({
        treasury: args.treasury,
        recipient: args.recipient,
    }, _program.programId);

  return _program
    .methods
    .createRecurringPayment(
      args.name,
      args.recipient,
      args.tokenMint,
      new BN(args.amount.toString()),
      new BN(args.interval.toString()),
      args.category,
    )
    .accountsStrict({
      authority: args.authority,
      treasury: treasuryPubkey,
      recurringPayment: recurringPaymentPubkey,
      systemProgram: new web3.PublicKey("11111111111111111111111111111111"),
    })
    .remainingAccounts(remainingAccounts);
};

/**
 * ### Returns a {@link web3.TransactionInstruction}
 * Accounts:
 * 0. `[signer]` authority: {@link PublicKey} 
 * 1. `[]` treasury: {@link Treasury} 
 * 2. `[writable]` recurring_payment: {@link RecurringPayment} 
 * 3. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 * - name: {@link string} 
 * - recipient: {@link PublicKey} 
 * - token_mint: {@link PublicKey} 
 * - amount: {@link BigInt} 
 * - interval: {@link BigInt} 
 * - category: {@link number} 
 */
export const createRecurringPayment = (
	args: CreateRecurringPaymentArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionInstruction> =>
    createRecurringPaymentBuilder(args, remainingAccounts).instruction();

/**
 * ### Returns a {@link web3.TransactionSignature}
 * Accounts:
 * 0. `[signer]` authority: {@link PublicKey} 
 * 1. `[]` treasury: {@link Treasury} 
 * 2. `[writable]` recurring_payment: {@link RecurringPayment} 
 * 3. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 * - name: {@link string} 
 * - recipient: {@link PublicKey} 
 * - token_mint: {@link PublicKey} 
 * - amount: {@link BigInt} 
 * - interval: {@link BigInt} 
 * - category: {@link number} 
 */
export const createRecurringPaymentSendAndConfirm = async (
  args: Omit<CreateRecurringPaymentArgs, "authority"> & {
    signers: {
      authority: web3.Signer,
    },
  },
  remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionSignature> => {
  const preInstructions: Array<web3.TransactionInstruction> = [];


  return createRecurringPaymentBuilder({
      ...args,
      authority: args.signers.authority.publicKey,
    }, remainingAccounts)
    .preInstructions(preInstructions)
    .signers([args.signers.authority])
    .rpc();
}

export type ExecuteRecurringPaymentArgs = {
  executor: web3.PublicKey;
  tokenMint: web3.PublicKey;
  source: web3.PublicKey;
  destination: web3.PublicKey;
  authority: web3.PublicKey;
  name: string;
  recipient: web3.PublicKey;
};

/**
 * ### Returns a {@link MethodsBuilder}
 * Accounts:
 * 0. `[signer]` executor: {@link PublicKey} 
 * 1. `[writable]` treasury: {@link Treasury} 
 * 2. `[writable]` recurring_payment: {@link RecurringPayment} 
 * 3. `[]` token_mint: {@link Mint} 
 * 4. `[writable]` source: {@link PublicKey} The source account.
 * 5. `[writable]` destination: {@link PublicKey} The destination account.
 * 6. `[signer]` authority: {@link PublicKey} The source account's owner/delegate.
 * 7. `[]` csl_spl_token_v0_0_0: {@link PublicKey} Auto-generated, CslSplTokenProgram v0.0.0
 *
 * Data:
 * - name: {@link string} 
 * - recipient: {@link PublicKey} 
 */
export const executeRecurringPaymentBuilder = (
	args: ExecuteRecurringPaymentArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): MethodsBuilder<TreasuryManagement, never> => {
    const [treasuryPubkey] = pda.deriveTreasuryPDA({
        name: args.name,
    }, _program.programId);
    const [recurringPaymentPubkey] = pda.deriveRecurringPaymentPDA({
        treasury: args.treasury,
        recipient: args.recipient,
    }, _program.programId);

  return _program
    .methods
    .executeRecurringPayment(
      args.name,
      args.recipient,
    )
    .accountsStrict({
      executor: args.executor,
      treasury: treasuryPubkey,
      recurringPayment: recurringPaymentPubkey,
      tokenMint: args.tokenMint,
      source: args.source,
      destination: args.destination,
      authority: args.authority,
      cslSplTokenV000: new web3.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
    })
    .remainingAccounts(remainingAccounts);
};

/**
 * ### Returns a {@link web3.TransactionInstruction}
 * Accounts:
 * 0. `[signer]` executor: {@link PublicKey} 
 * 1. `[writable]` treasury: {@link Treasury} 
 * 2. `[writable]` recurring_payment: {@link RecurringPayment} 
 * 3. `[]` token_mint: {@link Mint} 
 * 4. `[writable]` source: {@link PublicKey} The source account.
 * 5. `[writable]` destination: {@link PublicKey} The destination account.
 * 6. `[signer]` authority: {@link PublicKey} The source account's owner/delegate.
 * 7. `[]` csl_spl_token_v0_0_0: {@link PublicKey} Auto-generated, CslSplTokenProgram v0.0.0
 *
 * Data:
 * - name: {@link string} 
 * - recipient: {@link PublicKey} 
 */
export const executeRecurringPayment = (
	args: ExecuteRecurringPaymentArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionInstruction> =>
    executeRecurringPaymentBuilder(args, remainingAccounts).instruction();

/**
 * ### Returns a {@link web3.TransactionSignature}
 * Accounts:
 * 0. `[signer]` executor: {@link PublicKey} 
 * 1. `[writable]` treasury: {@link Treasury} 
 * 2. `[writable]` recurring_payment: {@link RecurringPayment} 
 * 3. `[]` token_mint: {@link Mint} 
 * 4. `[writable]` source: {@link PublicKey} The source account.
 * 5. `[writable]` destination: {@link PublicKey} The destination account.
 * 6. `[signer]` authority: {@link PublicKey} The source account's owner/delegate.
 * 7. `[]` csl_spl_token_v0_0_0: {@link PublicKey} Auto-generated, CslSplTokenProgram v0.0.0
 *
 * Data:
 * - name: {@link string} 
 * - recipient: {@link PublicKey} 
 */
export const executeRecurringPaymentSendAndConfirm = async (
  args: Omit<ExecuteRecurringPaymentArgs, "executor" | "authority"> & {
    signers: {
      executor: web3.Signer,
      authority: web3.Signer,
    },
  },
  remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionSignature> => {
  const preInstructions: Array<web3.TransactionInstruction> = [];


  return executeRecurringPaymentBuilder({
      ...args,
      executor: args.signers.executor.publicKey,
      authority: args.signers.authority.publicKey,
    }, remainingAccounts)
    .preInstructions(preInstructions)
    .signers([args.signers.executor, args.signers.authority])
    .rpc();
}

export type BatchTransferArgs = {
  authority: web3.PublicKey;
  tokenMint: web3.PublicKey;
  source: web3.PublicKey;
  destination: web3.PublicKey;
  name: string;
  recipients: web3.PublicKey[];
  amounts: bigint[];
};

/**
 * ### Returns a {@link MethodsBuilder}
 * Accounts:
 * 0. `[signer]` authority: {@link PublicKey} 
 * 1. `[writable]` treasury: {@link Treasury} 
 * 2. `[]` token_mint: {@link Mint} 
 * 3. `[writable]` source: {@link PublicKey} The source account.
 * 4. `[writable]` destination: {@link PublicKey} The destination account.
 * 5. `[]` csl_spl_token_v0_0_0: {@link PublicKey} Auto-generated, CslSplTokenProgram v0.0.0
 *
 * Data:
 * - name: {@link string} 
 * - recipients: {@link PublicKey[]} 
 * - amounts: {@link BigInt[]} 
 */
export const batchTransferBuilder = (
	args: BatchTransferArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): MethodsBuilder<TreasuryManagement, never> => {
    const [treasuryPubkey] = pda.deriveTreasuryPDA({
        name: args.name,
    }, _program.programId);

  return _program
    .methods
    .batchTransfer(
      args.name,
      args.recipients,
      args.amounts.map(e => new BN(e.toString())),
    )
    .accountsStrict({
      authority: args.authority,
      treasury: treasuryPubkey,
      tokenMint: args.tokenMint,
      source: args.source,
      destination: args.destination,
      cslSplTokenV000: new web3.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
    })
    .remainingAccounts(remainingAccounts);
};

/**
 * ### Returns a {@link web3.TransactionInstruction}
 * Accounts:
 * 0. `[signer]` authority: {@link PublicKey} 
 * 1. `[writable]` treasury: {@link Treasury} 
 * 2. `[]` token_mint: {@link Mint} 
 * 3. `[writable]` source: {@link PublicKey} The source account.
 * 4. `[writable]` destination: {@link PublicKey} The destination account.
 * 5. `[]` csl_spl_token_v0_0_0: {@link PublicKey} Auto-generated, CslSplTokenProgram v0.0.0
 *
 * Data:
 * - name: {@link string} 
 * - recipients: {@link PublicKey[]} 
 * - amounts: {@link BigInt[]} 
 */
export const batchTransfer = (
	args: BatchTransferArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionInstruction> =>
    batchTransferBuilder(args, remainingAccounts).instruction();

/**
 * ### Returns a {@link web3.TransactionSignature}
 * Accounts:
 * 0. `[signer]` authority: {@link PublicKey} 
 * 1. `[writable]` treasury: {@link Treasury} 
 * 2. `[]` token_mint: {@link Mint} 
 * 3. `[writable]` source: {@link PublicKey} The source account.
 * 4. `[writable]` destination: {@link PublicKey} The destination account.
 * 5. `[]` csl_spl_token_v0_0_0: {@link PublicKey} Auto-generated, CslSplTokenProgram v0.0.0
 *
 * Data:
 * - name: {@link string} 
 * - recipients: {@link PublicKey[]} 
 * - amounts: {@link BigInt[]} 
 */
export const batchTransferSendAndConfirm = async (
  args: Omit<BatchTransferArgs, "authority"> & {
    signers: {
      authority: web3.Signer,
    },
  },
  remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionSignature> => {
  const preInstructions: Array<web3.TransactionInstruction> = [];


  return batchTransferBuilder({
      ...args,
      authority: args.signers.authority.publicKey,
    }, remainingAccounts)
    .preInstructions(preInstructions)
    .signers([args.signers.authority])
    .rpc();
}

export type StakeSolForYieldArgs = {
  authority: web3.PublicKey;
  name: string;
  amount: bigint;
};

/**
 * ### Returns a {@link MethodsBuilder}
 * Accounts:
 * 0. `[signer]` authority: {@link PublicKey} 
 * 1. `[writable]` treasury: {@link Treasury} 
 *
 * Data:
 * - name: {@link string} 
 * - amount: {@link BigInt} 
 */
export const stakeSolForYieldBuilder = (
	args: StakeSolForYieldArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): MethodsBuilder<TreasuryManagement, never> => {
    const [treasuryPubkey] = pda.deriveTreasuryPDA({
        name: args.name,
    }, _program.programId);

  return _program
    .methods
    .stakeSolForYield(
      args.name,
      new BN(args.amount.toString()),
    )
    .accountsStrict({
      authority: args.authority,
      treasury: treasuryPubkey,
    })
    .remainingAccounts(remainingAccounts);
};

/**
 * ### Returns a {@link web3.TransactionInstruction}
 * Accounts:
 * 0. `[signer]` authority: {@link PublicKey} 
 * 1. `[writable]` treasury: {@link Treasury} 
 *
 * Data:
 * - name: {@link string} 
 * - amount: {@link BigInt} 
 */
export const stakeSolForYield = (
	args: StakeSolForYieldArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionInstruction> =>
    stakeSolForYieldBuilder(args, remainingAccounts).instruction();

/**
 * ### Returns a {@link web3.TransactionSignature}
 * Accounts:
 * 0. `[signer]` authority: {@link PublicKey} 
 * 1. `[writable]` treasury: {@link Treasury} 
 *
 * Data:
 * - name: {@link string} 
 * - amount: {@link BigInt} 
 */
export const stakeSolForYieldSendAndConfirm = async (
  args: Omit<StakeSolForYieldArgs, "authority"> & {
    signers: {
      authority: web3.Signer,
    },
  },
  remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionSignature> => {
  const preInstructions: Array<web3.TransactionInstruction> = [];


  return stakeSolForYieldBuilder({
      ...args,
      authority: args.signers.authority.publicKey,
    }, remainingAccounts)
    .preInstructions(preInstructions)
    .signers([args.signers.authority])
    .rpc();
}

export type UnstakeSolArgs = {
  authority: web3.PublicKey;
  name: string;
  amount: bigint;
};

/**
 * ### Returns a {@link MethodsBuilder}
 * Accounts:
 * 0. `[signer]` authority: {@link PublicKey} 
 * 1. `[writable]` treasury: {@link Treasury} 
 *
 * Data:
 * - name: {@link string} 
 * - amount: {@link BigInt} 
 */
export const unstakeSolBuilder = (
	args: UnstakeSolArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): MethodsBuilder<TreasuryManagement, never> => {
    const [treasuryPubkey] = pda.deriveTreasuryPDA({
        name: args.name,
    }, _program.programId);

  return _program
    .methods
    .unstakeSol(
      args.name,
      new BN(args.amount.toString()),
    )
    .accountsStrict({
      authority: args.authority,
      treasury: treasuryPubkey,
    })
    .remainingAccounts(remainingAccounts);
};

/**
 * ### Returns a {@link web3.TransactionInstruction}
 * Accounts:
 * 0. `[signer]` authority: {@link PublicKey} 
 * 1. `[writable]` treasury: {@link Treasury} 
 *
 * Data:
 * - name: {@link string} 
 * - amount: {@link BigInt} 
 */
export const unstakeSol = (
	args: UnstakeSolArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionInstruction> =>
    unstakeSolBuilder(args, remainingAccounts).instruction();

/**
 * ### Returns a {@link web3.TransactionSignature}
 * Accounts:
 * 0. `[signer]` authority: {@link PublicKey} 
 * 1. `[writable]` treasury: {@link Treasury} 
 *
 * Data:
 * - name: {@link string} 
 * - amount: {@link BigInt} 
 */
export const unstakeSolSendAndConfirm = async (
  args: Omit<UnstakeSolArgs, "authority"> & {
    signers: {
      authority: web3.Signer,
    },
  },
  remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionSignature> => {
  const preInstructions: Array<web3.TransactionInstruction> = [];


  return unstakeSolBuilder({
      ...args,
      authority: args.signers.authority.publicKey,
    }, remainingAccounts)
    .preInstructions(preInstructions)
    .signers([args.signers.authority])
    .rpc();
}

export type CreateProposalArgs = {
  proposer: web3.PublicKey;
  name: string;
  id: bigint;
  title: string;
  description: string;
  amount: bigint;
  tokenMint: web3.PublicKey;
  recipient: web3.PublicKey;
};

/**
 * ### Returns a {@link MethodsBuilder}
 * Accounts:
 * 0. `[signer]` proposer: {@link PublicKey} 
 * 1. `[]` treasury: {@link Treasury} 
 * 2. `[writable]` proposal: {@link Proposal} 
 * 3. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 * - name: {@link string} 
 * - id: {@link BigInt} 
 * - title: {@link string} 
 * - description: {@link string} type
 * - amount: {@link BigInt} 
 * - token_mint: {@link PublicKey} 
 * - recipient: {@link PublicKey} 
 */
export const createProposalBuilder = (
	args: CreateProposalArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): MethodsBuilder<TreasuryManagement, never> => {
    const [treasuryPubkey] = pda.deriveTreasuryPDA({
        name: args.name,
    }, _program.programId);
    const [proposalPubkey] = pda.deriveProposalPDA({
        treasury: args.treasury,
        id: args.id,
    }, _program.programId);

  return _program
    .methods
    .createProposal(
      args.name,
      new BN(args.id.toString()),
      args.title,
      args.description,
      new BN(args.amount.toString()),
      args.tokenMint,
      args.recipient,
    )
    .accountsStrict({
      proposer: args.proposer,
      treasury: treasuryPubkey,
      proposal: proposalPubkey,
      systemProgram: new web3.PublicKey("11111111111111111111111111111111"),
    })
    .remainingAccounts(remainingAccounts);
};

/**
 * ### Returns a {@link web3.TransactionInstruction}
 * Accounts:
 * 0. `[signer]` proposer: {@link PublicKey} 
 * 1. `[]` treasury: {@link Treasury} 
 * 2. `[writable]` proposal: {@link Proposal} 
 * 3. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 * - name: {@link string} 
 * - id: {@link BigInt} 
 * - title: {@link string} 
 * - description: {@link string} type
 * - amount: {@link BigInt} 
 * - token_mint: {@link PublicKey} 
 * - recipient: {@link PublicKey} 
 */
export const createProposal = (
	args: CreateProposalArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionInstruction> =>
    createProposalBuilder(args, remainingAccounts).instruction();

/**
 * ### Returns a {@link web3.TransactionSignature}
 * Accounts:
 * 0. `[signer]` proposer: {@link PublicKey} 
 * 1. `[]` treasury: {@link Treasury} 
 * 2. `[writable]` proposal: {@link Proposal} 
 * 3. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 * - name: {@link string} 
 * - id: {@link BigInt} 
 * - title: {@link string} 
 * - description: {@link string} type
 * - amount: {@link BigInt} 
 * - token_mint: {@link PublicKey} 
 * - recipient: {@link PublicKey} 
 */
export const createProposalSendAndConfirm = async (
  args: Omit<CreateProposalArgs, "proposer"> & {
    signers: {
      proposer: web3.Signer,
    },
  },
  remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionSignature> => {
  const preInstructions: Array<web3.TransactionInstruction> = [];


  return createProposalBuilder({
      ...args,
      proposer: args.signers.proposer.publicKey,
    }, remainingAccounts)
    .preInstructions(preInstructions)
    .signers([args.signers.proposer])
    .rpc();
}

export type VoteOnProposalArgs = {
  voter: web3.PublicKey;
  name: string;
  id: bigint;
  voteFor: boolean;
};

/**
 * ### Returns a {@link MethodsBuilder}
 * Accounts:
 * 0. `[signer]` voter: {@link PublicKey} 
 * 1. `[]` treasury: {@link Treasury} 
 * 2. `[writable]` proposal: {@link Proposal} 
 *
 * Data:
 * - name: {@link string} 
 * - id: {@link BigInt} 
 * - vote_for: {@link boolean} 
 */
export const voteOnProposalBuilder = (
	args: VoteOnProposalArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): MethodsBuilder<TreasuryManagement, never> => {
    const [treasuryPubkey] = pda.deriveTreasuryPDA({
        name: args.name,
    }, _program.programId);
    const [proposalPubkey] = pda.deriveProposalPDA({
        treasury: args.treasury,
        id: args.id,
    }, _program.programId);

  return _program
    .methods
    .voteOnProposal(
      args.name,
      new BN(args.id.toString()),
      args.voteFor,
    )
    .accountsStrict({
      voter: args.voter,
      treasury: treasuryPubkey,
      proposal: proposalPubkey,
    })
    .remainingAccounts(remainingAccounts);
};

/**
 * ### Returns a {@link web3.TransactionInstruction}
 * Accounts:
 * 0. `[signer]` voter: {@link PublicKey} 
 * 1. `[]` treasury: {@link Treasury} 
 * 2. `[writable]` proposal: {@link Proposal} 
 *
 * Data:
 * - name: {@link string} 
 * - id: {@link BigInt} 
 * - vote_for: {@link boolean} 
 */
export const voteOnProposal = (
	args: VoteOnProposalArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionInstruction> =>
    voteOnProposalBuilder(args, remainingAccounts).instruction();

/**
 * ### Returns a {@link web3.TransactionSignature}
 * Accounts:
 * 0. `[signer]` voter: {@link PublicKey} 
 * 1. `[]` treasury: {@link Treasury} 
 * 2. `[writable]` proposal: {@link Proposal} 
 *
 * Data:
 * - name: {@link string} 
 * - id: {@link BigInt} 
 * - vote_for: {@link boolean} 
 */
export const voteOnProposalSendAndConfirm = async (
  args: Omit<VoteOnProposalArgs, "voter"> & {
    signers: {
      voter: web3.Signer,
    },
  },
  remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionSignature> => {
  const preInstructions: Array<web3.TransactionInstruction> = [];


  return voteOnProposalBuilder({
      ...args,
      voter: args.signers.voter.publicKey,
    }, remainingAccounts)
    .preInstructions(preInstructions)
    .signers([args.signers.voter])
    .rpc();
}

export type ExecuteProposalArgs = {
  executor: web3.PublicKey;
  tokenMint: web3.PublicKey;
  source: web3.PublicKey;
  destination: web3.PublicKey;
  authority: web3.PublicKey;
  name: string;
  id: bigint;
};

/**
 * ### Returns a {@link MethodsBuilder}
 * Accounts:
 * 0. `[signer]` executor: {@link PublicKey} 
 * 1. `[writable]` treasury: {@link Treasury} 
 * 2. `[writable]` proposal: {@link Proposal} 
 * 3. `[]` token_mint: {@link Mint} 
 * 4. `[writable]` source: {@link PublicKey} The source account.
 * 5. `[writable]` destination: {@link PublicKey} The destination account.
 * 6. `[signer]` authority: {@link PublicKey} The source account's owner/delegate.
 * 7. `[]` csl_spl_token_v0_0_0: {@link PublicKey} Auto-generated, CslSplTokenProgram v0.0.0
 *
 * Data:
 * - name: {@link string} 
 * - id: {@link BigInt} 
 */
export const executeProposalBuilder = (
	args: ExecuteProposalArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): MethodsBuilder<TreasuryManagement, never> => {
    const [treasuryPubkey] = pda.deriveTreasuryPDA({
        name: args.name,
    }, _program.programId);
    const [proposalPubkey] = pda.deriveProposalPDA({
        treasury: args.treasury,
        id: args.id,
    }, _program.programId);

  return _program
    .methods
    .executeProposal(
      args.name,
      new BN(args.id.toString()),
    )
    .accountsStrict({
      executor: args.executor,
      treasury: treasuryPubkey,
      proposal: proposalPubkey,
      tokenMint: args.tokenMint,
      source: args.source,
      destination: args.destination,
      authority: args.authority,
      cslSplTokenV000: new web3.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
    })
    .remainingAccounts(remainingAccounts);
};

/**
 * ### Returns a {@link web3.TransactionInstruction}
 * Accounts:
 * 0. `[signer]` executor: {@link PublicKey} 
 * 1. `[writable]` treasury: {@link Treasury} 
 * 2. `[writable]` proposal: {@link Proposal} 
 * 3. `[]` token_mint: {@link Mint} 
 * 4. `[writable]` source: {@link PublicKey} The source account.
 * 5. `[writable]` destination: {@link PublicKey} The destination account.
 * 6. `[signer]` authority: {@link PublicKey} The source account's owner/delegate.
 * 7. `[]` csl_spl_token_v0_0_0: {@link PublicKey} Auto-generated, CslSplTokenProgram v0.0.0
 *
 * Data:
 * - name: {@link string} 
 * - id: {@link BigInt} 
 */
export const executeProposal = (
	args: ExecuteProposalArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionInstruction> =>
    executeProposalBuilder(args, remainingAccounts).instruction();

/**
 * ### Returns a {@link web3.TransactionSignature}
 * Accounts:
 * 0. `[signer]` executor: {@link PublicKey} 
 * 1. `[writable]` treasury: {@link Treasury} 
 * 2. `[writable]` proposal: {@link Proposal} 
 * 3. `[]` token_mint: {@link Mint} 
 * 4. `[writable]` source: {@link PublicKey} The source account.
 * 5. `[writable]` destination: {@link PublicKey} The destination account.
 * 6. `[signer]` authority: {@link PublicKey} The source account's owner/delegate.
 * 7. `[]` csl_spl_token_v0_0_0: {@link PublicKey} Auto-generated, CslSplTokenProgram v0.0.0
 *
 * Data:
 * - name: {@link string} 
 * - id: {@link BigInt} 
 */
export const executeProposalSendAndConfirm = async (
  args: Omit<ExecuteProposalArgs, "executor" | "authority"> & {
    signers: {
      executor: web3.Signer,
      authority: web3.Signer,
    },
  },
  remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionSignature> => {
  const preInstructions: Array<web3.TransactionInstruction> = [];


  return executeProposalBuilder({
      ...args,
      executor: args.signers.executor.publicKey,
      authority: args.signers.authority.publicKey,
    }, remainingAccounts)
    .preInstructions(preInstructions)
    .signers([args.signers.executor, args.signers.authority])
    .rpc();
}

export type EmergencyPauseArgs = {
  authority: web3.PublicKey;
  name: string;
};

/**
 * ### Returns a {@link MethodsBuilder}
 * Accounts:
 * 0. `[signer]` authority: {@link PublicKey} 
 * 1. `[writable]` treasury: {@link Treasury} 
 *
 * Data:
 * - name: {@link string} 
 */
export const emergencyPauseBuilder = (
	args: EmergencyPauseArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): MethodsBuilder<TreasuryManagement, never> => {
    const [treasuryPubkey] = pda.deriveTreasuryPDA({
        name: args.name,
    }, _program.programId);

  return _program
    .methods
    .emergencyPause(
      args.name,
    )
    .accountsStrict({
      authority: args.authority,
      treasury: treasuryPubkey,
    })
    .remainingAccounts(remainingAccounts);
};

/**
 * ### Returns a {@link web3.TransactionInstruction}
 * Accounts:
 * 0. `[signer]` authority: {@link PublicKey} 
 * 1. `[writable]` treasury: {@link Treasury} 
 *
 * Data:
 * - name: {@link string} 
 */
export const emergencyPause = (
	args: EmergencyPauseArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionInstruction> =>
    emergencyPauseBuilder(args, remainingAccounts).instruction();

/**
 * ### Returns a {@link web3.TransactionSignature}
 * Accounts:
 * 0. `[signer]` authority: {@link PublicKey} 
 * 1. `[writable]` treasury: {@link Treasury} 
 *
 * Data:
 * - name: {@link string} 
 */
export const emergencyPauseSendAndConfirm = async (
  args: Omit<EmergencyPauseArgs, "authority"> & {
    signers: {
      authority: web3.Signer,
    },
  },
  remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionSignature> => {
  const preInstructions: Array<web3.TransactionInstruction> = [];


  return emergencyPauseBuilder({
      ...args,
      authority: args.signers.authority.publicKey,
    }, remainingAccounts)
    .preInstructions(preInstructions)
    .signers([args.signers.authority])
    .rpc();
}

export type ResumeOperationsArgs = {
  authority: web3.PublicKey;
  name: string;
};

/**
 * ### Returns a {@link MethodsBuilder}
 * Accounts:
 * 0. `[signer]` authority: {@link PublicKey} 
 * 1. `[writable]` treasury: {@link Treasury} 
 *
 * Data:
 * - name: {@link string} 
 */
export const resumeOperationsBuilder = (
	args: ResumeOperationsArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): MethodsBuilder<TreasuryManagement, never> => {
    const [treasuryPubkey] = pda.deriveTreasuryPDA({
        name: args.name,
    }, _program.programId);

  return _program
    .methods
    .resumeOperations(
      args.name,
    )
    .accountsStrict({
      authority: args.authority,
      treasury: treasuryPubkey,
    })
    .remainingAccounts(remainingAccounts);
};

/**
 * ### Returns a {@link web3.TransactionInstruction}
 * Accounts:
 * 0. `[signer]` authority: {@link PublicKey} 
 * 1. `[writable]` treasury: {@link Treasury} 
 *
 * Data:
 * - name: {@link string} 
 */
export const resumeOperations = (
	args: ResumeOperationsArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionInstruction> =>
    resumeOperationsBuilder(args, remainingAccounts).instruction();

/**
 * ### Returns a {@link web3.TransactionSignature}
 * Accounts:
 * 0. `[signer]` authority: {@link PublicKey} 
 * 1. `[writable]` treasury: {@link Treasury} 
 *
 * Data:
 * - name: {@link string} 
 */
export const resumeOperationsSendAndConfirm = async (
  args: Omit<ResumeOperationsArgs, "authority"> & {
    signers: {
      authority: web3.Signer,
    },
  },
  remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionSignature> => {
  const preInstructions: Array<web3.TransactionInstruction> = [];


  return resumeOperationsBuilder({
      ...args,
      authority: args.signers.authority.publicKey,
    }, remainingAccounts)
    .preInstructions(preInstructions)
    .signers([args.signers.authority])
    .rpc();
}

export type AddWhitelistRecipientArgs = {
  authority: web3.PublicKey;
  name: string;
  recipient: web3.PublicKey;
  label: string;
};

/**
 * ### Returns a {@link MethodsBuilder}
 * Accounts:
 * 0. `[signer]` authority: {@link PublicKey} 
 * 1. `[]` treasury: {@link Treasury} 
 * 2. `[writable]` whitelist_entry: {@link WhitelistedRecipient} 
 * 3. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 * - name: {@link string} 
 * - recipient: {@link PublicKey} 
 * - label: {@link string} 
 */
export const addWhitelistRecipientBuilder = (
	args: AddWhitelistRecipientArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): MethodsBuilder<TreasuryManagement, never> => {
    const [treasuryPubkey] = pda.deriveTreasuryPDA({
        name: args.name,
    }, _program.programId);
    const [whitelistEntryPubkey] = pda.deriveWhitelistedRecipientPDA({
        treasury: args.treasury,
        recipient: args.recipient,
    }, _program.programId);

  return _program
    .methods
    .addWhitelistRecipient(
      args.name,
      args.recipient,
      args.label,
    )
    .accountsStrict({
      authority: args.authority,
      treasury: treasuryPubkey,
      whitelistEntry: whitelistEntryPubkey,
      systemProgram: new web3.PublicKey("11111111111111111111111111111111"),
    })
    .remainingAccounts(remainingAccounts);
};

/**
 * ### Returns a {@link web3.TransactionInstruction}
 * Accounts:
 * 0. `[signer]` authority: {@link PublicKey} 
 * 1. `[]` treasury: {@link Treasury} 
 * 2. `[writable]` whitelist_entry: {@link WhitelistedRecipient} 
 * 3. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 * - name: {@link string} 
 * - recipient: {@link PublicKey} 
 * - label: {@link string} 
 */
export const addWhitelistRecipient = (
	args: AddWhitelistRecipientArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionInstruction> =>
    addWhitelistRecipientBuilder(args, remainingAccounts).instruction();

/**
 * ### Returns a {@link web3.TransactionSignature}
 * Accounts:
 * 0. `[signer]` authority: {@link PublicKey} 
 * 1. `[]` treasury: {@link Treasury} 
 * 2. `[writable]` whitelist_entry: {@link WhitelistedRecipient} 
 * 3. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 * - name: {@link string} 
 * - recipient: {@link PublicKey} 
 * - label: {@link string} 
 */
export const addWhitelistRecipientSendAndConfirm = async (
  args: Omit<AddWhitelistRecipientArgs, "authority"> & {
    signers: {
      authority: web3.Signer,
    },
  },
  remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionSignature> => {
  const preInstructions: Array<web3.TransactionInstruction> = [];


  return addWhitelistRecipientBuilder({
      ...args,
      authority: args.signers.authority.publicKey,
    }, remainingAccounts)
    .preInstructions(preInstructions)
    .signers([args.signers.authority])
    .rpc();
}

export type RemoveWhitelistRecipientArgs = {
  authority: web3.PublicKey;
  name: string;
  recipient: web3.PublicKey;
};

/**
 * ### Returns a {@link MethodsBuilder}
 * Accounts:
 * 0. `[signer]` authority: {@link PublicKey} 
 * 1. `[]` treasury: {@link Treasury} 
 * 2. `[writable]` whitelist_entry: {@link WhitelistedRecipient} 
 *
 * Data:
 * - name: {@link string} 
 * - recipient: {@link PublicKey} 
 */
export const removeWhitelistRecipientBuilder = (
	args: RemoveWhitelistRecipientArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): MethodsBuilder<TreasuryManagement, never> => {
    const [treasuryPubkey] = pda.deriveTreasuryPDA({
        name: args.name,
    }, _program.programId);
    const [whitelistEntryPubkey] = pda.deriveWhitelistedRecipientPDA({
        treasury: args.treasury,
        recipient: args.recipient,
    }, _program.programId);

  return _program
    .methods
    .removeWhitelistRecipient(
      args.name,
      args.recipient,
    )
    .accountsStrict({
      authority: args.authority,
      treasury: treasuryPubkey,
      whitelistEntry: whitelistEntryPubkey,
    })
    .remainingAccounts(remainingAccounts);
};

/**
 * ### Returns a {@link web3.TransactionInstruction}
 * Accounts:
 * 0. `[signer]` authority: {@link PublicKey} 
 * 1. `[]` treasury: {@link Treasury} 
 * 2. `[writable]` whitelist_entry: {@link WhitelistedRecipient} 
 *
 * Data:
 * - name: {@link string} 
 * - recipient: {@link PublicKey} 
 */
export const removeWhitelistRecipient = (
	args: RemoveWhitelistRecipientArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionInstruction> =>
    removeWhitelistRecipientBuilder(args, remainingAccounts).instruction();

/**
 * ### Returns a {@link web3.TransactionSignature}
 * Accounts:
 * 0. `[signer]` authority: {@link PublicKey} 
 * 1. `[]` treasury: {@link Treasury} 
 * 2. `[writable]` whitelist_entry: {@link WhitelistedRecipient} 
 *
 * Data:
 * - name: {@link string} 
 * - recipient: {@link PublicKey} 
 */
export const removeWhitelistRecipientSendAndConfirm = async (
  args: Omit<RemoveWhitelistRecipientArgs, "authority"> & {
    signers: {
      authority: web3.Signer,
    },
  },
  remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionSignature> => {
  const preInstructions: Array<web3.TransactionInstruction> = [];


  return removeWhitelistRecipientBuilder({
      ...args,
      authority: args.signers.authority.publicKey,
    }, remainingAccounts)
    .preInstructions(preInstructions)
    .signers([args.signers.authority])
    .rpc();
}

// Getters

export const getRole = (
    publicKey: web3.PublicKey,
    commitment?: web3.Commitment
): Promise<IdlAccounts<TreasuryManagement>["role"]> => _program.account.role.fetch(publicKey, commitment);

export const getTreasury = (
    publicKey: web3.PublicKey,
    commitment?: web3.Commitment
): Promise<IdlAccounts<TreasuryManagement>["treasury"]> => _program.account.treasury.fetch(publicKey, commitment);

export const getPaymentStream = (
    publicKey: web3.PublicKey,
    commitment?: web3.Commitment
): Promise<IdlAccounts<TreasuryManagement>["paymentStream"]> => _program.account.paymentStream.fetch(publicKey, commitment);

export const getMilestonePayment = (
    publicKey: web3.PublicKey,
    commitment?: web3.Commitment
): Promise<IdlAccounts<TreasuryManagement>["milestonePayment"]> => _program.account.milestonePayment.fetch(publicKey, commitment);

export const getRecurringPayment = (
    publicKey: web3.PublicKey,
    commitment?: web3.Commitment
): Promise<IdlAccounts<TreasuryManagement>["recurringPayment"]> => _program.account.recurringPayment.fetch(publicKey, commitment);

export const getProposal = (
    publicKey: web3.PublicKey,
    commitment?: web3.Commitment
): Promise<IdlAccounts<TreasuryManagement>["proposal"]> => _program.account.proposal.fetch(publicKey, commitment);

export const getWhitelistedRecipient = (
    publicKey: web3.PublicKey,
    commitment?: web3.Commitment
): Promise<IdlAccounts<TreasuryManagement>["whitelistedRecipient"]> => _program.account.whitelistedRecipient.fetch(publicKey, commitment);
export module CslSplTokenGetters {
    export const getMint = (
        publicKey: web3.PublicKey,
        commitment?: web3.Commitment
    ): Promise<IdlAccounts<CslSplToken>["mint"]> => _programCslSplToken.account.mint.fetch(publicKey, commitment);
    
    export const getAccount = (
        publicKey: web3.PublicKey,
        commitment?: web3.Commitment
    ): Promise<IdlAccounts<CslSplToken>["account"]> => _programCslSplToken.account.account.fetch(publicKey, commitment);
}

