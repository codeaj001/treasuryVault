
use anchor_lang::prelude::*;

#[account]
pub struct Role {
	pub role_type: u8,
	pub can_execute_payments: bool,
	pub can_create_streams: bool,
	pub can_manage_roles: bool,
	pub can_view_treasury: bool,
	pub can_propose: bool,
	pub can_vote: bool,
	pub spending_limit_used: u64,
	pub last_limit_reset: i64,
}
