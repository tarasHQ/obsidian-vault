
%%[[[T]daily-journaling|Daily Journal Template]]%%

```meta-bind-button {fold}
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
label: Remove Morning Checklist
style: default
icon: trash-2
cssStyle: "height: 22px; min-height: 0; padding: 0 6px; font-size: 11px; line-height: 1; gap: 4px;"
action:
  type: js
  file: _static/scripts/meta-bind/journal-remove-checklist.js
```
- ##### MORNING CHECKLIST
    - [ ] Day scene
    - [ ] Check webcam (exposure)
    - [ ] Check IP cam (quality, delay)
        - [ ] Move to "day position"
    - [ ] Check all elements are present on the canvas
    - [ ] Check TickTick schedule 
        - [ ] correct day, scheduled, scaled
        - [ ] red "now" line is there
    - [ ] Fill Context block

```meta-bind-button {fold}
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
            - [ ] Move to "night position"
        - [ ] Check TickTick schedule (correct day, scheduled)
        - [ ] Set time of next sleep for stager timer.
    - ###### BEFORE SLEEP
        - [ ] Write overview of the current day
        - [ ] Create journal for the next day
        - [ ] Move uncompleted tasks
        - [ ] Make sure all day's reflections are linked under reflections
        - [ ] monitor contrast/bright. at 0

---

## OVERVIEW
%%Block to easily skim through journal entries and remember/identify which day it is based on key things that happened%%


---

>[!tldr] CONTEX
>Sleep Duration - **0:00**
> 
>Time Spent in Bed - **TODO**
> 
>Approx. Dreams Compensation - **TODO**

---

## TASKS
%%Cognitive offload for the day, to not keep these in my mind for the whole time%%
- ### TODO
	- [ ] FIX - templated creation of next journal entry. 23:53 - "This day already exists"
	- [ ] Templates for reflections - maybe shouldn't use project backlinks for now, until I figure out if there's gonna be "main index"
	- [ ] Bring back screenshots of desktop. BUT ALSO add analysis routine. (not sure if it's good for the night, but you need to do it after you woke up? Or like after the first meal. So it influences the current day on top of extracting patterns/insights)
	- [ ] You need simple back/forward(automatic visibility if exists) navigation between journal entries. (or use calendar plugin for the time being)
	- [ ] You need a to select a block of text, press hotkey and save it as a reflection with link that replace selected text. (also it should have same frontmatter as current flow)
		- [ ] On top of it, current flow of templated reflections probably should force copy link into clipboard as well. These shouldn't be in the journaling, because they give constraints on the size. 
			- or maybe you just use initial `_reflections` flow instead of limiting yourself within the journal entry? 
	- [ ] 🔴[[plans/better-schedule-plan|better-schedule-plan]]
		- Tick tick becomes PIA. Limited too. Maybe there's something else? Maybe there's self-hosted things? 
	- [ ] Rewrite remark42 plugin. Properly. With the new workflow. 
- ### Priority
	- [ ] 
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
- ###### 00:02
	- The issue is the speed. Like it's not about how much I can work. But the speed of that work. 
	- Example?
		- That remark42 plugin. It was working fine. I rewrote it in like 2 days - works kinda the same. Like yea, code is more streamlined, and it's more efficient traffic wise. But like I don't know if there'll be people leaving comments at all. Like I spend lots and lots of time on this for no real benefit.
		- Long-term? Like maybe. But... it's just... too slow. 
		- Ideal case scenario where I have streamlined workflow that allows me to execute those 2 days in 6 hours - that's another thing. To do properly and fast - it's worth it. But it's not the case right now. And I'm not really sure it ever will be.
	- It's just sad honestly. That's the message of the unconscious, or part of it. Like good job, you did the comments section in 2 days "properly". But now you're on the path where you will drop the thin long before any comments will be made on the website, so you might as well just jerked off for 2 days - you would've had the same result. 
	- **Solution?**
		- Like I can't just do the job poorly. It'll kill my spirit even faster. So only way is to have really good workflow that is deterministic and routinized. And at least partially llm model-agnostic. 
		- **The issue** is that this nestings don't make my life easy either. Like what it is now? to fix the life, i need to succeed in project, but before that I need to be hyper productive, but before that I need people and community, before that I need to make my life public and to not be stupid about how to do it, and before that i need to have properly set up youtube recordings, websites, repositories vaults, and before that, I need to proper workflow. 
			- Like yeah, how long that chain will get until it'll loop on itself? 
			- 

---

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
