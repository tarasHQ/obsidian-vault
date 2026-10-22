
## Notes
- backups
	- 2 daily + 1 weekly. All containers/vms. With zstd compression. Snapshot. Using smb to rsync mirror those on another pc in local net, `iniOnCalendar=*-*-* *:30:00` - hourly at X:30, so it won't accidentally interfere with backup job
- check cron
	- `@reboot (sleep 60 && echo "conservative" | tee /sys/devices/system/cpu/cpu*/cpufreq/scaling_governor)`— CPU frequency governor set to `conservative` at every boot (mini-PC fan/noise/heat choice)
	- `*/5 * * * * /root/ha_post_temp.sh` — script run every 5 minutes posts temperature data related to haos
- for caddy and https I was doing something with ACME on proxmox for both accounts and challenge plugins.