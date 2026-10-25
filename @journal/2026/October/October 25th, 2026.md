
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
    - [x] Day scene
    - [x] Check webcam (exposure)
    - [x] Check IP cam (quality, delay)
        - [x] Move to "day position"
    - [x] Check all elements are present on the canvas
    - [x] Check TickTick schedule 
        - [x] correct day, scheduled, scaled
        - [x] red "now" line is there
    - [ ] Fill Context block

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
>Sleep Duration - **7:20**
> 
>Time Spent in Bed - **Low**
> 
>Approx. Dreams Compensation - **More promise and hope**

---

## TASKS
%%Cognitive offload for the day, to not keep these in my mind for the whole time%%
- ### TODO
	- [ ] Templates for reflections - maybe shouldn't use project backlinks for now, until I figure out if there's gonna be "main index"
	- [ ] Bring back screenshots of desktop. BUT ALSO add analysis routine. (not sure if it's good for the night, but you need to do it after you woke up? Or like after the first meal. So it influences the current day on top of extracting patterns/insights)
	- [ ] You need simple back/forward(automatic visibility if exists) navigation between journal entries. (or use calendar plugin for the time being)
	- [ ] You need a to select a block of text, press hotkey and save it as a reflection with link that replace selected text. (also it should have same frontmatter as current flow)
		- [ ] On top of it, current flow of templated reflections probably should force copy link into clipboard as well. These shouldn't be in the journaling, because they give constraints on the size. 
			- or maybe you just use initial `_reflections` flow instead of limiting yourself within the journal entry? 
	- [ ] 🔴[[plans/better-schedule-plan|better-schedule-plan]]
		- Tick tick becomes PIA. Limited too. Maybe there's something else? Maybe there's self-hosted things? 
- ### Priority
	- [ ] 
	- [ ] Rewrite remark42 plugin. Properly. With the new workflow. 
- ### Completed
	- [ ] copy_from_here
	- [ ] 

---

## REFLECTIONS
%%Thinking through writing is much better - there must be low-friction place to do so%%
- 

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
- ###### 13:45
	- Ok, so probably I found the reason. Provider selection didn't work. Openrouter was randomly using providers, all of them wasn't on fp8 quantization (like it could've been even lower than fp4), so I fixed it, and will see how it will behave now.
	- Seems like it's better now... will see...
- ###### 13:22
	- I'm doing something wrong here... Feels like that. But I can't NOT use cheap llms. But also they think so damn much it's insane. Like a 10k tokens per thinking. And it's not even "max" reasoning. That gets me discouraged. The longer they do this bs - the higher a chance to get absolute crap on the output. 
	- I get angry and frustrated again. It's just a load of BS this thing. Like why they spam reasoning for so damn long...
- ###### 13:08
	- Getting sleepy. Rewrite takes a bit too much time... But I'm doing additional interesting and useful things in parallel. So hopefully it's worth it.
- ###### 12:28
	- It has lots of friction, but I'm moving. Sometimes one needs to act before thinking. This was the case. Like I god "visions/imagines" in my mind even before I started to reflect - that was the first hint about what should I do. Unconscious was helpful even then. 
	- It's weird. Unconscious complex possessed me, and at the same time, something from the unconscious helped me to get out of that possession. Don't know how to wrap my head around it...
- ###### 10:49
	- GLM feels like a breath of fresh air. Don't know why deepseek was so uncomfortable... 
- ###### 10:42
	- It honestly feels like LLMs are getting really tied towards being agentic. Which means they spam as much things as they can, and in agentic loops/harnesses it gets processed/filtered/etc. But in manual loops - it's PIA to deal with. So what it leaves me with? Well, I wasn't so much confused with glm. Then let's go back to glm.
- ###### 10:39
	- Again get discouraged a bit. This walls of reasoning and poor decisions make me anxious. Like if I can't use LLMs for cheap - I'm done. That's what makes me discouraged...
- ###### 09:52
	- ==🔴Ok. Timer. 15 minutes. Imagine you're a grown up and mature man that has to untangle the mess==
		- Like don't forget that being in current state is choice. It's bittersweet. 
		- And also seems like that's why the unconscious was resisting to a reflection, because it wanted an action instead.
		- ==🔴Worked for sure. Like it caught me by surprise how easily I snapped out of it. Because it felt like a huge burden on my spirit that won't go away that easily.==
- ###### 09:51
	- The issue is that I just don't want to do shit. 
- ###### 09:43
	- I'm just a mess, I'm 5 minutes away from crying. It's just load of crap. Everything.
	- But I must make it clear. It's my fault. Not LLM's. Not the project's - mine. You play dumb games - you win dumb prizes. 
- ###### 09:24
	- Low in the mood. Can't even start reflection about tonight's events. 
	- Obviously why. There's damn dragon beneath all of what's visible on the surface.
- ###### 01:34
	- ==🟡Focus on what went wrong tonight. Reduce size of tasks. Figure out how to approach recurring context fillings if you do minor steps.==
	- Because of Pom you had low productivity and was frustrated by that. Which lead to walking on thin ice. LLMs definitely were frustrating , but you added on top of from your skewed perception
	- Everything is good nothing crumbled you can figure it out.
