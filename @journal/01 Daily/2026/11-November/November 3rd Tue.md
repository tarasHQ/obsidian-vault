---
journal: Daily
journal-date: 2026-11-03
---

```journal-nav {fold}

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
	- [ ] Check audio delay to webcam
	- [ ] Check TickTick schedule (correct day, scheduled)
	- [ ] Set time of next sleep for stager timer.
	- Obsidian
		- [ ] Write overview of the current day
		- [ ] Create journal for the next day
		- [ ] Move uncompleted tasks
		- [ ] Make sure all day's reflections are linked under reflections
		- [ ] Delete Dream Analysis block if empty
		- [ ] Delete other blocks if empty (task/reflections)
	- [ ] Night scene
	- [ ] Check IP cam (quality, delay)
		- [ ] Enable sleep blur
	- [ ] monitor OFF (seems like keeping on makes him die faster)
	- Cat
		- [ ] Clean up cat's litter box
		- [ ] Food + plate is in my room at the shelf 
			%%(to feed right away and not be distracted by her)%%
	- [ ] Make sure there's tomorrow's food out of the freezer.
	- [ ] ==🔴Right before going to bed - switch to 48kHz audio and restart OBS==
		- [ ] And run it as admin.

---
%%[[../../../../_static/templater/[T]daily-journaling|Daily Journal Template]]%%

## OVERVIEW
%%Block to easily skim through journal entries and remember/identify which day it is based on key things that happened%%
Remove. Goal of the overview is condense a day into a key points. Don't start with reflections/ideas/etc. Just condense.

---

>[!tldr] CONTEX
>Sleep Duration - **6:30**
> 
>Time Spent in Bed - **Low**
> 
>Approx. Compensation of Dreams - **Sad as hell**

---

## TASKS
%%Cognitive offload for the day, to not keep these in my mind for the whole time%%
- ### TODO
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
	- [ ] Your budget is limited but sync is important. Maybe selfhost livesync? 
	- [ ] Mouse has 12 buttons. But actually customizable are like 3. Because 2 buttons for tv on/off to preserve organic diodes. And 3 for music control. 2 for back and forward. 1 for win menu. Not much left. 
		- And if I had a modifier. Either through shift(but check conflicts with ahk) or through mouse buttons. Like rmb (if it's possible), then on rmb you can place rarely used functions. And have more buttons for actively used ones
	- [ ] **META** Figure out where to accumulate such secondary tasks and where you can prioritize them, because flat list is stupid and limiting. 
	- [ ] Ideally to go away from the minimal theme. It does add a lot of things that I don't use, and basically a deadweight. Like it's better to have 30 styles in CSS than like 2 plugins with 100 settings + a theme . 
	- [ ] flow to compress png into webp from screenshot, so it won't harm neither website nor size of the vault. But also figure out if deskflow can do it, because right now it's half-supported. (or don't do it through deskflow)
		- priority because it adds another dimension to thinking + cognitive offload. 
	- [ ] Bring back screenshots of desktop. BUT ALSO add analysis routine. (not sure if it's good for the night, but you need to do it after you woke up? Or like after the first meal. So it influences the current day on top of extracting patterns/insights)
	- [ ] 🔴[[plans/better-schedule-plan|better-schedule-plan]]
- ### Completed
	- [x] Obsidian Headings  %% fold %%
		- They contain a lot of structural potential. The issue is that you need to work on it. 
		- [x] Non-bulleted headings. Looks stupid when you have h3 of category and h4 below it. They need some indentation/guide lines/etc, but without being in list (press enter once - done)
		- [x] h3+ headings are kinda PIA to spam buttons to set them up. You probably should use ahk for alt 456 hotkeys to just insert 456 `#`, seems like there's no plugin that can do it, and native hotkeys removes the heading from the list
			- [x] no they're not PIA worth to have another PIA with hotkeys in multi-device setup
		- [x] Different font. But not sans. It's not article. Goal is detach heading from text
	- [x] Templater flow with plans. %% fold %%
		- [x] step start and end - should be extracted into shared non-templates through LLM.md, they're SSOT on universal template of the project, so there's no need to keep them in each phase (likely)
			- [x] Opposition would be about phase specific final checks, but probably it should have just its own last phase before completion. That way it'll be much easier to maintain all of this. SSOTs as much as possible.
		- [x] Have selected project name in phase number selection (to double check)
		- [x] Ask for plan name and description to automatically paste into project and plan name
		- [x] Preselected number should include phases in `_archived/` as well.
	- [x] Youtube - you have to do thumbnails anyway, autoselection is unreliable and will cause more headache because of the absent flow - selects only me sleeping.
	- [x] AHK - run separate user of vscode as admin to be able to edit the script? 
	- [x] folder icons - rename to where they used and resize other icons (260kb per icon is stupid)

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
- ###### 21:54
	- 9 hours of work only. And I'm so done... Don't know how to measure current progress. Can be slow, can be fast... who knows. 
	- But I start to see the speed. Like how long I need to launch this websites? It's been weeks. Time flies insanely fast... 
		- Like if today's work would've been done in a 3-4 days - then yeah, it's good progress. But there's also a risk that it could've been done before the second meal - then it's an issue
		- Probably I need to just sleep more I guess? 6:30 not enough if psychoanalysis is included in the day?
- ###### 20:49
	- Kinda tired though, not gonna lie...
- ###### 20:26
	- Nap maybe helped? I don't know by this point since I ate too. I'm not discouraged though. (significantly), so yeah, when that state comes maybe I need to just relax for 15-30 minutes? Like maybe it's genuinely more productive thing to do than to fight it and make suboptimal decisions (at best).
- ###### 18:25
	- 15 minutes nap, then I'll see how mood will change. Maybe I just need to relax a bit. 
- ###### 18:08
	- Ok, A nap might a be a solution or a meal. To use this abrupt dip as a marker to act upon. 
- ###### 18:04
	- Yeah, 15 minutes and I went from happy to pretty discouraged while nothing changed. Like yeah, got a few minor obstacles, but those are not a big deal. 
	- So what to do now? Mother/Father/Warrior? 
- ###### 17:57
	- And here's crash out. Interesting. So I can't be happy? Or I should like restrict myself? Though I won't say that I was like flying off the handle from all the happiness. It was just a bit elevated mood.
- ###### 17:36
	- I'm in a good mood. That's probably what happened when I invoked the Father's archetype energy from that Lion King scene I watched. Now I don't want to watch it. Same with Anoana. Which is interesting too, because like sometimes I want and sometimes I don't, it has a reason, it's not random.
		- maybe I feel good because those two archetypes are active in my mind? So I don't long them as external symbolism or something?
- ###### 16:21
	- Is this heightened state of mind is a good thing? I'm not sure.
- ###### 16:16
	- Flow is going good for now. Have like 13 improvements, but even now it's much better than what I have. 
	- I wonder what would it be if I lived a year through focused Jungian work? Like in recent days, where I give it 1+ hour of absolute full attention.. Like this stuff works for me. Even with my very limited knowledge. Imagine what would happen if I did that knowledge integration system and started to properly work on integrating that knowledge? 
- ###### 15:44
	- ==Interesting that I loved to watch police bodycams or war footage during procrastination. Exactly the Warrior archetype projection. And then suddenly out of nowhere I decide to act. ==
- ###### 14:58
	- Why I cry on every damn thing?
	- Ok, seems like when the Simba talks to Mufasa is kinda near it. It's definitely doesn't bring motherly energy. It's this judgmental father in the sky that guides you through hardship - there's something to it. 
	- Exactly the same thing as in that "war dream" I had. But my father is alive, and he's not acting like a father, well, and he shouldn't by now, it's my inner child's sorrows. The thing is symbolism gets a bit convoluted. 
	- p.s. man they're butchered this scene in 2019 Lion King... 
- ###### 14:47
	- What about cleaning? 
- ###### 14:30
	- If father was guiding me in that dream. What if Peterson's lectures was kinda like Anoana clip? And it was unconsciously waking up the Father that guided me? 
		- Nah. The Warrior at best, and even then... Dreams images would be more effective. Seems like obviously this kind of music won't cover all archetypes. For the father it seems like the Peterson lectures might be the best media I got so far. 
- ###### 14:26
	- But the post-meal crash out is real though. Very sticky. Happens almost always. Maybe that's why I should try to eat in silence my first meal, as I did yesterday and came to the same conclusion? 
- ###### 14:19
	- Meal took a bit longer to cook, forgot to unfreeze the meat. 
	- Also watched myself on today's session. Weirdly enough it was hard to watch. I don't know whether I should make this public. Like to be transparent kinda should include lows too, and make them real, not theoretical under "privacy mode". But that's a bit tough anyways. 
	- Am I concerned about being "cry-baby"? Nah, this integrated into the framework of aiming up. I don't cry because I want attention or empathy from other people. I cry because something in my unconscious needs to talk, and crying - is how it talks. I know that if I didn't explore this today - I probably would messed up the whole day. With high chance of stopping recording too. And probably the binge loop also. So yeah... I'm walking on very thin ice and I should be thankful that I'm not giving up on the every day, because reality is not to question how to be more productive, but to question why the hell I keep aiming up.
- ###### 13:12
	- ==🟡I give indulgence too much attention. It takes like 30 minutes per day at worst, but I'm tortured by this for hours. That's why the dreams weren't targeted at this. The issue isn't indulgence. It's like secondary issue of the secondary issue. Don't give in. If it happens - it happens. Don't get guilty. It's not important at all if you don't waste hour+ into this. Under hour it's not harmful enough to be concerning. Develop those inner figures, and at some point it will disappear by itself.==
- ###### 12:49
	- Ok, this flow is better. It's not perfect, I already have ideas, but like I ran it - and it just engaged me. I understood everything. No overwhelm. Lots of good decisions made and future headache avoided. 
- ###### 12:02
	- Out of nowhere. So the issue is changed perspective. Like I just don't see it as a bad thing.
- ###### 11:36
	- Some friction is there. I can figure out why. PMO urges too. It's so stupid. To not be horny at all and have urges to PMO. 
- ###### 10:38
	- 1.5 hours, but man is it worth it. Like yeah, I'll forget most of it in a few days (or maybe not?), but the thing is - there's a practice that is kinda getting into routine and some of it will be integrated. Do a year like that - and maybe I will have to seek a new name)) 
- ###### 10:19
	- ==🟡I just realized that I got the answer on my night's prayer about indulgence==
		- I may be misinterpreting, but it seems that I need to develop those internal relationships. I was thinking that people give me the meaning, and I need close friends, parents and a partner in my life. It's true. But what if it's as important for introverts(or all) to have close internal relationships? 
			- Like introverts have a tendency towards inner world, not external. So maybe inner relationships are just more important? 
		- Back to indulgence though. Well, maybe I need to seek someone within me when the urges arrive? The Warrior? The Father? 
			- ==🔴Another good point by LLM - I shouldn't turn those figures into a vending machine, it won't work in relationship with real people, it won't work with inner figures as well. 
			- The goal is to have a relationship developed enough, that when the urge arrives - there's already someone "in the house". 
- ###### 09:52
	- ==🟡When I'm truly sad - I must seek the Mother. Anoana clip seems like a good way to invoke that motherly "thing". Let this sadness out. Grieve what you have to grieve. ==
		- In this case when I didn't forced myself through that sadness - I just had a full blown meltdown, like I was barely holding on to not make it "loud". Don't know right word in English. But I mean like when crying is loud, and not just tears. 
		- I'm not sure what are consequences of this, but it's seemingly better than waste half of the day in this sadness?
	- ==🟡Why I was sad?==
		- LLM said that it may be about grief. I gave it a thought for a minute, and it instantly resonated. Previous day was good. I did everything I wanted to do. Workflows ready. Docs ready. All meta-planning level is refined and good to go. But I had no one to share this with. 
		- It's just me. That felt/feels so damn painful, that I just broke down. Like sometimes I don't care about this stuff at all. But maybe that's manly man attitude. Like I may not care on the surface, but being alone is hard, like completely alone. Being alone in my current situation against all the pressure and challenges - triple as hard. And when I win finally arrives - it's also punishing. Because you go to eat alone. You lay in the bed alone. You wake up alone. You live alone. 
		- So no shit it comes up from time to time to remind you about it. **And I think it has a compensation** embedded in it, because when I win, I may start thinking (or forget) about that loneliness, that I do not need close relationship in my life. And then such compensation comes - and shows what's what. 
			- **BUT, it's not only about external relationship** - I start to think that it's primarily about internal relationship with parts of me. Because ==🔴the unconscious knows that I will be alone for very long time==. And I tried many times to rectify relationships with my father, but for the time being I won't be able to go beyond "distant sponsor" depthness of connection. 
				- LLM pointed about fatalism. Unconscious compensates present attitude - it doesn't know the future. I should be careful with wording.
			- So, **the only way is to develop internal close relationship** - I'm yet to find how. But seems like it's the only way. 
	- ==🟡I know how to develop internal relationship==
		- Like I just had a major intimate interaction with the Mother. And it helped me. There's still some residue, because, like I didn't have such breakdowns in years maybe. But in that pain I really did felt the Motherly love within me. So that's one way to do it. 
		- With time you will learn to have a relationship with the Father too. (if you need to do it, because like the unconscious really pulls you towards seeking the Mother, but the Father is kinda there already)
- ###### 09:21
	- Prayed tonight for the dreams on how to deal with the indulgence. Didn't remember jack shit. 
	- I think that at some point exercise would be necessary to sleep 7+ hours and fall asleep fast AND be on the same sleep schedule. Or maybe that's because I drank black tea. Which is reach in caffeine too. 
		- Because seems like if I sleep <7 hours - I barely remember dreams. I do get compensated though, which is why I'm so sad. 
	- I'm basically 5 minutes away from just falling apart in tears. 