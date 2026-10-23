















# What I Want to have in agents
Personal blog built with **Quartz v5**, deployed to **Cloudflare Workers**.
- Content lives in `content/`, Quartz engine in `quartz/`, config in `quartz.config.yaml`, deployment via `wrangler.jsonc`.

## 0. SSOT of links to additional project's .md files

- ##### Instructions
    - It's crucial to adhere to conditions of reading to avoid unnecessary context bloat.
    - Links are relative to `AGENTS.md`, path from repo's root would be `__obsidian__/docs/AGENTS.md`
- ##### [PLANNING.md](C:\Users\Taras\Documents\obsidian-vault\_static\projects\PLANNING.md)
    - to be read only during planning phase. [[../../../../_static/projects/PLANNING|internal link for the user]], llm shouldn't use it.
- ##### ./docs/DEV_RULES.md
    - to be read only before writing the code, there's no information that is helpful during planning phase.
- ##### ./DEV_COMMANDS.md
    - to be read only if LLM tinkers with tasks/commands/scripts
- ##### ./PHILOSOPHY.md
    - never read, it's too abstract for 99% of tasks at hand.
- ##### ../README.md
    - neve read, it's vault-related decisions that is rarely needed in an LLM task


## 2. Tech Stack & Key Libraries



(from other project's agents file)
## 8. Codebase Exploration & Documentation Guidelines

### 8.1 Submodule Documentation (README.md)
- Every logical module and package submodule maintains a concise local `README.md` file.
- When researching, planning, or preparing to modify a module, always read its local `README.md` first before reading individual code files.
- Local `README.md` files provide high-level design rationale, submodule structure, domain quirks, future features and controversial decisions that are not immediately obvious from code alone.
- Some modules may not have `README.md` - then LLM must inform the dev to create one.
### 8.2 Reference Materials & Vendor Docs (docs/)
- External library documentation and architectural guidelines (e.g. React best practices, most of 3rd party key packages docs, OpenAI SDK references) reside in the `docs/` directory.
- Due to the size of documentation files under `docs/`, avoid reading them entirely into context with direct read tools.
- Always use the `explore` tool with focused queries to extract specific sections from `docs/` without bloating the context window.
---





# Not sure if it should be in agents (or at all)

### Remark42
Comments.
1. Self hosted as standalone binary on LXC. Accessed to internet through cloudflare tunnel + caddy reroute. 
2. Done as systemd service
3. Backups. Handled by proxmox daily/weekly vzdumps with rsync offsite
4. Health - UptimeRobot, pings both taras.life and `https://comments.taras.life/api/v1/ping`
5. Tied to the id in frontmatter. No id - no comments. 
6. (crucial for free worker on cloudflare) web analytics injects beacon.js into remark42 oauth icons, which breaks them. Workaround is to use rule configuration to disable RUM when host == the public host of the remark42
