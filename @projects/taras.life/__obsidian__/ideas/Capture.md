
## Meta-reflection about the format
- Don't use strict order of headers. one-level features get h6, while 3 level features get h3. (+you have additional level of depth through **bold text headings**)

## Inspiration
![[_attachments/Pasted image 20261029220112.png|215]]![[_attachments/Pasted image 20261029220348.png|336]]

![[_attachments/Pasted image 20261029215947.png|107]]![[_attachments/Pasted image 20261029184519.png|419]]
- ### Websites
	- https://oliverfalvai.com/Evergreen/Inspiring-gardens - collections
	- https://quartz.jzhao.xyz/showcase - collections
	- https://28mm.coffee/mostly-how-i-built-this-site
	- https://vaults.obsidian-community.com/ - collections. Checked all for quartz and publish. 
	- https://davidhurtado.ai/Home
	- [https://garden.sgenov.dev/](https://garden.sgenov.dev/How-Does-This-Blog-Work)
	- https://notes.dsebastien.net/50+Resources/55+Obsidian+Publish/README

## To NOT Do
- ###### ⛔Long Lists (Flat or Not) in Explorer
	- Explorer should contain only top-level things, because it's not suited to have like more than 50 entries. 
- ###### ⛔Long loading of pages
	- A lot of navigation is involved in these kind of websites. So pages should be light. 
	- Images probably should be loaded async + animation. 
- ###### ⛔Lots of 404s or "not implemented" pages
	- When I visiting such vault, it feels like the author doesn't care about my user experience of his website. 

## Meta
- ### Updates
	- 

--- 

## Contents
- ### Doing Now 
	- 
	- ##### Spotify
		- Sync Options
			- `last.fm`
			- `nowplaying.site`
	- ##### TickTick Schedule
		- ###### Scheduling database? (LONG TERM)
			- you had an idea to show on the side view ticktick schedule, during viewing journal entries. 
			- what if worker uses r2 or something, and saves each viewed day? so not only you can view "doing now", but also have cached data for all journaling entries? 
	- ##### 1-minute Gif Snippets
		- 
- ##### Changelog
	- Paged (10-20 entries?) list of git commits to website? 
	  
- ##### Charts
	- Types
		- Weight loss
		- Subjective life progress
			* to remember that setbacks happen on upward tendency
			* to force into mindset "compare with yourself yesterday"
	* Logic
		* PIA. At best you have to make some transformer plugin that manually finds daily journals and parses it into SVG chart. 
		* Or you can use some lightweight charting library for minimal interactivity? 
*  %% fold %%
- ###### Decisions %% fold %%
	- List of decisions and rationale %% fold %%
	- For you to remember.
	- Examples
		- Why excalidraw over obsidian? 
		- Why this structure of other ones?
		- Maybe it's worth to have it in system? So it's in one place?
		- For readers to understand.

---

## Optimization
 
- ##### Caching %% fold %%
	- ###### Cache static images  %% fold %%
		- Like OG or favicon?  %% fold %%
		- I'm not sure about ALL images, but I can do 8bits of hash suffix to their name. They're unlikely to change too, especially with the same name. It's just if I overuse it - it may be hundreds of megabytes of cached data. On another hand, I don't really overuse images, and on top of webp compression - 100 images would take like 10 megabytes of cache, which is negligible. %% fold %%

- #### Images
	- ###### Convert to webp %% fold %%
		- During build time
			- But this requires different building processes, to avoid conversion in worker/github.
			- What you see in obsidian is not what you get in website
		- Obsidian workflow hygiene (RECOMMENDED)
			- You establish low-friction workflows to insert processed images in obsidian, so building stays cheap. (100 images on high quality webp (lossless) can take minutes)
			- You have apps like `squoosh.app` or others. Or you can write quick app in python/ahk based on clipboard buffer. You make a screenshot. Press hotkey. And get notification that clipboard was updated and you have optimized webp image in there. 
				- Another hotkey would do the same but with GUI sliders/preview. 
	- ##### Async loading
		- 
		- ###### Loading
			- Notes
				- Issue isn't as much about the size (until it's extreme, which it won't be), but about the response delays. Like current page with only 4 images for inspiration would probably be 200-300kb optimized. Which takes some time for cloudflare. I don't know how it works, but in my tests there's is significant difference. 
				- So I guess it's the way. Load text + baked in blur at first, and then separate request will update async images after.
			- Logic
				- transformer adds` loading="lazy"` + `decoding="async"` attributes. 
				- but also probably should be "smart". If image is likely to be in a viewport on load - then maybe it should load instantly unless it's like 100kb+ in size, then it's async too? 
				- Also transformer plugin would need to add height/width attributes, so loading won't shift layout. 
				- uses `img`'s `complete` to not run the whole flow for image that is already loaded. 
		- ###### Animating
			- **blurred** placeholder, extremely cheap, prevents image "pop up" out of nowhere
				- which means we would have to create that blurred image in the first place, maybe even bake into the page? Those can be like really small and cheap, so it won't be an issue at all.
			- fade-in from blurred to original.

- ##### SEO
	- ###### Worth to research  %% fold %%
		- Just placeholder. I need to have at least basics set up. Do proper research. And make sure it's all good.


