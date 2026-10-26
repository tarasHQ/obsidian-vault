
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
    - ==Don't process the video before sleep. Cut it right when you go to sleep. And process in the morning. ==
        - This gives more natural flow when you finalize the day, write overview, and go to the bed. It makes more sense, then cutting it down like 2 hours before you actually go to the bed and your day ends.
    - ###### TECHNICAL CHECKS
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
    - [ ] Only now you can stop the video

---

## OVERVIEW
%%Block to easily skim through journal entries and remember/identify which day it is based on key things that happened%%


---

>[!tldr] CONTEX
>Sleep Duration - **7:30**
> 
>Time Spent in Bed - **Low**
> 
>Approx. Dreams Compensation - **Stressed, action-oriented, ready to fight, higher aggression**
>Don't remember much from dreams. Compensation feels weak. Surprisingly. Because of how messed up previous days were...

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
- [[../../../Psychoanalysis/_reflections/I just don't know|I just don't know]]

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
- ###### 20:28
	- There's 
- ###### 19:45
	- ==🟡Let's see if this Timeframe thing will work after the meal, or it's just the false motivation of the same kind that makes me super motivated right before I'm going to the bed and know that I won't act upon that motivation==
- ###### 18:17
	- What if I fall on my knees and pray to God? Privately, so it can't get performative. Like I don't have any other options.
- ###### 18:09
	- I need meaning in my life... I just can't... I'm starting to collapse. Like there's no purpose in what I'm doing. It's just sad. And I really want to just binge indulgence loops. Because there's nothing left besides that.
		- Like it's plain and simple, there's nothing complex to this. No meaning = cheap pleasures are what is only left on the table, so why shouldn't I take it? Like yeah it's "bad", but where do I get that meaning? 
			- I need to drown in indulgence for a while, to get autonomous compensations. And that's like reliable. 
			- Voluntarily? That's much much much harder issue. Because like right now all I'm thinking about is whether I should order a pizza or go to eat whatever I have. Like nothing besides that is important to me AT ALL. 
		- Recording helps to not fall into binges, YET. But it doesn't really help to get that meaning going. Like it's not about motivation, I just don't care in the first place because of lack of meaning to my actions. 
- ###### 17:19
	- Issue with these minor tasks is that they feel insignificant and meaningless compared to that proper plan flow. Like yeah it was PIA, but each step had some intrinsic significance because it was embedded into the bigger "path". 
	- Now? Like yeah, I'm playing with fonts, yeah, it's nice. set up some other stuff. Figuring out theming. But they feel like "one out of a million"-kind of task. 
		- And besides that - if I decided to do current task properly, through the flow - I would've added those ideas I captured in other notes. [[plans/quartz-website-plan|quartz-website-plan]]
- ###### 16:46
	- I don't know. I gave the freedom to puer - and as result, not much happening. 
	- It's kinda partially my fault. For some reason worker won't build my commit. So I'm just stuck waiting. But maybe that's the issue with speed. Like it's another layer of meta problem solving. Like you should figure out how to solve problems, before you actually start to solve problems?
- ###### 15:49
	- Seems like a bit too much restrictions maybe? Today I'm kinda in free flow, and because of that - I can be productive much more easily. Like even after the meal there was not much resistance.
- ###### 13:42
	- ==🟡It feels like there's so much potential in my project it's insane... Like those failures, they're like the best I can ask, because if I manage to use that wisdom to reach that polished workflow of maximum-speed - then everything from my project is now implementable.==
	- Like it's a deal breaker. Because the main discouraging point of "today" is that I "can" do lots of great things, but I can't do it with reasonable speed. 
- ###### 13:09
	- Inverter is so quiet though... So nice. It was so worth it.
- ###### 12:48
	- Spending time on pseudo-productivity. Basically "gaming". Sad, but at least it's something. And not like me being completely wasted and depressed. Though I'm curious how it affect me post-meal. 
- ###### 10:47
	- Well, helped a bit to naturally get into the main task. Small wins, probably. 
- ###### 10:24
	- Going through archived notes. To delete what's useless, to not carry those with me. 
- ###### 10:11
	- just see no sense in doing anything right now. But the thing is - this is worse than doing anything. So maybe that scope thing? Ignore everything. Just do something. Timer too?
- ###### 09:56
	- Had a thought when was doing routine and then in shower. What made me miserable in the last days? - **rushing**, like I like this problem solving. But not when my life depends on it (literally), and there's clock ticking on top of it. Maybe I need to learn to pick scopes and change perspectives? Who knows. 
	- It really hard to integrate this "knowledge". Easy to forget, hard to remember, and when the wrong state comes - those won't even be considered as valuable things to do.
- ###### 00:25
	- But would I trade today with the usual day of indulgence loop? Well, cuz I’m not sure - it already says something. 
	- I would probably though. But at least I hesitated a bit. 
	- It’s just really hard to get that meaning in this isolated struggle. 
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
	- Don't know what to do. Don't have hope. Or meaning. It's just purely mechanical and inertial.
	- I guess tomorrow I'll have to finalize plugin and figure out new iteration of the workflow? God willing I'll be able to finally forget about that damn plugin...