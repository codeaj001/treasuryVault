import { AnchorProvider, BN, setProvider, web3 } from "@coral-xyz/anchor";
import * as treasuryManagementClient from "../app/program_client";
import chai from "chai";
import { assert, expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
chai.use(chaiAsPromised);

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