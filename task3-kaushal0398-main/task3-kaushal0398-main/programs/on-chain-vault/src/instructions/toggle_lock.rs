use anchor_lang::prelude::*;
use crate::state::Vault;
use crate::events::ToggleLockEvent;
use crate::errors::VaultError;

#[derive(Accounts)]
pub struct ToggleLock<'info> {
    #[account(mut)]
    pub vault_authority: Signer<'info>,
    #[account(
        mut,
        seeds = [b"vault", vault_authority.key().as_ref()],
        bump,
        constraint = vault.vault_authority == vault_authority.key() @ VaultError::Unauthorized,
    )]
    pub vault: Account<'info, Vault>,
}

pub fn _toggle_lock(ctx: Context<ToggleLock>) -> Result<()> {
    let vault = &mut ctx.accounts.vault;
    let vault_authority = &ctx.accounts.vault_authority;

    // Toggle the locked state
    vault.locked = !vault.locked;

    // Emit the toggle lock event
    emit!(ToggleLockEvent {
        vault: vault.key(),
        vault_authority: vault_authority.key(),
        locked: vault.locked,
    });

    Ok(())
}