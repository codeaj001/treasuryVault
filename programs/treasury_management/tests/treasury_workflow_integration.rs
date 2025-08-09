pub mod common;

use std::str::FromStr;
use {
    common::{
        get_program_test,
        treasury_management_ix_interface,
    },
    solana_program_test::tokio,
    solana_sdk::{
        account::Account, pubkey::Pubkey, rent::Rent, signature::Keypair, signer::Signer, system_program,
        transaction::Transaction,
    },
};


#[tokio::test]
async fn treasury_workflow_integration_test() {
    let mut program_test = get_program_test();

    // PROGRAMS
    program_test.prefer_bpf(true);

    program_test.add_program(
        "csl_spl_token",
        Pubkey::from_str("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA").unwrap(),
        None,
    );

    // DATA
    let name = "Integration Test Treasury".to_string();
    let threshold: u8 = 2;
    let admin_limit: u64 = 1_000_000_000;
    let treasurer_limit: u64 = 500_000_000;
    let contributor_limit: u64 = 100_000_000;
    let reset_period: u64 = 604800; // Weekly
    let auto_stake: bool = true;
    let stake_target_percentage: u8 = 50;

    // KEYPAIR
    let admin_keypair = Keypair::new();
    let signer1_keypair = Keypair::new();
    let signer2_keypair = Keypair::new();
    let treasurer_keypair = Keypair::new();
    let contributor_keypair = Keypair::new();
    let recipient_keypair = Keypair::new();
    let token_mint_keypair = Keypair::new();

    // PUBKEY
    let admin_pubkey = admin_keypair.pubkey();
    let signer1_pubkey = signer1_keypair.pubkey();
    let signer2_pubkey = signer2_keypair.pubkey();
    let treasurer_pubkey = treasurer_keypair.pubkey();
    let contributor_pubkey = contributor_keypair.pubkey();
    let recipient_pubkey = recipient_keypair.pubkey();
    let token_mint_pubkey = token_mint_keypair.pubkey();

    // Create signers array
    let signers = vec![admin_pubkey, signer1_pubkey, signer2_pubkey];

    // EXECUTABLE PUBKEY
    let system_program_pubkey = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let token_program_pubkey = Pubkey::from_str("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA").unwrap();

    // PDA
    let (treasury_pda, _treasury_pda_bump) = Pubkey::find_program_address(
        &[
            b"treasury",
            name.as_bytes().as_ref(),
        ],
        &treasury_management::ID,
    );

    let (whitelist_entry_pda, _whitelist_entry_pda_bump) = Pubkey::find_program_address(
        &[
            b"whitelist",
            treasury_pda.as_ref(),
            recipient_pubkey.as_ref(),
        ],
        &treasury_management::ID,
    );

    let proposal_id: u64 = 1;
    let (proposal_pda, _proposal_pda_bump) = Pubkey::find_program_address(
        &[
            b"proposal",
            treasury_pda.as_ref(),
            proposal_id.to_le_bytes().as_ref(),
        ],
        &treasury_management::ID,
    );

    // ACCOUNT PROGRAM TEST SETUP
    program_test.add_account(
        admin_pubkey,
        Account {
            lamports: 1_000_000_000_000,
            data: vec![],
            owner: system_program::ID,
            executable: false,
            rent_epoch: 0,
        },
    );

    program_test.add_account(
        signer1_pubkey,
        Account {
            lamports: 1_000_000_000_000,
            data: vec![],
            owner: system_program::ID,
            executable: false,
            rent_epoch: 0,
        },
    );

    program_test.add_account(
        signer2_pubkey,
        Account {
            lamports: 1_000_000_000_000,
            data: vec![],
            owner: system_program::ID,
            executable: false,
            rent_epoch: 0,
        },
    );

    program_test.add_account(
        treasurer_pubkey,
        Account {
            lamports: 1_000_000_000_000,
            data: vec![],
            owner: system_program::ID,
            executable: false,
            rent_epoch: 0,
        },
    );

    program_test.add_account(
        contributor_pubkey,
        Account {
            lamports: 1_000_000_000_000,
            data: vec![],
            owner: system_program::ID,
            executable: false,
            rent_epoch: 0,
        },
    );

    // INSTRUCTIONS
    let (mut banks_client, _, recent_blockhash) = program_test.start().await;

    // Step 1: Initialize Treasury
    let ix_init = treasury_management_ix_interface::initialize_treasury_ix_setup(
        &admin_keypair,
        treasury_pda,
        system_program_pubkey,
        &name,
        &signers,
        threshold,
        admin_limit,
        treasurer_limit,
        contributor_limit,
        reset_period,
        auto_stake,
        stake_target_percentage,
        recent_blockhash,
    );

    let result = banks_client.process_transaction(ix_init).await;
    assert!(result.is_ok(), "Failed to initialize treasury: {:?}", result);

    // Step 2: Assign Treasurer Role
    let ix_assign_treasurer = treasury_management_ix_interface::assign_role_ix_setup(
        &admin_keypair,
        treasury_pda,
        &name,
        treasurer_pubkey,
        1, // Treasurer role
        true, // can_execute_payments
        true, // can_create_streams
        false, // can_manage_roles
        true, // can_view_treasury
        true, // can_propose
        true, // can_vote
        recent_blockhash,
    );

    let result = banks_client.process_transaction(ix_assign_treasurer).await;
    assert!(result.is_ok(), "Failed to assign treasurer role: {:?}", result);

    // Step 3: Assign Contributor Role
    let ix_assign_contributor = treasury_management_ix_interface::assign_role_ix_setup(
        &admin_keypair,
        treasury_pda,
        &name,
        contributor_pubkey,
        2, // Contributor role
        false, // can_execute_payments
        false, // can_create_streams
        false, // can_manage_roles
        true, // can_view_treasury
        true, // can_propose
        true, // can_vote
        recent_blockhash,
    );

    let result = banks_client.process_transaction(ix_assign_contributor).await;
    assert!(result.is_ok(), "Failed to assign contributor role: {:?}", result);

    // Step 4: Add Whitelist Recipient
    let ix_add_whitelist = treasury_management_ix_interface::add_whitelist_recipient_ix_setup(
        &admin_keypair,
        treasury_pda,
        whitelist_entry_pda,
        system_program_pubkey,
        &name,
        recipient_pubkey,
        "Trusted Developer",
        recent_blockhash,
    );

    let result = banks_client.process_transaction(ix_add_whitelist).await;
    assert!(result.is_ok(), "Failed to add whitelist recipient: {:?}", result);

    // Step 5: Create Proposal
    let ix_create_proposal = treasury_management_ix_interface::create_proposal_ix_setup(
        &contributor_keypair,
        treasury_pda,
        proposal_pda,
        system_program_pubkey,
        &name,
        proposal_id,
        "Fund Development",
        "Allocate funds for Q3 development work",
        5_000_000_000, // 5 SOL
        token_mint_pubkey,
        recipient_pubkey,
        recent_blockhash,
    );

    let result = banks_client.process_transaction(ix_create_proposal).await;
    assert!(result.is_ok(), "Failed to create proposal: {:?}", result);

    // Step 6: Vote on Proposal (Admin)
    let ix_vote_admin = treasury_management_ix_interface::vote_on_proposal_ix_setup(
        &admin_keypair,
        treasury_pda,
        proposal_pda,
        &name,
        proposal_id,
        true, // vote for
        recent_blockhash,
    );

    let result = banks_client.process_transaction(ix_vote_admin).await;
    assert!(result.is_ok(), "Failed to vote on proposal (admin): {:?}", result);

    // Step 7: Vote on Proposal (Treasurer)
    let ix_vote_treasurer = treasury_management_ix_interface::vote_on_proposal_ix_setup(
        &treasurer_keypair,
        treasury_pda,
        proposal_pda,
        &name,
        proposal_id,
        true, // vote for
        recent_blockhash,
    );

    let result = banks_client.process_transaction(ix_vote_treasurer).await;
    assert!(result.is_ok(), "Failed to vote on proposal (treasurer): {:?}", result);

    // Note: In a real integration test, we would also test:
    // - Execute proposal (requires token accounts setup)
    // - Create payment stream
    // - Execute stream payment
    // - Create milestone payment
    // - Complete milestone
    // - Batch transfer
    // - Emergency pause and resume
    // - Stake SOL for yield
    
    // These would require more complex setup with token accounts and proper state management
    // For brevity, we're showing the basic workflow up to voting on a proposal
}