
## Reinstall notes
- Figure out proper networking rules. Don't use dhcp. use static IPs outside of the dhcp range. 
- check cron
	- `@reboot (sleep 60 && echo "conservative" | tee /sys/devices/system/cpu/cpu*/cpufreq/scaling_governor)`— CPU frequency governor set to `conservative` at every boot (mini-PC fan/noise/heat choice)
	- `*/5 * * * * /root/ha_post_temp.sh` — script run every 5 minutes posts temperature data related to haos
- for caddy and https I was doing something with ACME on proxmox for both accounts and challenge plugins.

## Backups

- backups
	- `vzdump` 2 daily + 1 weekly. All containers/vms. With zstd compression. Snapshot. Using smb to rsync mirror those on another pc in local net, `iniOnCalendar=*-*-* *:30:00` - hourly at X:30, so it won't accidentally interfere with backup job and also flexible in case I change backup time and forget about this job.
	- smb added persistently as cifs storage and is protected by specific user account with limited set of permissions. 
	- TODO: Now I have 6 copies of my data. last 2 days + weekly on proxmox and mirrored on smb (another device). To have that 3 2 1 rule - I need to setup cloud sync and probably buy storage as well. 

### Backup decisions
(to avoid re-discussing the same thing.)

| Decision                        | Choice                                                                     | Why (short)                                                                                                                                                                                                                        |
| ------------------------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Full vzdump vs file-level tiers | **vzdump-only daily** + small remark42 dump layer                          | it's PIA to setup backups per container/vm. Vzdump takes like 100x more space, but still it's 10gb at max in current state of things. 30gb of 2+1. So it's nothing but significantly reduces complexity and increases reliability. |
| Where archives live             | **Local primary, SMB secondary**                                           | Local-first means a failed SMB sync never fails the backup itself (graceful degradation). Also fastest restore path.                                                                                                               |
| Schedule coupling               | **None.** Sync is periodic/idempotent (15–30 min), independent of job time | Changing job time (04:00 → 10:00) breaks nothing; sync catches up on its own schedule; SMB downtime = delayed copy, not failure.                                                                                                   |
| VMID list in job                | **"All guests" mode**                                                      | All. Just to not have any headache with keeping selected lxc synced and then forgetting to add new ones.                                                                                                                           |
| Encryption                      | **DROPPED (for now)**                                                      | Minor PIA to do proper sync of encrypted data.                                                                                                                                                                                     |
| Restore from SMB                | **Register share as Proxmox CIFS storage**                                 | Plaintext archives with intact `vzdump-*.tar.zst` names are indexed by Proxmox UI → one-click restore from either copy. (Earlier "don't register" advice was encryption-driven and is now void.)                                   |
| Integrity                       | **sha256 manifest, host-only**                                             | Detects SMB-side corruption/bit-rot/tampering at restore-from-SMB time. Not anti-forgery (moot without encryption).                                                                                                                |
| Retention                       | local: keep-daily=2 + keep-weekly=1; SMB mirrors it via `--delete`         | Mirror semantics, no accumulation museum. User confirmed.                                                                                                                                                                          |
| remark42 frequency              | 4h dumps, last 10 (remark's own MAX_BACKUP_FILES)                          | User chose 4h; hourly was considered and declined.                                                                                                                                                                                 |
| Offsite tier                    | **Not now — accepted gap**                                                 | Same-house single point of failure accepted explicitly.                                                                                                                                                                            |
## Encryption decision (dropped — full reasoning preserved)

- 
- 
- vzdump has no native encryption (that's PBS) — hence `age` was planned in the sync step.
- age X25519 stanzas provide confidentiality only — unauthenticated ephemeral share means anyone knowing the recipient pubkey can forge a decryptable backup (silent poisoning vs loud deletion). Analysis was done and recorded here as context; it is **moot** while encryption is dropped.
- Why dropped: share is already credentialed (`pve-smb`); all sensitive content in archives
  is **rotatable** (CF token, remark42 SECRET, OAuth secrets) → compromise = rotate tokens,
  an annoying afternoon, not a disaster; encryption bought defense-in-depth for a
  low-probability recoverable event at the cost of: age key custody, staging dir,
  lost CIFS-storage UI indexing, forgery caveats.
- **KEPT despite dropping encryption:** the sha256 manifest (corruption detection).
- **ACCEPTED RISK (explicit):** compromise of the Windows box exposes plaintext backup
  contents → response is rotating CF_API_TOKEN, remark42 SECRET, OAuth secrets.
  Deletion by a valid share credential remains unaddressed (Windows-side shadow copies /
  second copy is the future fix, whenever it matters).
- **REVISIT TRIGGER:** if an offsite tier is ever added (rclone → cloud), encryption becomes
  **mandatory** there — a cloud bucket is a fundamentally different exposure than a
  credentialed LAN share. age (and the forgery discussion) comes back at that point.