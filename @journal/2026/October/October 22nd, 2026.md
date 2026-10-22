
%%[[[T]daily-journaling|Daily Journal Template]]%%

```meta-bind-button
style: primary
label: New Journal Entry
icon: notebook-pen
cssStyle: "background-color: #363124; font-size: 0.8rem;color: var(--text-normal);"
actions:
  - type: templaterCreateNote
    templateFile: "_static/templater/[T]daily-journaling.md"
    openNote: true
    openIfAlreadyExists: true
```

---

```meta-bind-button
label: Remove Night Checklist
style: default
icon: trash-2
cssStyle: "height: 22px; min-height: 0; padding: 0 6px; font-size: 11px; line-height: 1; gap: 4px;"
action:
  type: js
  file: _static/scripts/meta-bind/journal-remove-checklist.js
```
- ##### NIGHT CHECKLIST
    - ###### AFTER NEW RECORDING
        - [ ] Check audio delay to webcam
        - [ ] Night scene
        - [ ] Check IP cam (quality, delay)
        - [ ] Check TickTick schedule (correct day, scheduled)
        - [ ] Set time of next sleep for stager timer.
        - [ ] Create and prefill next journal entry
    - ###### AFTER UPLOAD
        - [ ] Blur
        - [ ] Chapters
    - ###### BEFORE SLEEP
        - [ ] Write overview of the current day
        - [ ] Create journal for the next day
        - [ ] Move uncompleted tasks
        - [ ] Make sure all day's reflections are linked under reflections

---

## OVERVIEW
%%Block to easily skim through journal entries and remember/identify which day it is based on key things that happened%%


---

## TASKS
%%Cognitive offload for the day, to not keep these in my mind for the whole time%%
- ### Active
	- [ ] You need simple back/forward(automatic visibility if exists) navigation between journal entries.
	- [ ] You need a to select a block of text, press hotkey and save it as a reflection with link that replace selected text. (also it should have same frontmatter as current flow)
		- [ ] On top of it, current flow of templated reflections probably should force copy link into clipboard as well. These shouldn't be in the journaling, because they give constraints on the size. 
			- or maybe you just use initial `_reflections` flow instead of limiting yourself within the journal entry? 
	- [ ] [IMPORTANT] when I updated junctions - obsidian updated ALL links in my project. Which means all links in all symlinked `__obsidian__/` folders will instantly get broken. So you can't use any markdown/wiki links in there to prevent massive headache in the future. give plain links inside `inline codeblock`
- ### Doing now
	- [ ] You hate it, but you must go through all of that llm generated mess on docs and extract/rewrite our agents.md as the main entry point for the LLM tasks.
- ### Completed
	- [x] Youtube - wrong order of timestamps. You need to offset by one chapter
	- [x] vscode + reconfiguring project + npm/pnpm/node/test runs/etc.
	- [x] Installing and configuring all apps I need
	- [x] Fixing some windows bugs
	- [x] Proper security for ahk helper script
	- [x] Better fonts
	- [x] Lots and lots of QoL improvements
	- [x] restored portable apps shortcuts
	- [x] Windhawk - making OS beautiful
	- [x] Went through all windows settings

---

## REFLECTIONS
%%Thinking through writing is much better - there must be low-friction place to do so%%
- 


---

>[!tldr] CONTEX
>Sleep Duration - **6:23**
> 
>Time Spent in Bed - **Low-Mid**
>The theory is that I'm kinda thinking too much if I stay in bad, high chance of making myself more discouraged because of that. 
> 
>Approx. Dreams Compensation - **"Take it easy"**
>It's insane how much a simple girl in my dreams can inspire me just by being there. Like it wasn't even my girl, I was looking at some flirtatious couple from like third-person view. Yeah... there's insane amount of "striving-upwards" kind of energy locked behind absence of a partner. Oh well.


---

## TIME LOG

```meta-bind-button
label: New Log Entry
style: default
icon: clock
cssStyle: "height: 24px; padding: 5px; font-size 11px;"
action:
  type: js
  file: _static/scripts/meta-bind/journal-time-entry.js
```
- ###### 00:13
	- Time flies... it's sad really that when I have a bunch of it - I discouraged and struggle to do anything. But as soon as there's 45 minutes left to sleep - all of a sudden I can/want work for longer... 
- ###### 23:26
	- The issue of that task I'm avoiding - is because I wasn't stupid to avoid it. It's PIA. On facade there's simple "rewrite docs" but in practice - there's a lot of learning and research involved. It can take hours upon hours...
- ###### 22:45
	- This shit with tasks above - puts pressure to track what I'm doing and write it down... I don't know how I feel about it... Especially considering because of context block those are not in my view 
	- ==🔴OK, makes sense to have split view, then tasks will be in my field of vision. So I can use them properly. I lose context though...==
- ###### 22:26
	- I don't know, from one perspective it's overwhelming, but also I create layers of abstraction that make my life easier withing increasing complexity. 
	- Like I made proper backup system for proxmox - now, any bad stuff happens - I don't lose everything. And can revert back easily. 
	- With windows - it's much smoother and less bloated, which is kinda a mirror of my mind, so when it's bloated and there's lots of wrong stuff going on - it's mirrored in my mind as "I need to clean/fix this mess thoughts" which are take cognitive load too.
	- Even this journaling. Like if I didn't thought through the flow - it wouldn't be as smooth as it's now. Like with those buttons and proper categorization/etc. 
	- So maybe like it's painful to do in the moment but it pays off for long time?
- ###### 21:12
	- If scope is too overwhelming - reduce it until it's not. Peterson said in the morning. And seems like now it's applicable. I'll go to second meal. And then I'll clean up the chaos in website's project. That's it. Nothing else. 
- ###### 20:14
	- ==Ok, honesty time. Did I have to reinstall the windows? No. Like I could've done another year without issues. It was "nice to have" not "prioritize over everything".==
		- But was it though? Like I now don't have headache with that privacy issue I had on older system. Everything works smoother. And is set up in a more optimized manner. Also did quite a few QoL features. It's just nicer and better and smoother. 
		- ==🟡But here's what beats it - you should've consider reinstall AFTER you fixed up the mess in website's source code. AFTER. not before.== 
		- ==🟡And here's a big one - it's the same thing as with any kind of indulgence. If it stems from something negative/destructive - you'll be punished for indulgence, because correct way is to confront the dragon, not to "avoid it"==
			- So no matter what you wanted to do - it would've ended the same. Porn, fast food or reinstalling the windows. If there's bad faith involved - it doesn't matter how "good" it is on the facade...
- ###### 19:45
	- Still very low. Barely able to get the job done. But windows is like 95% there. A few apps left to configure and I'm done.
- ###### 19:00
	- I'm just done... 
- ###### 18:24
	- Not happy with this day. Not happy at all. 
- ###### 17:44
	- PMO'ed in the meantime. I don't know how to deal with this. It just completely shifts my perception. And like it's hard to say "F all this" and I'll do what I need to do. Like those task I'm doing right now is kinda important too. Not AS important. But still...
- ###### 16:47
	- The more I'm doing suboptimal thing - the worse it gets. Meaning-wise. So yeah, that's how I can feel the "invisible hand of unconscious", it compensates me right now, without dreams.
- ###### 15:01
	- Yeah, those meals are a bit distracting, but it's good. I must eat on schedule, or it'll bit me in the ass in a few hours. 
- ###### 14:22
	- Slow slow slow... I don't know how I managed to have high speed in previous days?
- ###### 13:42
	- The issue of having too much things to do is that I can't concentrate on important things. 
- ###### 13:02
	- I don't know how to have more speed here... Like what is speed? I can't just rush through everything not thinking about it. 
- ###### 12:22
	- Moving good. Lots of things to do though...
- ###### 11:42
	- Vision is blurry a bit. Distracting... But working
	- This may be even bigger than I thought. Blurry vision is like additional cognitive load to decode the image into "intellectual object". But what can I do though?
- ###### 11:11
	- Starting to work. Windows reinstall continues. I have to do it with speed
- ###### 03:24
	- A lot more anxiety tonight too, you have to make big progress 
- ###### 03:16
	- ==🟢Imagine how you feel before going to bed, how exhaustive it is to have that backlog of tasks that is constantly increasing. So maybe try to use this feeling for the energy?==