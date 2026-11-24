## PVE
- ##### VMs & LXCs
	- ###### Notes
		- Decided to not go through docker approach. It's better on paper, but also adds additional hula-hoops instead of those it removes. So LXC is just easier and adds less headache. 
		- VMs only for things that need either security benefits over LXC or HA OS which recommends VM installation.
	- ###### List
		- LXC - Caddy
		- LXC - Adguard
		- LXC - Telegram Black Out Charts Bot
		- LXC - LiveSync Coach DB
			- %%For obsidian live sync%%
		- VM - Home Assistant OS
			- %%Decided to have self-contained approach without other LXCs. Super easy to backup/restore. Proxmox backup is like 3 gigs as is for like 100 megabytes of HA data. %%
		- VM - Artalk
			- %%Security purposes, isolation is main one (including strictly firewalled subnet)%%
- ##### Notes
	- ###### Network & SSH
		- Hostname `pve.home.arpa`
		- IP `192.168.1.9`
		- Web UI `https://192.168.1.9:8006`
	- ###### Security
		- `IPv6` disabled
			- %%Don't use. Potentially can be missed through firewall rules or something. %%
		- `firewall` enabled
			- %%default deny inbound policy for only specific addresses, don't need access from devices that I don't use to access.%%
		- `rpc services` disabled `rpcbind` and `nfs-blkmap`
			- %%don't use, don't need %%
		- `public`-facing services are in isolated VMs with isolated subnet. 
			- %%`caddy` covers only private %%
		- `nftables` firewall
			- %%gives more flexibility for my purposes%%
	- ###### CPU Power management
		- intel_pstate + powersave + balance_power. Old one was disabled pstate + cpufreq with conservative governor. 
		- [[#^9c77c9|Snippets]]
		- **Issues/Requirements**
			- Keep internal temperatures low
			- Keep power usage low
			- Less heat/current = longer lifespan of components. 
	- ###### Maintenance
		- `Updates`
			- Manual with notifications. 
			- **Reasoning:** since I'll have services I don't want to break randomly - I won't update automatically. Also a good addition for less tested updates to have some time after release instead of installing it right away.
			- `package-updates=always` for availability of updates on no-subscription repository
		- `Notifications` through custom gmail smtp. 
			- `backup failure`
			- `package updates`
			- `system-mail` - can be lots of things, but explicitly setup for SMART errors of ssd. 
	- ###### Backups
		- `local` - multiple copies with different intervals
		- `another machine` - `rsync` mirror
		- `cloud` - `another machine` backups to cloud
	- ###### Other
		- `Customizations`
			- `pve-mods` - for removing subscription nag screen
			- `/root/pve-four-core-temperatures.py` - for showing cpu temperature sensors on dashboard
				- `python3 /root/pve-four-core-temperatures.py status/install/uninstall` - if got reset on upgrade
				- nag screen works through pve-mods, don't want to address it with custom script
				- but pve-mods doesn't support minimal addition of cpu temps, looks awful, hence script























## Snippets
### Power Management Snippets %% fold %%
^9c77c9
#### Script
```bash
cat > /usr/local/sbin/set-cpu-power-policy.sh <<'EOF'
#!/bin/sh
set -eu

for cpu in /sys/devices/system/cpu/cpu[0-9]*; do
    dir="$cpu/cpufreq"
    [ -f "$dir/scaling_governor" ] || continue

    echo powersave > "$dir/scaling_governor"

    if [ -w "$dir/energy_performance_preference" ]; then
        echo balance_power > "$dir/energy_performance_preference"
    fi
done
EOF

chmod 755 /usr/local/sbin/set-cpu-power-policy.sh
```

#### Service
```bash
cat > /etc/systemd/system/cpu-power-policy.service <<'EOF'
[Unit]
Description=Apply Intel N100 CPU power policy
After=systemd-udev-trigger.service

[Service]
Type=oneshot
ExecStart=/usr/local/sbin/set-cpu-power-policy.sh
RemainAfterExit=yes

[Install]
WantedBy=multi-user.target
EOF
```

#### Enable Service
```bash
systemctl daemon-reload
systemctl enable --now cpu-power-policy.service
systemctl status cpu-power-policy.service --no-pager
```

###















---

# Legacy

## Notes
- Proxmox host always-on mini PC (N100) + on like 3kWh battery.
- Caddy + AdGuard + Domain = local websites with https:// access (so no warnings/popups + some advantages for PWA apps)
- Structure of pve - each one in separate LXC + haos in vm. Feels simpler and more reliable in comparison with docker mega-lxc. 
	- caddy, adguard, haos(+z2m and mqtt), telegram bot that parses blackout times, remark42 and "the project"'s test machine for unix compatibility. 


## Reinstall notes
- https://community-scripts.org/ - might want to look at to make some installs easier.
- Figure out proper networking rules. Don't use dhcp. use static IPs outside of the dhcp range. 
- check cron
	- `@reboot (sleep 60 && echo "conservative" | tee /sys/devices/system/cpu/cpu*/cpufreq/scaling_governor)`— CPU frequency governor set to `conservative` at every boot (mini-PC fan/noise/heat choice)
	- `*/5 * * * * /root/ha_post_temp.sh` — script run every 5 minutes posts temperature data related to haos
- for caddy and https I was doing something with ACME on proxmox for both accounts and challenge plugins.
- `unattended-upgrades` on both caddy and remark42 lxcs
	- `bookworm-security` + cloudflare tunnel on caddy

## Backups

- backups
	- `vzdump` 2 daily + 1 weekly. All containers/vms. With zstd compression. Snapshot. Using smb to rsync mirror those on another pc in local net, `iniOnCalendar=*-*-* *:30:00` - hourly at X:30, so it won't accidentally interfere with backup job and also flexible in case I change backup time and forget about this job.
	- smb added persistently as cifs storage and is protected by specific user account with limited set of permissions. 
	- TODO: Now I have 6 copies of my data. last 2 days + weekly on proxmox and mirrored on smb (another device). To have that 3 2 1 rule - I need to setup cloud sync and probably buy storage as well. 
	- it is mirror - so it removes files on smb if they don't exists on pve

### Backup decisions
(to avoid re-discussing the same thing.)

| Decision                        | Choice                                                                     | Why (short)                                                                                                                                                                                                                                                         |
| ------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Full vzdump vs file-level tiers | **vzdump-only daily** + small remark42 dump layer                          | it's PIA to setup backups per container/vm. Vzdump takes like 100x more space, but still it's 10gb at max in current state of things. 30gb of 2+1. So it's nothing but significantly reduces complexity and increases reliability.                                  |
| Where archives live             | **Local primary, SMB secondary**                                           | Local-first means a failed SMB sync never fails the backup itself (graceful degradation). Also fastest restore path.                                                                                                                                                |
| Schedule coupling               | **None.** Sync is periodic/idempotent (15–30 min), independent of job time | Changing job time (04:00 → 10:00) breaks nothing; sync catches up on its own schedule; SMB downtime = delayed copy, not failure.                                                                                                                                    |
| VMID list in job                | **"All guests" mode**                                                      | All. Just to not have any headache with keeping selected lxc synced and then forgetting to add new ones.                                                                                                                                                            |
| Encryption                      | **DROPPED (for now)**                                                      | Minor PIA to do proper sync of encrypted data. SMB is encrypted, so is proxmox. If people got their hands on those files - then I'll have much bigger problems. And on top of it - there's nothing important in those containers that can make the situation worse. |
| TODO Encryption                 | **TODO if cloud is added**                                                 | Different exposure. If that data will be backed up on cloud - I NEED encryption 100%.                                                                                                                                                                               |
| Restore from SMB                | **Register share as Proxmox CIFS storage**                                 | Plaintext archives with intact `vzdump-*.tar.zst` names are indexed by Proxmox UI → one-click restore from either copy. (Earlier "don't register" advice was encryption-driven and is now void.)                                                                    |
| Integrity                       | outdated - **sha256 manifest, host-only**<br>current - none                | Detects SMB-side corruption/bit-rot/tampering at restore-from-SMB time. Not anti-forgery (moot without encryption).<br>UPD. Was minor PIA to setup properly, so just deferred it.                                                                                   |
| Retention                       | local: keep-daily=2 + keep-weekly=1; SMB mirrors it via `--delete`         | Mirror semantics, no accumulation museum.                                                                                                                                                                                                                           |
| remark42 frequency              | 24h dumps, last 10 (remark's own MAX_BACKUP_FILES)                         | User chose 24h; hourly was considered and declined.                                                                                                                                                                                                                 |
| Offsite tier                    | **Not now — accepted gap**                                                 | Same-house single point of failure accepted explicitly.<br>But it would be nice to have cloud setup too. Not that hard as well.                                                                                                                                     |
