import {PublicKey} from "@solana/web3.js";
import {BN} from "@coral-xyz/anchor";

export type TreasurySeeds = {
    name: string, 
};

export const deriveTreasuryPDA = (
    seeds: TreasurySeeds,
    programId: PublicKey
): [PublicKey, number] => {
    return PublicKey.findProgramAddressSync(
        [
            Buffer.from("treasury"),
            Buffer.from(seeds.name, "utf8"),
        ],
        programId,
    )
};

export type PaymentStreamSeeds = {
    treasury: PublicKey, 
    recipient: PublicKey, 
};

export const derivePaymentStreamPDA = (
    seeds: PaymentStreamSeeds,
    programId: PublicKey
): [PublicKey, number] => {
    return PublicKey.findProgramAddressSync(
        [
            Buffer.from("payment_stream"),
            seeds.treasury.toBuffer(),
            seeds.recipient.toBuffer(),
        ],
        programId,
    )
};

export type MilestonePaymentSeeds = {
    treasury: PublicKey, 
    id: bigint, 
};

export const deriveMilestonePaymentPDA = (
    seeds: MilestonePaymentSeeds,
    programId: PublicKey
): [PublicKey, number] => {
    return PublicKey.findProgramAddressSync(
        [
            Buffer.from("milestone"),
            seeds.treasury.toBuffer(),
            Buffer.from(BigUint64Array.from([seeds.id]).buffer),
        ],
        programId,
    )
};

export type RecurringPaymentSeeds = {
    treasury: PublicKey, 
    recipient: PublicKey, 
};

export const deriveRecurringPaymentPDA = (
    seeds: RecurringPaymentSeeds,
    programId: PublicKey
): [PublicKey, number] => {
    return PublicKey.findProgramAddressSync(
        [
            Buffer.from("recurring"),
            seeds.treasury.toBuffer(),
            seeds.recipient.toBuffer(),
        ],
        programId,
    )
};

export type ProposalSeeds = {
    treasury: PublicKey, 
    id: bigint, 
};

export const deriveProposalPDA = (
    seeds: ProposalSeeds,
    programId: PublicKey
): [PublicKey, number] => {
    return PublicKey.findProgramAddressSync(
        [
            Buffer.from("proposal"),
            seeds.treasury.toBuffer(),
            Buffer.from(BigUint64Array.from([seeds.id]).buffer),
        ],
        programId,
    )
};

export type WhitelistedRecipientSeeds = {
    treasury: PublicKey, 
    recipient: PublicKey, 
};

export const deriveWhitelistedRecipientPDA = (
    seeds: WhitelistedRecipientSeeds,
    programId: PublicKey
): [PublicKey, number] => {
    return PublicKey.findProgramAddressSync(
        [
            Buffer.from("whitelist"),
            seeds.treasury.toBuffer(),
            seeds.recipient.toBuffer(),
        ],
        programId,
    )
};

export module CslSplTokenPDAs {
    export type AccountSeeds = {
        wallet: PublicKey, 
        tokenProgram: PublicKey, 
        mint: PublicKey, 
    };
    
    export const deriveAccountPDA = (
        seeds: AccountSeeds,
        programId: PublicKey
    ): [PublicKey, number] => {
        return PublicKey.findProgramAddressSync(
            [
                seeds.wallet.toBuffer(),
                seeds.tokenProgram.toBuffer(),
                seeds.mint.toBuffer(),
            ],
            programId,
        )
    };
    
}

