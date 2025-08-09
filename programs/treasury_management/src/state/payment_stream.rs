
use anchor_lang::prelude::*;

#[account]
pub struct PaymentStream {
	pub treasury: Pubkey,
	pub recipient: Pubkey,
	pub token_mint: Pubkey,
	pub amount_per_period: u64,
	pub period_duration: i64,
	pub start_time: i64,
	pub end_time: i64,
	pub last_payment_time: i64,
	pub total_paid: u64,
	pub is_active: bool,
	pub category: u8,
	pub created_by: Pubkey,
}
