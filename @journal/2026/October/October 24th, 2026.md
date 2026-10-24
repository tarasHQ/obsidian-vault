
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
    - [ ] ==🟡try 15 fps and 4seconds keyframe== - but only if the size of current day will be ok. I think under 10 gig per day is optimal. 1tb per 100 days. Like don't think about future. Maybe in a year you won't need to record yourself anymore. So that's fine. If not - youtube will cover ya.  Also you can re-encode to reduce file size by 50%. So you can push 10gb. Right now it'll be around 7gb I recon. 
    - ###### AFTER NEW RECORDING
        - [ ] Check audio delay to webcam
        - [ ] Night scene
        - [ ] Check IP cam (quality, delay)
            - [ ] Night position
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
>Sleep Duration - **6:53**
> 
>Time Spent in Bed - **Medium**
> 
>Approx. Dreams Compensation - **As if the ceiling came down and pushed me to the ground**

---

## TASKS
%%Cognitive offload for the day, to not keep these in my mind for the whole time%%
- ### Active
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
	- [x] read through all remark42 docs. Now I'm ready to rewrite the plugin.
	- [x] wrote 00 step with checklists. 
	- [x] Fixed obsidian indentation issues with comments. Now can use them and everything is straight and beautiful.
	- [x] wrote dev rules
	- [x] reading through remark42 docs to not miss anything interesting before starting implementation.
	- [x] 🔴Now time to compose agents.md and figure out where remark42 goes (probably stays in it, since it's small.) 
	- [x] Fixed another issue with deskflow, when 
	- [x] successful optimization
	- [x] removing plugins/measuring performance
	- [x] Clean tech stack/libs section of agents + cleaning up unused stuff
	- [x] fixed worker build time, from 2 minutes to less than 30 seconds.
	- [x] fixed 404 page
	- [x] reducing cognitive load of chrome bookmarks (separators idea)
	- [x] Fixing more chore-level things in repo
	- [x] Preserving AHK security + obsidian smart startup minimized (only during boot)
	- [x] Add other google accounts in family to main one

---

## REFLECTIONS
%%Thinking through writing is much better - there must be low-friction place to do so%%
- ⭐[[../../../Productivity/_reflections/Can't start to work in the morning!|Can't start to work in the morning!]] - helped big time. So simple, but really effective.
- [[../../../@system/_reflections/Project's start and end steps|Project's start and end steps]]

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
- ###### 23:56
	- lots of friction for my flow, but also lots of improvements. I'm using cheap llm's , they think a lot. context explodes with thinking tokens. So it's a bit painful. But there's a lot to be done about this.  But yeah... I would appreciate not being poor right now) 
- ###### 23:35
	- Wasted. Just done. I'm pretty sure it's false tiredness. But it's there and feels real. Don't know how to get out of it...
- ###### 21:55
	- The issue with that advanced workflow is that in states like now I just can't be bothered going through all that boilerplate. Like I want to just type to LLM - "`rewrite plug based on that dump of notes I have and leave me alone in the meantime`". But I know it's pathological. 
	- I must wait through this post-meal crash out. And see what will happen next.
	- ==🟡Maybe size of my meals is too big? Like volume-wise. I don't eat much in calories. But like 70g of flour in bread + around 400-500g of meat + a tomato = maybe it's indeed to much. Thinner slices of meat. A bit less bread. But it's so good to have a nice full meal and watch something entertaining...==
- ###### 21:48
	- Ok, meal kinda charged me. Discharged at the same time a bit, cuz another "accidental" ai hype that got my attention. Like consciously I know that my project is like perpendicular and have at least potential to be somewhat successful, but unconsciously borders are blurred and I'm scared. 
- ###### 20:42
	- PMO cost me 2 hours. 2 damn hours. 15-minute thing - 2 hours in the trash. Awesome. 
	- And will I learn that I shouldn't do it? - no. Like it's as if brain just can't/won't do that. Next day comes, perspective shifts, and PMO will be on the table once again.
- ###### 20:01
	- Very subtle edge between barely doing the work without PMO, and trying to do the work after PMO. 
	- Like you think "might as well", but that makes all the difference. When you ride that edge of productivity as a wave - you get the best you can get. 
	- ==PMO just crashes the damn thing. You don't have the edge, but also you don't have the productivity==
- ###### 19:51
	- ==🟡Mistake.... mistake mistake mistake...==
- ###### 19:21
	- I can't even comprehend the difference between feeling like something is totally ok thing to do, and then 15 minutes later - it was a complete mistake. And to have it like that for years. Like the brain just denies to learn...
	- ==🔴 I didn't not waste 15 minutes. Like I'm just completely lacking and will to do anything as the result of it. So it seems like the cost of it is like an hour at least. If I'll manage to get that productivity back. Like I started at :00, now it's :26, I'm still neither working nor want to.==
	- Maybe I should just go eat? I'll fill the templates first
- ###### 17:26
	- Distracts a lot. Ok. I'll try a rule. Do whatever you want, but after I'm done with everything that is blocking plugin rewrite. So it won't be out of avoidance (aka automatism).
- ###### 17:22
	- Again want to PMO. A bit more issues than I expected. Or, well, not a bit. A lot. So pattern of behaviour tries to keep me away from that chaos. And it's a bit harder to control later in the day. But I'll try. 
- ###### 16:54
	- A minor health scare. Hopefully it passed.
- ###### 16:08
	- Yeah, want to relax again. Post-meal crash out is huge PIA. If I can squeeze in 45 mins maybe it won't happen as much? Like I have some impulse to work at that time point. Usually. 
	- What if the unconscious just wants me to relax and take it easy for a while? Like I'll do that for 15 minutes. 
		- ==🟡It worked. I waited till the second impulse, made sure it's real and not a fantasy, like I really want to do the task I need to do - and seems like it placed me into the right place. Not super enthusiastic, but I'll voluntarily work with the proper attitude.==
- ###### 15:05
	- ==🟡ALL OF THIS HAPPENED BECAUSE I DIDN'T SUCCUMB TO PMO AUTOMATISMS==
- ###### ==🟠14:54 Meal #1==
	- 5 hours into the day. I'm happy with the progress. Not super fast, but maybe it's the optimal combination of progress-"good decision making". Website is light. Builds are fast. Lighthouse score is 98. Docs are almost done. 
	- ==🟠PLANNING TO EASE IN TO THE NEXT SESSION==
		- Docs
			- Finish Agents. Not much left. Just organize. Number. 
			- dev rules, to have something going on for writing the same consistent code
		- Then you move to rewrite remark42 plugin
			- md files are already there. 
			- you create phase 001
			- research/plan/execute
			- also get feedback/experience on current "alpha" workflow.
		- When plugin is done
			- Plan config, skeleton, styles, fonts.
			- The main thing here is after that is done - you will be able to significantly reduce time-per-day working on website, and can catch up with pending tasks. Major "freedom-checkpoint"
- ###### 14:27
	- Yeah, going fast. Besides rewriting agents doing lots of work around that. 
- ###### 13:24
	- Laying down in the chair. Marker. Pattern. 
- ###### 13:19
	- Still want to PMO a bit more than I would like to sit with. Distracting as hell. But seems like that's the energy that allows me to be highly productive. If I PMO - I'll drop to baseline or lower. I shouldn't.
- ###### 12:42
	- Man that reflection was life saving. 
	- Bread recipe also gets better. I'm doing mini-bread, which is based on 150g of flour, and it's PIA to have it nicely puffed up in automatic bread maker. But I'm getting better at it. Bigger bread from less flour = I will eat less bread, since "normal" bites will more "air". So hopefully I will be able to have sustainable recipe where I can spread 150g of flour into 4 meals/2 days, so it'll be 37.5g of flour per meal => 26g of carbs. Which is SUPER good. It will be "have a cake and eat it too" situation. 
- ###### 12:23
	- Ok, I'm getting some speed. Also I have this feeling that there's potential to be hyper productive. Like it's there. It's real. I just need to align myself with the unconscious. There's real value in these things.
- ###### 12:08
	- ==🟡Want to PMO. I keep forgetting why it's bad - and here's the real reason. I have a task, and I get distracted by urges to avoid. Like PMO won't make me battle-ready after either. It gives false promise now, but time after time - it's all the same. So I won't entertain such thoughts==
- ###### 11:43
	- So that's how it is. When I'm in a proper state of mind - I would torture myself for times like right now. Where I don't care and can't start.
	- Instead of 15 minute timer - can I do 10 minute walking reflection? Maybe it'll get me going the same way it did yesterday (though I was kinda hyped before that)
- ###### 11:25
	- This time don't want to work at all. 
- ###### 01:14
	- Will make my life easier. For nights will move camera upward a bit, to avoid explicit poses and blurring them out after))