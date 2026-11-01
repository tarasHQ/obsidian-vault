---
journal: Daily
journal-date: 2026-11-01
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
>Sleep Duration - **7:10**
> 
>Time Spent in Bed - **Low**
> 
>Approx. Compensation of Dreams - **Dreams were "high", but woke up a bit low**

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
- ###### 12:31
	- Yeah... there was psychological pain from all this stuff, so out of the blue I just dived 
- ###### 11:44
	- Too many things to do. That's the issue. I'm constantly teared apart by million tasks. And starting just doing it is kinda bad because .
	- That's why I SHOULD focus on these things. Because obviously I'm pushing limits on my executive capacity, I need some smart as hell system to abstract this. 
		- Like it should be hierarchical. Current blocks in flows/plans prevent me from doing phase 002. So I should be able to navigate in this system through hierarchies, by executing "leaves" to unblock parent nodes.
- ###### 11:35
	- Yeah, when I wanted to act - turned out I have a lot of theoretical things to finish before that. It got me discouraged. But I liked those first 2 flows I did yesterday, it really made me think and made proper refinements. So this makes sense. 
	- What I hate in this is vagueness of doing these kinds of tasks. It's not straight through. I can ask LLM because usually it's BS. So it's purely on me to calculate everything.
- ###### 11:06
	- Flow isn't ready to do the planning... So I have to do it first, it's a bit discouraging, but minor one, since I'll apply it right after it's done.
- ###### 10:37
	- Breathing. 10. Get hot and starting to like sweat. I'm yet to figure out if it's good or bad. But it is something. 
		- Sweating is interesting too. It quickly comes and quickly goes. What if what happens in my palms also happens in my brain? Dilation of 
		- Breathing out through resistance - is a huge nuance. Without that it's not as effective phsysiologically.
- ###### 10:30
	- Most likely it seems like I have underdeveloped positive masculine and feminine traits. That would be the conclusion of today's "session". It's not about getting "womanly". There's very specific path to specific traits..
		- Empathy? I'm low in it. Especially towards myself. Well am I? Ok, I need to work, it's enough of inner work for today. Lots of things to do. 
	- But I really feel like libido flows more freely towards the work, I shouldn't forget about using the work as the compass. Seems like it's intrinsically good, so when I'm attracted to it and feel a lot of meaning around it - then inner state is kinda oriented properly (or just better than before)
	- And also I should remember that it doesn't matter that much to have some specifics in conclusions. Like 90% of the work happens by giving the unconscious my attention and honest attitude. At least it feels like it's how it going on.
- ###### 10:16
	- Work-wise, that clip (or maybe crying itself) kinda dissolves the ego a bit. Like I start to see that all that "complexity" is mainly an illusion. When the Ego shed its prejudices - it gets much easier to start to work and continue. 
	- ==🔴Interesting idea to help with analysis - remove elements of the material and see how it changes==
		- Remove the Anima - yeah, it crumbles. It doesn't make sense, especially that ritual around the fire. 
		- Remove the little girl - the same. Hard to say what's there, but it's something like growth from child innocence in the walled garden to the mature "semi god" that has to make hard decisions. It's stupid as hell, but it's the best I've got. Without that little girl it becomes just like snapshot of mature women. 
			- golden hair also adds to this divine child theme.
		- Replace girl/woman with boy/man. Nah. Doesn't make sense too. Same acting for men would've been confusing. It will have to be more "manly" to make sense, which will contradict the clip's motif. 
		- So there's a lot of charge around feminine. Which is kinda the Anima territory as well as mother complex (either positive or negative or, well, most likely both). 
		- But I always thought that I don't act "manly" and I have to much feminine in thoughts and behavior. But for some reason the unconscious pushes me into this anyway. Well, who said that all feminine is good, the same as masculine. You have/had "wrong" feminine aspects, which doesn't mean automatically that you have good ones too.
- ###### 10:07
	- Weird that this Anoana clip still stays emotionally charged for me. Usually it gets dull by this point. 
	- That scene where there's some ritual around the fire and they're like bringing their hands up from the ground during eclipse - I have tears even just typing this. 
		- Can I say that it's as if the Anima brought all the pieces of me into the balance where all aims are aligned and they work in unison with each other instead of tearing me apart by contradictory impulses? 
			- Like that pizza situation, usually it was like "I will resist today, but tomorrow it'll get even stronger", while in this case it got weaker for the first time. Like I don't even consider it anymore (for now). 
		- Maybe that's symbolism I'm seeking? Use that maternal energy for the anima to guide me into the unconscious to find that peace of mind? 
	- I'm too stupid to crack such things right now. But what I know is thankfully the unconscious isn't stupid, and this material speaks exactly its language, so I guess it will get integrated one way or another if I won't either dumb it down/oversimplify it OR listen to this song for fun. 
		- I was right to say that I should place it in separate playlist, and listen only when I can give it my full attention. 
- ###### 09:48
	- Randomly figured out I can scale down "recording" monitor to 100%, now can have more elements. Nice one










