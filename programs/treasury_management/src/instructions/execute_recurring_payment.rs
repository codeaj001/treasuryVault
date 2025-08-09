use crate::*;
use anchor_lang::prelude::*;
use std::str::FromStr;

use anchor_spl::{
    associated_token::AssociatedToken,
    token::{Mint, Token, TokenAccount},
};




	#[derive(Accounts)]
	#[instruction(
		name: String,
		recipient: Pubkey,
	)]
	pub struct ExecuteRecurringPayment<'info> {
		pub executor: Signer<'info>,

		#[account(
			mut,
			seeds = [
				b"treasury",
				name.as_bytes().as_ref(),
			],
			bump,
		)]
		pub treasury: Account<'info, Treasury>,

		#[account(
			mut,
			seeds = [
				b"recurring",
				treasury.key().as_ref(),
				recipient.as_ref(),
			],
			bump,
		)]
		pub recurring_payment: Account<'info, RecurringPayment>,

		pub token_mint: Account<'info, Mint>,

		#[account(
			mut,
		)]
		/// CHECK: implement manual checks if needed
		pub source: UncheckedAccount<'info>,

		#[account(
			mut,
		)]
		/// CHECK: implement manual checks if needed
		pub destination: UncheckedAccount<'info>,

		#[account(
			owner=Pubkey::from_str("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA").unwrap(),
		)]
		pub authority: Signer<'info>,

		pub csl_spl_token_v0_0_0: Program<'info, Token>,
	}

	impl<'info> ExecuteRecurringPayment<'info> {
		pub fn cpi_csl_spl_token_transfer(&self, amount: u64) -> Result<()> {
			anchor_spl::token::transfer(
				CpiContext::new(self.csl_spl_token_v0_0_0.to_account_info(), 
					anchor_spl::token::Transfer {
						from: self.source.to_account_info(),
						to: self.destination.to_account_info(),
						authority: self.authority.to_account_info()
					}
				),
				amount, 
			)
		}
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
pub fn handler(
	ctx: Context<ExecuteRecurringPayment>,
	name: String,
	recipient: Pubkey,
) -> Result<()> {
    // Implement your business logic here...
	
	// Cpi calls wrappers
	ctx.accounts.cpi_csl_spl_token_transfer(
		Default::default(),
	)?;

	Ok(())
}
