
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
        - [ ] monitor OFF (seems like keeping on makes him die faster)
        - [ ] Cleaned up cat's litter box

---

## OVERVIEW
%%Block to easily skim through journal entries and remember/identify which day it is based on key things that happened%%


---

>[!tldr] CONTEX
>Sleep Duration - **6:32**
> 
>Time Spent in Bed - **Low**
> 
>Approx. Compensation of Dreams - **Grounding**
>Don't remember much dreams. Just one brief scene when a drone blew up near a guy and he lost part of his leg below the knee. Was gruesome a bit.

---

## TASKS
%%Cognitive offload for the day, to not keep these in my mind for the whole time%%
- ### TODO
	- [ ] **META** Figure out where to accumulate such secondary tasks and where you can prioritize them, because flat list is stupid and limiting. 
	- [ ] Ideally to go away from the minimal theme. It does add a lot of things that I don't use, and basically a deadweight. Like it's better to have 30 styles in CSS than like 2 plugins with 100 settings + a theme . 
	- [ ] [kinda priority] flow to compress png into webp from screenshot, so it won't harm neither website nor size of the vault. But also figure out if deskflow can do it, because right now it's half-supported. (or don't do it through deskflow)
		- priority because it adds another dimension to thinking + cognitive offload. 
	- [ ] dataview -> move to that default rendering pipeline, current one doesn't have flashes BUT it's blocking rendering of the note, which is not good either. (worse)
	- [ ] folder icons - rename to where they used and resize other icons (260kb per icon is stupid)
	- [ ] FIX - templated creation of next journal entry. 23:53 - "This day already exists"
	- [ ] Templates for reflections - maybe shouldn't use project backlinks for now, until I figure out if there's gonna be "main index"
	- [ ] AHK - run separate user of vscode as admin to be able to edit the script? 
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
==🟡SCOPE. TODAY. NOW. NOTHING ELSE MATTERS==
==🟡SCOPE. TODAY. NOW. NOTHING ELSE MATTERS==
==🟡SCOPE. TODAY. NOW. NOTHING ELSE MATTERS==
==🟡SCOPE. TODAY. NOW. NOTHING ELSE MATTERS==
It works. It truly does. 

```meta-bind-button {fold}
label: New Log Entry
style: default
icon: clock
cssStyle: "height: 24px; padding: 5px; font-size 11px;"
action:
  type: js
  file: _static/scripts/meta-bind/journal-time-entry.js
```
- ###### 14:43
	- First time when massive Claude update motivated me. I really do have a chance with my project. But I must hurry. That's why unconscious sometimes gives me those feelings I wrote before. It reminds me to not be unnecessary slow. 
- ###### 13:51
	- Found single like on a video. How little encouragement I need to have sudden urge of meaningfulness. That was very nice.
	- Another thing is reviewing videos before the meal - HUGE WIN. Because before the sleep I'm dead, I skim through them. But now - I'm like analyzing more. I see how I behaved externally. 
		- ==But the biggest thing is I'm kinda getting emphatic to that guy on the video. First ones were kinda like shameful and weak. Now - it's getting a bit more serious. I'm still flawed as hell, and everything is still a mess, but I'm looking and those videos - a lot of work and effort there. It's not nothing at the very least.==
- ###### 11:52
	- 25 minutes later - meaning is withdrawn. Is this really mechanical like that? Would be nice if it is. The only issue is to start from this state. Because it's like generating lots of frictions. I should stop using like) Is there anti-dictionary plugin?
- ###### 11:27
	- Man... those thoughts just fly. Lots of creative stuff. Workflow planning is locked. Now - implementation. I have ~90 minutes till I get tired and hungry. I should try to do that within this timeframe, but it's fine I won't be able to. It's just like motivation. Then after the meal - you're basically can go back to real work. Which is kinda enthusiasm-inducing thought.
	- I wish I would've had better schedule though. Like I look and that day and there's just "WORK". Boring. I need something like that I can plan from specific time, and not have those empty spaces or issues with scheduling overnigh
		- This gets me sidetracked... But I'm so damn curious to search on this new topic. Like yes, that's it - schedule from waking up. One "day-session" block. 
- ###### 10:46
	- I start to feel contemptuous with these vibe coded stuff. That's an issue. It's toxic. 
- ###### 10:29
	- This tool though. Because folding doesn't get saved, now, when I work through the file and fold passed block of text to reduce cognitive complexity - they will get randomly unfolded. Not to mention that it'll happen on other devices by default. 
		- That's an issue because it would be useful tool to use. Not anymore I guess. So I must figure out a way to do this so it won't bite me in the ass going forward. 
- ###### 10:17
	- Some AI-coded plugins man... like those are give me hope that my project might be worth doing it, because like it's a simple plugin - and "agents" are still fail to deliver proper functionality. It really seems like it does rot people's ability to do things properly... 
	- Like it's one thing when you don't know things, but here - it's just right there in the face. It can't be any more obvious. And still it wasn't done.
- ###### 10:05
	- Had also tasks to do on website that wasn't like hyper primary, but needed to be done at some point. So I did that. It kinda sucked me into the usual flow of work, and now I'm more inclined to tackle that main task with workflows. It's just very cognitively requiring task...
- ###### 09:37
	- Get visions in my mind how my project would be too late to be distinctly good... Maybe it's the unconscious way to like rush me? Because I definitely want to "run" right now.
- ###### 09:11
	- Making bread after second meal is good. I will clean cat's litterbox before the sleep. That way in morning I will have only toilet->washing up->coffee->work. 
- ###### 09:07
	- Woke up. Did all things from checklist. Routine continues. I'm not really in the mood to work though. 

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
