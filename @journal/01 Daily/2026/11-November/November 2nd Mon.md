---
journal: Daily
journal-date: 2026-11-02
---

```journal-nav {fold}

```

---

```meta-bind-button
label: Remove Morning Checklist
style: default
icon: trash-2
cssStyle: "height: 22px; min-height: 0; padding: 0 6px; font-size: 11px; line-height: 1; gap: 4px;"
action:
  type: js
  file: _static/scripts/meta-bind/journal-remove-checklist.js
```
- ##### MORNING CHECKLIST
    - [ ] Air out the room %%lower oxygen levels and may affect you, triphasic breathing if you're cold%%
    - [ ] Day scene
    - [ ] Check webcam (exposure)
    - [ ] Check IP cam (quality, delay)
        - [ ] Disable sleep blur
    - [ ] Check all elements are present on the canvas
    - [ ] Check TickTick schedule 
        - [ ] correct day, scheduled, scaled
        - [ ] red "now" line is there
    - [ ] Start stager timer
    - Obsidian
        - [ ] Fill Context block
        - [ ] Split down. Have ~10 lines of time log.

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
	- [ ] Check audio delay to webcam
	- [ ] Check TickTick schedule (correct day, scheduled)
	- [ ] Set time of next sleep for stager timer.
	- Obsidian
		- [ ] Write overview of the current day
		- [ ] Create journal for the next day
		- [ ] Move uncompleted tasks
		- [ ] Make sure all day's reflections are linked under reflections
		- [ ] Delete Dream Analysis block if empty
	- [ ] Night scene
	- [ ] Check IP cam (quality, delay)
		- [ ] Enable sleep blur
	- [ ] monitor OFF (seems like keeping on makes him die faster)
	- Cat
		- [ ] Clean up cat's litter box
		- [ ] Food + plate is in my room at the shelf 
			%%(to feed right away and not be distracted by her)%%

---
%%[[../../../../_static/templater/[T]daily-journaling|Daily Journal Template]]%%

## OVERVIEW
%%Block to easily skim through journal entries and remember/identify which day it is based on key things that happened%%


---

>[!tldr] CONTEX
>Sleep Duration - **0:00**
> 
>Time Spent in Bed - **TODO**
> 
>Approx. Compensation of Dreams - **TODO**

---

## TASKS
%%Cognitive offload for the day, to not keep these in my mind for the whole time%%
- ### TODO
	- Templater flow with plans. 
		- [ ] step start and end - should be extracted into shared non-templates through LLM.md, they're SSOT on universal template of the project, so there's no need to keep them in each phase (likely)
			- Opposition would be about phase specific final checks, but probably it should have just its own last phase before completion. That way it'll be much easier to maintain all of this. SSOTs as much as possible.
		- [ ] Have selected project name in phase number selection (to double check)
		- [ ] Ask for plan name and description to automatically paste into project and plan name
		- [ ] Preselected number should include phases in `_archived/` as well.
	- [ ] when you go sleep - create and leave big plan and your position in it. That's how you meaningfully will trach higher scope. But be careful so your "cost" scope won't overfocus on this.
		- Probably in excalidraw?
	- [ ] Fix outliner plugin issues
		- [ ] Css. Outline collapse indicators. Hide? Increase size of dots on hover. 
		- [ ] Remove movable points. 
	- [ ] Psychoanalysis would probably need separate folder. Not reflections though. Separate. Dream analysis included probably. To keep journals lean but with like easy links to go to these kind of things. 
		- Why? Feels bloated. And chances are, with proper practice, you would want to expand on dream analysis some days after initial attempt. Same with psychoanalysis "sessions". So they must be like separate things to research/review. 
			- Backlink to journal would be nice though, so you can see how session is integrated into the day (time log)
	- [ ] Same hotkeys between two PC. 
		- Probably try to go native as much as you can, and then have some small ahk helper script for the rest
	- [ ] Obsidian Headings 
		- They contain a lot of structural potential. The issue is that you need to work on it. 
		- [ ] Non-bulleted headings. Looks stupid when you have h3 of category and h4 below it. They need some indentation/guide lines/etc, but without being in list
		- [ ] h3+ headings are kinda PIA to spam buttons to set them up. You probably should use ahk for alt 456 hotkeys to just insert 456 `#`, seems like there's no plugin that can do it, and native hotkeys removes the heading from the list
		- [ ] Different font. But not sans. It's not article. Goal is detach heading from text
	- [ ] Your budget is limited but sync is important. Maybe selfhost livesync? 
	- [ ] Mouse has 12 buttons. But actually customizable are like 3. Because 2 buttons for tv on/off to preserve organic diodes. And 3 for music control. 2 for back and forward. 1 for win menu. Not much left. 
		- And if I had a modifier. Either through shift(but check conflicts with ahk) or through mouse buttons. Like rmb (if it's possible), then on rmb you can place rarely used functions. And have more buttons for actively used ones
	- [ ] Youtube - you have to do thumbnails anyway, autoselection is unreliable and will cause more headache because of the absent flow - selects only me sleeping.
	- [ ] OBS causes webcam audio lag. I reloaded - it went away. FPS maybe? Google/fix.
		- [ ] nope, it's not obs. reloaded - lag is still there
	- [ ] Daily journaling template
		- [ ] create another folder for these, to avoid bloating templater view
		- [ ] add input field for alias, you're typing names that shouldn't be on the website. 
			- [ ] OR - automate title parsing from file name (including lowercase 'of', 'the', etc.)
	- [ ] **META** Figure out where to accumulate such secondary tasks and where you can prioritize them, because flat list is stupid and limiting. 
	- [ ] Ideally to go away from the minimal theme. It does add a lot of things that I don't use, and basically a deadweight. Like it's better to have 30 styles in CSS than like 2 plugins with 100 settings + a theme . 
	- [ ] flow to compress png into webp from screenshot, so it won't harm neither website nor size of the vault. But also figure out if deskflow can do it, because right now it's half-supported. (or don't do it through deskflow)
		- priority because it adds another dimension to thinking + cognitive offload. 
	- [ ] folder icons - rename to where they used and resize other icons (260kb per icon is stupid)
	- [ ] AHK - run separate user of vscode as admin to be able to edit the script? 
	- [ ] Bring back screenshots of desktop. BUT ALSO add analysis routine. (not sure if it's good for the night, but you need to do it after you woke up? Or like after the first meal. So it influences the current day on top of extracting patterns/insights)
	- [ ] 🔴[[plans/better-schedule-plan|better-schedule-plan]]
- ### Completed
	- [ ] copy_from_here
	- [ ] 

---

## REFLECTIONS
%%Thinking through writing is much better - there must be low-friction place to do so%%
- 

---

## TIME LOG
```meta-bind-button {fold}
label: New Log Entry
style: default
icon: clock
cssStyle: "height: 24px; padding: 5px; font-size 11px;"
action:
  type: js
  file: _static/scripts/meta-bind/journal-time-entry.js
```
- ###### 23:34
	- The prayer is done. I hope dreams will help me figure this out. This is a major issue... 

---

==LLM told me to ask the unconscious and analyze dreams tomorrow (today for this entry)
I think it's stupid. I don't know how. Maybe because previous analysis experiences discharge the dream, and it gets integrated, while only the shell is left. This note is to check this.==
==🟡You prayed before the sleep. You humbly asked God to give you hints on how to proceed next to be aligned with higher good. You think it won't change your perspective at this issue, because it's years long pattern of behavior. Prove this note right tomorrow after you will give an honest and good try==

---



- # Front lines
	- Me and my dad went to the frontlines. 
	- I don't remember why, but the task was go all the way to face-to-face contact
	- it was in my other grandma village, weirdly enough
	- We were driving on bus towards it until we got to the 14th brigade tent (masked near the road)
	- That's where we went on foot. Guys there were hospitable. 
	- There was my grandma too. She was kinda like exhausted But was holding it together
	- So I went into the tent and right away we got fpv drone buzzing flying directly towards us.
	- I had a pistol, tried to shoot at drone. Maybe hit maybe not. I thought that where they have IED - there was a half littre bootle of water that got open. 
	- I said that maybe I hit it. The other guy said that it was something else that hit it (or someone)
	- So we managed to avoid getting hit by that one
	- But dad said we have to go further. 
	- So we went. We passed two guys going back, one didn't have half of his leg. 
	- We went further
	- another drone attack was helped with that tent, their guns covered our sky
	- Dad got out from the main road and said how safer it is compared to staying on it
		- I tried to go off the road into another direction, but have only a headlight and weak IR camera. It felt weak, I was not sure that there's no enemies near, so I decided to go back to my dad
	- Weirdly enough it happened around location of the small local store.  it was at the end of "known"territory in the village (as in real life), and there were some dark figures cleaning up the territorry, and it felt like the shop was still open
	- So I joined my dad
	- I saw that another drone flew towards the tent, wanted to take him down by throwing some food at it, but didn't hit him, since it was too far and I missed. 
	- Then there was weird situation. There was a drone as flying round cardbox-like thing. It was very unpredictive in its movement, but eventually it like obviously targeted me, and it was kinda like pressure bomb. Where you die/get injured because of pressure wave. 
	- So it stuck on top of me and I kinda accepted that I'm done. But it only threw me away, not killed
	- Next scene is completely unknown territory. a trope into the forest. With some barb wire. 
	- Dad gets super careful, Takes mine detector and goes slowly further. 
	- I say to him that maybe it's enough? Maybe we shouldn't go further? But he says that let's go 3m forward and see what's there.
		- It felt like "parents"lying to kid to make him do what they want without like a lot of hustle. 
	- I remember that he's trying to not blow up, so I tell him that should I step into his footprints? and he says yes
	- I see real anti-tank mine on our left. And try to catch up with dad. 
	- I'm very clumsy and careless, but remember that there may be anti infantry mines as well, so I start to stepping into his steps.
	- we go further than 3 meters. He doesn't say anything
		- But I have strong feeling it supposed to be some kind of advice about taking small steps before the overwhelming threat. Well, it's not strong. But that's what comes to mind when I think about it. 
	- The he says that the "fag***  is there, so I try to cover him.
	- But weirdly enough I take out the radio and point the antenna forwar, as if it was a gun. 
	- ## woke up - 
		- with visions of catching dones, like being so angry at them, that I just make them attack me, and in the last momen I catch their frame before they touch me or the ground
		- another thing was about how stupid radio-gun were. In dream it felt like it can harm people. But after I woke up I figured out I need a gun, and not a lousy radio. 
	- note - there was no confirmed guns or bullets or drones or else.
## TODO
- Typing is suboptimal. Another light check on äre you wake up"is distracting. Have to touch and scroll the display often. Ass is kinda getting numb cuz it's on the damn wooden frame of the bed. Neck issues too. 
	- IOS keyboard layout is damn awful. I have to fight with it
	- Figure out how to make this better

- # Home
	- Dad hadd to leave or something, and he like showered near entry of my door until I told him something that made him go back to the bathroom
	- Ok. I finished previous dream. Now about this one. 
	- AI was involved. 
	- But I really don't remember much. 
	- Dad came from the shower to my room to ask me something. And after he went back - there was like some watter on walls and floor. That's pretty much all I remember.






















## DREAM ANALYSIS

### Dream #1 - NAME

- #### Raw Dream
    - ##### Tips
        - `Ignore mistakes, formatting, structure, goal is to capture the raw fleeting dream without being distracted by all of it`
    - 
- #### Location & Environment
    - ##### Tips
        - `What you feel when you go/are there in real life?
        - `If it's unreachable/unknown - how would you feel being there in real life?`
        - `Is feeling positive/negative?`
        - `Why would dream use this location/environment and not other ones?`
    - 
- #### Analyze figures, what they represent, why they're there? \*\*
    - ##### Tips
        - `Why that figure there, how situation would unfold without that figure?`
        - `Is it positive or negative figure, how you feel about them, which emotions comes up? `
        - `Can it be the Shadow, or the Anima?`
        - `Is it internal representation or external relationships?`
    - 
- #### Emotional/Rememberable scenes
    - ##### Tips
        - `If there's particularly rememberable scenes - analyze why they're rememberable, what's their charge, what's so valuable in them, what they're hinting on? `
    - 
- #### Direction/Tendency
    - ##### Tips
        - `How it starts and how it ends establishes the direction/tendency of the dream which gives another perspective on it.`
        - `Direction is overlapping with compensation, but you should focus on positive/negative property`
    - **First sentence is**
    - **Last sentence is**
    - **Direction of the dream is**,
- #### Final feelings
    - ##### Tips
        - `Aftertaste of the dream. Feeling about the dream as a whole.`
    - 
- #### Hooks From the Past
    - ##### Tips
        - `Your ego was one-sided recently - where/when it might've been like that?`
        - `If dream is repeatable - then there's reoccuring tendency to behave in a certain manner - find it, look in the past for a pattern, not a one-off fluke`
    - 
- #### Likely Compensation
    - ##### Tips
        - `Which type of compensation is present? Does it inspire you? Does it deflate over-inflated ego? or does it confronts wrong actions/attitude by showing dreams into opposite direction?`
        - `Keep remembering that it shows you blind spots, so the answer isn't what's obvious, because you already see it. You must approach compensation from unexpected angle. `
    - 
