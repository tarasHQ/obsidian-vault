

### Caddy installation, routing and certificates

- **Host:** separate Debian 12 LXC, `192.168.1.12`.
- **Verified packaging:** native apt/dpkg-managed `caddy` package, version **2.10.2** at the update-policy check. Configured package source: Cloudsmith stable repository at `https://dl.cloudsmith.io/public/caddy/stable/deb/debian`.
- **Required module:** the running setup supports Cloudflare DNS-01 (`dns.providers.cloudflare`). **The exact custom-binary/module build and installation procedure is not recorded here.** An apt package record does not prove that a stock package binary includes this module; do not assume a normal package replacement preserves it.
- **Updates deliberately deferred:** `apt-mark showhold` lists `caddy`; unattended-upgrades additionally blacklists `^caddy$`. No Caddy package update or binary rebuild was performed during this maintenance. A future manual-update procedure must preserve the DNS module and establish rollback first.
- Caddy routes `comments.taras.life` to `192.168.1.11:8080`.
- Its comments block uses DNS-01: `tls { dns cloudflare {env.CF_API_TOKEN} }`. Recorded token zone scope covers both prox.bar and taras.life.
- Visitor-IP forwarding: `header_up X-Real-IP {http.request.header.CF-Connecting-IP}`. The recorded end-to-end log test showed the real visitor IP (193.30.245.11 in the VPN test) in `Cf-Connecting-Ip`, with `remote_ip=127.0.0.1` for cloudflared.
- **Comments access log:** `/var/log/caddy/comments.log`, owned by `caddy:caddy`. It contains visitor IPs; restrict access to the service and authorized administrators. Earlier fix replaced a stale root-owned empty file and corrected directory ownership. The orphaned 31 MB log file was deleted.
- Cloudflare API token lives in `/etc/systemd/system/caddy.service.d/override.conf`, as `Environment=CF_API_TOKEN=...`; Caddyfile references `{env.CF_API_TOKEN}`. Do not read/paste the override into chat.
- Caddy validation needs its required environment. A plain interactive-shell validation may not inherit the token from the systemd drop-in. For local diagnostics, the recorded extraction command is `TOKEN=$(grep -oP 'CF_API_TOKEN=\K.*' /etc/systemd/system/caddy.service.d/override.conf)`; never print/share that variable, and never paste a command with its expanded value. Share only sanitized diagnostic responses.
- Before any deliberate configuration reload: check current service state, validate with the required environment available, then prefer **reload**, not restart. Keep direct Proxmox access available throughout.

### Cloudflare Tunnel (cloudflared)

- Installed through the Cloudflare apt repository `https://pkg.cloudflare.com/cloudflared`. Last verified package version during setup: **2026.10.1**.
- Repository metadata: `origin=cloudflared`, `label=cloudflared`, `site=pkg.cloudflare.com`, codename `any`. It is now **explicitly allowed** by unattended-upgrades; apt installation alone would not grant that permission.
- Tunnel: `comments`, ID `9f7fbe1a-4ee0-4579-b0a4-d85eb30c5643`.
- Config: `/etc/cloudflared/config.yml`; credentials: `/etc/cloudflared/credentials.json`.
- Ingress: `comments.taras.life` → `https://127.0.0.1:443`, with `originRequest.originServerName: comments.taras.life` so SNI selects the correct Caddy block; catch-all 404.
- DNS: CNAME `comments.taras.life` → `9f7fbe1a-4ee0-4579-b0a4-d85eb30c5643.cfargotunnel.com`.
- Account-level login credential: `/root/.cloudflared/cert.pem`, used for operations such as `tunnel route dns`.
- `cloudflared.service` starts on boot and restarts on crash.
- Recorded benign warnings: ICMP proxy disabled (`ping_group_range`) and QUIC UDP receive-buffer size.

### Automatic apt updates — verified policy

Both LXCs have `unattended-upgrades` installed. Effective periodic settings:

```text
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
```

The apt daily timers were scheduled. Local policy lives in **`/etc/apt/apt.conf.d/99-local-unattended-upgrades` on each host**; it clears inherited origin allowlists rather than appending to Debian's broader default.

| Setting                    | Remark42 LXC                 | Caddy LXC                                        |
| -------------------------- | ---------------------------- | ------------------------------------------------ |
| Debian security repository | Allowed: `bookworm-security` | Allowed: `bookworm-security`                     |
| cloudflared repository     | Not present/allowed          | Explicitly allowed                               |
| Caddy upgrades             | N/A                          | Held + explicitly blacklisted                    |
| Other third-party origins  | Not allowed                  | Not allowed, including configured Tailscale repo |
| Automatic machine reboot   | Explicitly `false`           | Explicitly `false`                               |
| Remark42 binary            | Manual                       | N/A                                              |

Exact policy on the **Caddy LXC**:

```text
// Limit automatic updates to Debian security and cloudflared.
// Keep Caddy upgrades and machine reboots under manual control.
#clear Unattended-Upgrade::Allowed-Origins;
#clear Unattended-Upgrade::Origins-Pattern;

Unattended-Upgrade::Origins-Pattern {
    "origin=Debian,codename=${distro_codename}-security,label=Debian-Security";
    "origin=cloudflared,label=cloudflared,site=pkg.cloudflare.com";
};

Unattended-Upgrade::Package-Blacklist {
    "^caddy$";
};

Unattended-Upgrade::Automatic-Reboot "false";
```

The **Remark42 LXC** uses the same allowlist reset, Debian security entry and explicit no-reboot setting, but has neither the Cloudflare entry nor the Caddy blacklist block.

Operational notes:

- `Origins-Pattern` is a **list**. Use a brace-delimited list as above, or append with `Unattended-Upgrade::Origins-Pattern:: "...";`. A scalar assignment without the final `::` is not the correct way to append a repository.
- Repository availability and matching were verified with `apt-cache policy`; effective settings were checked with `apt-config dump`; dry runs passed on both hosts. The first scheduled real run has **not yet been observed**.
- Routine simulation: `unattended-upgrade --dry-run`. Add `--debug` only when diagnosing; it may print hundreds of repository-filtering/resolver messages. Dry-run text such as `All upgrades installed` describes the simulation, not real package installation. Negative pins shown during that run are not permanent system-wide apt preferences.
- Logs are under `/var/log/unattended-upgrades/`. Do not infer success solely from a timer or service existing; inspect actual run results when checking operation.
- The warning about missing `powermgmt-base` is not a setup failure. Host battery policy would be a separate decision; do not install power-management tooling in these LXCs just to silence it.
- **No automatic reboot does not mean no service restart.** Package maintainer scripts/restart tooling can restart services, and cloudflared updates may briefly interrupt the tunnel. A Caddy package hold does not guarantee zero interruption from unrelated system maintenance.
- LXCs share the Proxmox host kernel. Updating/rebooting a container does not independently update the host's running kernel. `linux-libc-dev` is a development-headers package, not a new bootable LXC kernel.
- **Security-only automation is not complete OS maintenance.** Fixes can be incorporated into Debian's main repository through point releases. Periodically review normal Debian updates; do not assume every pending main-repository update is merely cosmetic.
- Tailscale's repository was found on the Caddy box but not added to this unattended policy. This does not audit or configure any independent application self-update mechanism.

### Manual maintenance, verification and rollback

- A manual Caddy-LXC Debian upgrade was simulated: **94 packages**, zero new packages and zero removals. The list included libc, PAM, systemd, OpenSSH, OpenSSL and other system packages; **not Caddy**.
- Before upgrading, the user created Proxmox LXC snapshot **`pre-debian-upgrade`**. The real upgrade was performed with Caddy held and without `autoremove`.
- Post-upgrade user evidence: `dpkg --audit` produced no output; Caddy and cloudflared were active; `apt-mark showhold` still listed Caddy; `https://comments.taras.life/api/v1/ping` returned `pong`.
- The snapshot was retained at the end of the session. Its later deletion/retention has not been confirmed. It is a local rollback point, **not an independent/offsite backup**.
- Restore route: direct Proxmox IP → Caddy LXC → restore the snapshot. Restoring interrupts that container and discards its post-snapshot changes; it does not restore or roll back the separate Remark42 LXC or Proxmox host.
- Future upgrades: inspect service state, secure console access and a suitable rollback point, simulate with `apt-get -s upgrade`, then review before any real upgrade. The held Caddy package must stay excluded. Unexpected errors, replacement-config prompts or service-restart questions should be reviewed rather than answered blindly.
- The upgrade suggested autoremoving `iptables`, `libip6tc2`, `libnetfilter-conntrack3` and `libnfnetlink0`. **They were not deliberately removed in this work**; review networking implications separately before any `autoremove`.
- Healthy service checks do not prove every long-running process has loaded every newly installed library. Do not infer either that a reboot is mandatory or that further maintenance can never be needed solely from `systemctl is-active`.

Useful non-secret checks (run only on the relevant host; no restart required):

```bash
# Confirm the Caddy package hold on the Caddy LXC.
apt-mark showhold

# Review scheduled apt tasks and simulate unattended upgrades.
systemctl list-timers --all --no-pager apt-daily.timer apt-daily-upgrade.timer
unattended-upgrade --dry-run

# After package maintenance, check package consistency and Caddy/tunnel health.
dpkg --audit
systemctl is-active caddy cloudflared
curl -fsS https://comments.taras.life/api/v1/ping
printf '\n'
```

### Backups and remaining infrastructure work

- **Backups: implemented and verified.** See `__obsidian__/backup.md` for the full design, corrections and status. Irreplaceable Remark42 data is protected by remark42's built-in daily auto-dumps plus daily vzdump to local storage, mirrored to CIFS storage `lifepc-smb` (Windows, share `pve-backups`, user `pve-smb`). Encryption deliberately dropped for the LAN SMB tier (rotatable secrets, credentialed share; revisit trigger = any future offsite/cloud tier). Archive streaming test passed; full restore drill not performed (recorded gap).
- **Domain migration remains unverified/deferred:** prox.bar is not being renewed. Migrate internal services to taras.life subdomains with **direct, non-wildcard AdGuard rewrites** (for example `pve.taras.life → 192.168.1.12`), then update Caddy blocks one service at a time with validation and reload. DNS-01 can issue replacement certificates without public service records or inbound ports. Recheck the actual expiry date instead of reusing the old relative "~1 month" estimate.
- Optional Remark42 LXC DNS migration to AdGuard has not been performed here.
