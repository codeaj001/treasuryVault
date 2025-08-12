<<<<<<< HEAD
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { TreasuryManagement } from "../target/types/treasury_management";
import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY, Keypair } from "@solana/web3.js";
=======
import { AnchorProvider, BN, setProvider, web3 } from "@coral-xyz/anchor";
import * as treasuryManagementClient from "../app/program_client";
import chai from "chai";
>>>>>>> 15c491cf5d7726a9b63814abbcfd95f86c788d83
import { assert, expect } from "chai";

<<<<<<< HEAD
describe("treasury_management", () => {
  // Configure the client
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.TreasuryManagement as Program<TreasuryManagement>;
  
  // Test accounts
  const treasuryKeypair = anchor.web3.Keypair.generate();
  const authority = provider.wallet;
  const user = anchor.web3.Keypair.generate();
  
  // Test parameters
  const name = "Test Treasury";
  const signers = [authority.publicKey];
  const threshold = 1;
  const adminLimit = new anchor.BN(1000000000); // 1 SOL
  const treasurerLimit = new anchor.BN(500000000); // 0.5 SOL
  const contributorLimit = new anchor.BN(100000000); // 0.1 SOL
  const resetPeriod = new anchor.BN(86400); // 24 hours
  const autoStake = false;
  const stakeTargetPercentage = 50;

  let treasuryPDA: PublicKey;
  let treasuryBump: number;

  before(async () => {
    // Airdrop SOL to test accounts
    await provider.connection.requestAirdrop(user.publicKey, 2e9);
    
    // Derive treasury PDA
    [treasuryPDA, treasuryBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("treasury"), Buffer.from(name)],
      program.programId
    );
  });

  it("Initialize Treasury", async () => {
    try {
      await program.methods
        .initializeTreasury(
          name,
          signers,
          threshold,
          adminLimit,
          treasurerLimit,
          contributorLimit,
          resetPeriod,
          autoStake,
          stakeTargetPercentage
        )
        .accounts({
          authority: authority.publicKey,
          treasury: treasuryPDA,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      // Fetch treasury account
      const treasury = await program.account.treasury.fetch(treasuryPDA);
      
      // Verify initialization
      expect(treasury.name).to.equal(name);
      expect(treasury.signers[0].toString()).to.equal(authority.publicKey.toString());
      expect(treasury.threshold).to.equal(threshold);
    } catch (err) {
      console.error("Error initializing treasury:", err);
      throw err;
    }
  });

  it("Assign Role", async () => {
    try {
      const roleType = 2; // Treasurer role
      await program.methods
        .assignRole(
          name,
          user.publicKey,
          roleType,
          true, // can_execute_payments
          true, // can_create_streams
          false, // can_manage_roles
          true, // can_view_treasury
          true, // can_propose
          true  // can_vote
        )
        .accounts({
          authority: authority.publicKey,
          treasury: treasuryPDA,
        })
        .rpc();

      // Verify role assignment (you'll need to implement role fetching in your contract)
      // const userRole = await program.account.role.fetch(...);
      // expect(userRole.roleType).to.equal(roleType);
    } catch (err) {
      console.error("Error assigning role:", err);
      throw err;
    }
  });

  it("Deposit SOL", async () => {
    const depositAmount = new anchor.BN(100000000); // 0.1 SOL
    
    try {
      const beforeBalance = await provider.connection.getBalance(treasuryPDA);

      await program.methods
        .depositSol(name, depositAmount)
        .accounts({
          depositor: authority.publicKey,
          treasury: treasuryPDA,
        })
        .rpc();

      const afterBalance = await provider.connection.getBalance(treasuryPDA);
      
      // Verify deposit
      expect(afterBalance - beforeBalance).to.equal(depositAmount.toNumber());
    } catch (err) {
      console.error("Error depositing SOL:", err);
      throw err;
    }
  });

  it("Create and Complete Milestone Payment", async () => {
    const milestoneId = new anchor.BN(1);
    const amount = new anchor.BN(50000000); // 0.05 SOL
    const description = "Test milestone";
    const category = 1;

    try {
      // Create milestone payment
      await program.methods
        .createMilestonePayment(
          name,
          milestoneId,
          user.publicKey,
          SystemProgram.programId, // Using SOL
          amount,
          description,
          category
        )
        .accounts({
          authority: authority.publicKey,
          treasury: treasuryPDA,
          milestonePayment: getMilestonePDA(milestoneId),
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      // Complete milestone payment
      await program.methods
        .completeMilestone(name, milestoneId)
        .accounts({
          authority: authority.publicKey,
          treasury: treasuryPDA,
          milestonePayment: getMilestonePDA(milestoneId),
          tokenMint: SystemProgram.programId,
          source: treasuryPDA,
          destination: user.publicKey,
        })
        .rpc();

      // Verify milestone completion
      // Add verification logic based on your contract state
    } catch (err) {
      console.error("Error handling milestone payment:", err);
      throw err;
    }
  });
});

// Helper function to derive milestone PDA
function getMilestonePDA(milestoneId: anchor.BN): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("milestone"),
      milestoneId.toArrayLike(Buffer, "le", 8)
    ],
    program.programId
  );
  return pda;
}
=======
const programId = new web3.PublicKey("DpZR1A4fteZqrprxno4r32mE3KWK36ysonGjnxr4KYRi");

describe("treasury_management tests", () => {
  // Configure the client to use the local cluster
  const provider = AnchorProvider.env();
  setProvider(provider);

  const systemWallet = (provider.wallet as NodeWallet).payer;
  
  // Generate a new keypair for the treasury
  const treasuryKeypair = web3.Keypair.generate();
  
  // Define roles
  const ADMIN_ROLE = 1;
  const APPROVER_ROLE = 2;
  
  // Define test parameters
  const treasuryName = "Test Treasury";
  const minApprovals = 1;
  const depositAmount = new BN(1_000_000_000); // 1 SOL
  
  it("Initialize treasury", async () => {
    // Get the treasury PDA
    const [treasuryPda] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from("treasury"), treasuryKeypair.publicKey.toBuffer()],
      programId
    );
    
    // Initialize the treasury
    const tx = await treasuryManagementClient.initializeTreasury({
      treasuryName,
      minApprovals,
      admin: systemWallet.publicKey,
      treasuryAccount: treasuryPda,
      treasuryMint: treasuryKeypair.publicKey,
      feePayer: systemWallet.publicKey,
    });
    
    await tx.buildAndExecute();
    
    // Fetch the treasury account to verify it was created correctly
    const treasuryAccount = await treasuryManagementClient.fetchTreasury(treasuryPda);
    
    // Verify the treasury was initialized correctly
    expect(treasuryAccount.name).to.equal(treasuryName);
    expect(treasuryAccount.minApprovals).to.equal(minApprovals);
    expect(treasuryAccount.admin.toString()).to.equal(systemWallet.publicKey.toString());
    expect(treasuryAccount.paused).to.be.false;
  });

  it("Assign role to user", async () => {
    // Get the treasury PDA
    const [treasuryPda] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from("treasury"), treasuryKeypair.publicKey.toBuffer()],
      programId
    );
    
    // Generate a new user keypair
    const userKeypair = web3.Keypair.generate();
    
    // Get the role PDA
    const [rolePda] = web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("role"),
        treasuryPda.toBuffer(),
        userKeypair.publicKey.toBuffer(),
        Buffer.from([APPROVER_ROLE])
      ],
      programId
    );
    
    // Assign the approver role to the user
    const tx = await treasuryManagementClient.assignRole({
      treasury: treasuryPda,
      role: rolePda,
      user: userKeypair.publicKey,
      roleType: APPROVER_ROLE,
      admin: systemWallet.publicKey,
      feePayer: systemWallet.publicKey,
    });
    
    await tx.buildAndExecute();
    
    // Fetch the role account to verify it was created correctly
    const roleAccount = await treasuryManagementClient.fetchRole(rolePda);
    
    // Verify the role was assigned correctly
    expect(roleAccount.treasury.toString()).to.equal(treasuryPda.toString());
    expect(roleAccount.user.toString()).to.equal(userKeypair.publicKey.toString());
    expect(roleAccount.roleType).to.equal(APPROVER_ROLE);
  });

  it("Deposit SOL to treasury", async () => {
    // Get the treasury PDA
    const [treasuryPda] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from("treasury"), treasuryKeypair.publicKey.toBuffer()],
      programId
    );
    
    // Get the treasury's SOL vault PDA
    const [solVaultPda] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from("sol_vault"), treasuryPda.toBuffer()],
      programId
    );
    
    // Get the initial balance of the SOL vault
    const initialBalance = await provider.connection.getBalance(solVaultPda);
    
    // Deposit SOL to the treasury
    const tx = await treasuryManagementClient.depositSol({
      treasury: treasuryPda,
      solVault: solVaultPda,
      amount: depositAmount,
      depositor: systemWallet.publicKey,
      feePayer: systemWallet.publicKey,
    });
    
    await tx.buildAndExecute();
    
    // Get the final balance of the SOL vault
    const finalBalance = await provider.connection.getBalance(solVaultPda);
    
    // Verify the deposit was successful
    expect(finalBalance - initialBalance).to.equal(depositAmount.toNumber());
    
    // Fetch the treasury account to verify the balance was updated
    const treasuryAccount = await treasuryManagementClient.fetchTreasury(treasuryPda);
    expect(treasuryAccount.solBalance.toString()).to.equal(depositAmount.toString());
  });
});
>>>>>>> 15c491cf5d7726a9b63814abbcfd95f86c788d83
