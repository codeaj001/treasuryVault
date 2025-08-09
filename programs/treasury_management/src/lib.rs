
pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;
use std::str::FromStr;

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("DpZR1A4fteZqrprxno4r32mE3KWK36ysonGjnxr4KYRi");

#[program]
pub mod treasury_management {
    use super::*;

/// Accounts:
/// 0. `[signer]` authority: [AccountInfo] 
/// 1. `[writable]` treasury: [Treasury] 
/// 2. `[]` system_program: [AccountInfo] Auto-generated, for account initialization
///
/// Data:
/// - name: [String] 
/// - signers: [Vec<Pubkey>] 
/// - threshold: [u8] 
/// - admin_limit: [u64] 
/// - treasurer_limit: [u64] 
/// - contributor_limit: [u64] 
/// - reset_period: [u64] 
/// - auto_stake: [bool] 
/// - stake_target_percentage: [u8] 
	pub fn initialize_treasury(ctx: Context<InitializeTreasury>, name: String, signers: Vec<Pubkey>, threshold: u8, admin_limit: u64, treasurer_limit: u64, contributor_limit: u64, reset_period: u64, auto_stake: bool, stake_target_percentage: u8) -> Result<()> {
		initialize_treasury::handler(ctx, name, signers, threshold, admin_limit, treasurer_limit, contributor_limit, reset_period, auto_stake, stake_target_percentage)
	}

/// Accounts:
/// 0. `[signer]` authority: [AccountInfo] 
/// 1. `[writable]` treasury: [Treasury] 
///
/// Data:
/// - name: [String] 
/// - new_signers: [Vec<Pubkey>] 
/// - new_threshold: [u8] 
/// - admin_limit: [u64] 
/// - treasurer_limit: [u64] 
/// - contributor_limit: [u64] 
/// - reset_period: [u64] 
/// - auto_stake: [bool] 
/// - stake_target_percentage: [u8] 
	pub fn update_treasury_config(ctx: Context<UpdateTreasuryConfig>, name: String, new_signers: Vec<Pubkey>, new_threshold: u8, admin_limit: u64, treasurer_limit: u64, contributor_limit: u64, reset_period: u64, auto_stake: bool, stake_target_percentage: u8) -> Result<()> {
		update_treasury_config::handler(ctx, name, new_signers, new_threshold, admin_limit, treasurer_limit, contributor_limit, reset_period, auto_stake, stake_target_percentage)
	}

/// Accounts:
/// 0. `[signer]` depositor: [AccountInfo] 
/// 1. `[writable]` treasury: [Treasury] 
/// 2. `[]` token_mint: [Mint] 
/// 3. `[writable]` source: [AccountInfo] The source account.
/// 4. `[writable]` destination: [AccountInfo] The destination account.
/// 5. `[signer]` authority: [AccountInfo] The source account's owner/delegate.
/// 6. `[]` csl_spl_token_v0_0_0: [AccountInfo] Auto-generated, CslSplTokenProgram v0.0.0
///
/// Data:
/// - name: [String] 
/// - amount: [u64] 
	pub fn deposit_tokens(ctx: Context<DepositTokens>, name: String, amount: u64) -> Result<()> {
		deposit_tokens::handler(ctx, name, amount)
	}

/// Accounts:
/// 0. `[writable, signer]` depositor: [AccountInfo] 
/// 1. `[writable]` treasury: [Treasury] 
///
/// Data:
/// - name: [String] 
/// - amount: [u64] 
	pub fn deposit_sol(ctx: Context<DepositSol>, name: String, amount: u64) -> Result<()> {
		deposit_sol::handler(ctx, name, amount)
	}

/// Accounts:
/// 0. `[signer]` authority: [AccountInfo] 
/// 1. `[writable]` treasury: [Treasury] 
/// 2. `[]` token_mint: [Mint] 
/// 3. `[]` recipient: [AccountInfo] 
/// 4. `[writable]` source: [AccountInfo] The source account.
/// 5. `[writable]` destination: [AccountInfo] The destination account.
/// 6. `[]` csl_spl_token_v0_0_0: [AccountInfo] Auto-generated, CslSplTokenProgram v0.0.0
///
/// Data:
/// - name: [String] 
/// - amount: [u64] 
	pub fn withdraw_tokens(ctx: Context<WithdrawTokens>, name: String, amount: u64) -> Result<()> {
		withdraw_tokens::handler(ctx, name, amount)
	}

/// Accounts:
/// 0. `[signer]` authority: [AccountInfo] 
/// 1. `[writable]` treasury: [Treasury] 
/// 2. `[writable]` recipient: [AccountInfo] 
///
/// Data:
/// - name: [String] 
/// - amount: [u64] 
	pub fn withdraw_sol(ctx: Context<WithdrawSol>, name: String, amount: u64) -> Result<()> {
		withdraw_sol::handler(ctx, name, amount)
	}

/// Accounts:
/// 0. `[signer]` authority: [AccountInfo] 
/// 1. `[]` treasury: [Treasury] 
///
/// Data:
/// - name: [String] 
/// - user: [Pubkey] 
/// - role_type: [u8] 
/// - can_execute_payments: [bool] 
/// - can_create_streams: [bool] 
/// - can_manage_roles: [bool] 
/// - can_view_treasury: [bool] 
/// - can_propose: [bool] 
/// - can_vote: [bool] 
	pub fn assign_role(ctx: Context<AssignRole>, name: String, user: Pubkey, role_type: u8, can_execute_payments: bool, can_create_streams: bool, can_manage_roles: bool, can_view_treasury: bool, can_propose: bool, can_vote: bool) -> Result<()> {
		assign_role::handler(ctx, name, user, role_type, can_execute_payments, can_create_streams, can_manage_roles, can_view_treasury, can_propose, can_vote)
	}

/// Accounts:
/// 0. `[signer]` authority: [AccountInfo] 
/// 1. `[]` treasury: [Treasury] 
///
/// Data:
/// - name: [String] 
/// - user: [Pubkey] 
	pub fn remove_role(ctx: Context<RemoveRole>, name: String, user: Pubkey) -> Result<()> {
		remove_role::handler(ctx, name, user)
	}

/// Accounts:
/// 0. `[signer]` authority: [AccountInfo] 
/// 1. `[]` treasury: [Treasury] 
/// 2. `[writable]` payment_stream: [PaymentStream] 
/// 3. `[]` system_program: [AccountInfo] Auto-generated, for account initialization
///
/// Data:
/// - name: [String] 
/// - recipient: [Pubkey] 
/// - token_mint: [Pubkey] 
/// - amount_per_period: [u64] 
/// - period_duration: [i64] 
/// - start_time: [i64] 
/// - end_time: [i64] 
/// - category: [u8] 
	pub fn create_payment_stream(ctx: Context<CreatePaymentStream>, name: String, recipient: Pubkey, token_mint: Pubkey, amount_per_period: u64, period_duration: i64, start_time: i64, end_time: i64, category: u8) -> Result<()> {
		create_payment_stream::handler(ctx, name, recipient, token_mint, amount_per_period, period_duration, start_time, end_time, category)
	}

/// Accounts:
/// 0. `[signer]` executor: [AccountInfo] 
/// 1. `[writable]` treasury: [Treasury] 
/// 2. `[writable]` payment_stream: [PaymentStream] 
/// 3. `[]` token_mint: [Mint] 
/// 4. `[writable]` source: [AccountInfo] The source account.
/// 5. `[writable]` destination: [AccountInfo] The destination account.
/// 6. `[signer]` authority: [AccountInfo] The source account's owner/delegate.
/// 7. `[]` csl_spl_token_v0_0_0: [AccountInfo] Auto-generated, CslSplTokenProgram v0.0.0
///
/// Data:
/// - name: [String] 
/// - recipient: [Pubkey] 
	pub fn execute_stream_payment(ctx: Context<ExecuteStreamPayment>, name: String, recipient: Pubkey) -> Result<()> {
		execute_stream_payment::handler(ctx, name, recipient)
	}

/// Accounts:
/// 0. `[signer]` authority: [AccountInfo] 
/// 1. `[]` treasury: [Treasury] 
/// 2. `[writable]` payment_stream: [PaymentStream] 
///
/// Data:
/// - name: [String] 
/// - recipient: [Pubkey] 
	pub fn cancel_payment_stream(ctx: Context<CancelPaymentStream>, name: String, recipient: Pubkey) -> Result<()> {
		cancel_payment_stream::handler(ctx, name, recipient)
	}

/// Accounts:
/// 0. `[signer]` authority: [AccountInfo] 
/// 1. `[]` treasury: [Treasury] 
/// 2. `[writable]` milestone_payment: [MilestonePayment] 
/// 3. `[]` system_program: [AccountInfo] Auto-generated, for account initialization
///
/// Data:
/// - name: [String] 
/// - id: [u64] 
/// - recipient: [Pubkey] 
/// - token_mint: [Pubkey] 
/// - amount: [u64] 
/// - description: [String] type
/// - category: [u8] 
	pub fn create_milestone_payment(ctx: Context<CreateMilestonePayment>, name: String, id: u64, recipient: Pubkey, token_mint: Pubkey, amount: u64, description: String, category: u8) -> Result<()> {
		create_milestone_payment::handler(ctx, name, id, recipient, token_mint, amount, description, category)
	}

/// Accounts:
/// 0. `[signer]` authority: [AccountInfo] 
/// 1. `[writable]` treasury: [Treasury] 
/// 2. `[writable]` milestone_payment: [MilestonePayment] 
/// 3. `[]` token_mint: [Mint] 
/// 4. `[writable]` source: [AccountInfo] The source account.
/// 5. `[writable]` destination: [AccountInfo] The destination account.
/// 6. `[]` csl_spl_token_v0_0_0: [AccountInfo] Auto-generated, CslSplTokenProgram v0.0.0
///
/// Data:
/// - name: [String] 
/// - id: [u64] 
	pub fn complete_milestone(ctx: Context<CompleteMilestone>, name: String, id: u64) -> Result<()> {
		complete_milestone::handler(ctx, name, id)
	}

/// Accounts:
/// 0. `[signer]` authority: [AccountInfo] 
/// 1. `[]` treasury: [Treasury] 
/// 2. `[writable]` recurring_payment: [RecurringPayment] 
/// 3. `[]` system_program: [AccountInfo] Auto-generated, for account initialization
///
/// Data:
/// - name: [String] 
/// - recipient: [Pubkey] 
/// - token_mint: [Pubkey] 
/// - amount: [u64] 
/// - interval: [i64] 
/// - category: [u8] 
	pub fn create_recurring_payment(ctx: Context<CreateRecurringPayment>, name: String, recipient: Pubkey, token_mint: Pubkey, amount: u64, interval: i64, category: u8) -> Result<()> {
		create_recurring_payment::handler(ctx, name, recipient, token_mint, amount, interval, category)
	}

/// Accounts:
/// 0. `[signer]` executor: [AccountInfo] 
/// 1. `[writable]` treasury: [Treasury] 
/// 2. `[writable]` recurring_payment: [RecurringPayment] 
/// 3. `[]` token_mint: [Mint] 
/// 4. `[writable]` source: [AccountInfo] The source account.
/// 5. `[writable]` destination: [AccountInfo] The destination account.
/// 6. `[signer]` authority: [AccountInfo] The source account's owner/delegate.
/// 7. `[]` csl_spl_token_v0_0_0: [AccountInfo] Auto-generated, CslSplTokenProgram v0.0.0
///
/// Data:
/// - name: [String] 
/// - recipient: [Pubkey] 
	pub fn execute_recurring_payment(ctx: Context<ExecuteRecurringPayment>, name: String, recipient: Pubkey) -> Result<()> {
		execute_recurring_payment::handler(ctx, name, recipient)
	}

/// Accounts:
/// 0. `[signer]` authority: [AccountInfo] 
/// 1. `[writable]` treasury: [Treasury] 
/// 2. `[]` token_mint: [Mint] 
/// 3. `[writable]` source: [AccountInfo] The source account.
/// 4. `[writable]` destination: [AccountInfo] The destination account.
/// 5. `[]` csl_spl_token_v0_0_0: [AccountInfo] Auto-generated, CslSplTokenProgram v0.0.0
///
/// Data:
/// - name: [String] 
/// - recipients: [Vec<Pubkey>] 
/// - amounts: [Vec<u64>] 
	pub fn batch_transfer(ctx: Context<BatchTransfer>, name: String, recipients: Vec<Pubkey>, amounts: Vec<u64>) -> Result<()> {
		batch_transfer::handler(ctx, name, recipients, amounts)
	}

/// Accounts:
/// 0. `[signer]` authority: [AccountInfo] 
/// 1. `[writable]` treasury: [Treasury] 
///
/// Data:
/// - name: [String] 
/// - amount: [u64] 
	pub fn stake_sol_for_yield(ctx: Context<StakeSolForYield>, name: String, amount: u64) -> Result<()> {
		stake_sol_for_yield::handler(ctx, name, amount)
	}

/// Accounts:
/// 0. `[signer]` authority: [AccountInfo] 
/// 1. `[writable]` treasury: [Treasury] 
///
/// Data:
/// - name: [String] 
/// - amount: [u64] 
	pub fn unstake_sol(ctx: Context<UnstakeSol>, name: String, amount: u64) -> Result<()> {
		unstake_sol::handler(ctx, name, amount)
	}

/// Accounts:
/// 0. `[signer]` proposer: [AccountInfo] 
/// 1. `[]` treasury: [Treasury] 
/// 2. `[writable]` proposal: [Proposal] 
/// 3. `[]` system_program: [AccountInfo] Auto-generated, for account initialization
///
/// Data:
/// - name: [String] 
/// - id: [u64] 
/// - title: [String] 
/// - description: [String] type
/// - amount: [u64] 
/// - token_mint: [Pubkey] 
/// - recipient: [Pubkey] 
	pub fn create_proposal(ctx: Context<CreateProposal>, name: String, id: u64, title: String, description: String, amount: u64, token_mint: Pubkey, recipient: Pubkey) -> Result<()> {
		create_proposal::handler(ctx, name, id, title, description, amount, token_mint, recipient)
	}

/// Accounts:
/// 0. `[signer]` voter: [AccountInfo] 
/// 1. `[]` treasury: [Treasury] 
/// 2. `[writable]` proposal: [Proposal] 
///
/// Data:
/// - name: [String] 
/// - id: [u64] 
/// - vote_for: [bool] 
	pub fn vote_on_proposal(ctx: Context<VoteOnProposal>, name: String, id: u64, vote_for: bool) -> Result<()> {
		vote_on_proposal::handler(ctx, name, id, vote_for)
	}

/// Accounts:
/// 0. `[signer]` executor: [AccountInfo] 
/// 1. `[writable]` treasury: [Treasury] 
/// 2. `[writable]` proposal: [Proposal] 
/// 3. `[]` token_mint: [Mint] 
/// 4. `[writable]` source: [AccountInfo] The source account.
/// 5. `[writable]` destination: [AccountInfo] The destination account.
/// 6. `[signer]` authority: [AccountInfo] The source account's owner/delegate.
/// 7. `[]` csl_spl_token_v0_0_0: [AccountInfo] Auto-generated, CslSplTokenProgram v0.0.0
///
/// Data:
/// - name: [String] 
/// - id: [u64] 
	pub fn execute_proposal(ctx: Context<ExecuteProposal>, name: String, id: u64) -> Result<()> {
		execute_proposal::handler(ctx, name, id)
	}

/// Accounts:
/// 0. `[signer]` authority: [AccountInfo] 
/// 1. `[writable]` treasury: [Treasury] 
///
/// Data:
/// - name: [String] 
	pub fn emergency_pause(ctx: Context<EmergencyPause>, name: String) -> Result<()> {
		emergency_pause::handler(ctx, name)
	}

/// Accounts:
/// 0. `[signer]` authority: [AccountInfo] 
/// 1. `[writable]` treasury: [Treasury] 
///
/// Data:
/// - name: [String] 
	pub fn resume_operations(ctx: Context<ResumeOperations>, name: String) -> Result<()> {
		resume_operations::handler(ctx, name)
	}

/// Accounts:
/// 0. `[signer]` authority: [AccountInfo] 
/// 1. `[]` treasury: [Treasury] 
/// 2. `[writable]` whitelist_entry: [WhitelistedRecipient] 
/// 3. `[]` system_program: [AccountInfo] Auto-generated, for account initialization
///
/// Data:
/// - name: [String] 
/// - recipient: [Pubkey] 
/// - label: [String] 
	pub fn add_whitelist_recipient(ctx: Context<AddWhitelistRecipient>, name: String, recipient: Pubkey, label: String) -> Result<()> {
		add_whitelist_recipient::handler(ctx, name, recipient, label)
	}

/// Accounts:
/// 0. `[signer]` authority: [AccountInfo] 
/// 1. `[]` treasury: [Treasury] 
/// 2. `[writable]` whitelist_entry: [WhitelistedRecipient] 
///
/// Data:
/// - name: [String] 
/// - recipient: [Pubkey] 
	pub fn remove_whitelist_recipient(ctx: Context<RemoveWhitelistRecipient>, name: String, recipient: Pubkey) -> Result<()> {
		remove_whitelist_recipient::handler(ctx, name, recipient)
	}



}
