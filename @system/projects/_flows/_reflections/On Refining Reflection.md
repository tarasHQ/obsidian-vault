---
ctime: 2026-10-28 23:29
isIntegrated: false
---

%%[[_static/templater/[T]reflections|Link To Template]]%%

###### Meta-reflection (On completion)
%%Awareness to avoid repeating friction or to improve what works%%
%%issues/friction/inconvenience. Also sometimes I reflect on high cost-low reward topic/issue. I need to be aware of those.%%
- 
---
## Remember
- If reflection is successful - act upon it right away. 
	- Use advantage of the brain filled with relative knowledge. It's easily compensates cognitive exhaustion.
- Highlight insights in the reflection. 

---

## Problems & Goals
%% To prevent drift from the initial target and ending the reflection without answering on what it was about%%
- How to structure this reflection?

---

## Raw
%%Free-form reflection with no rules%% 
- 

Yes — Meta Bind supports this cleanly with **button groups**.

### How to put 3 buttons in a row

1. Define each button as a normal `meta-bind-button` code block.
2. Give every button a unique `id`.
3. Set `hidden: true` on them (so they don’t appear as full-width blocks).
4. Place them side-by-side with an inline button group:

```markdown
`BUTTON[remove-night, remove-morning, remove-evening]`
```

### Full working example


`BUTTON[remove-night, remove-morning, remove-evening]`

```meta-bind-button
label: Remove Night Checklist
style: default
icon: trash-2
id: remove-night
hidden: true
cssStyle: "height: 22px; min-height: 0; padding: 0 6px; font-size: 11px; line-height: 1; gap: 4px;"
action:
  type: js
  file: _static/scripts/meta-bind/journal-remove-checklist.js
```

```meta-bind-button
label: Remove Morning Checklist
style: default
icon: trash-2
id: remove-morning
hidden: true
cssStyle: "height: 22px; min-height: 0; padding: 0 6px; font-size: 11px; line-height: 1; gap: 4px;"
action:
  type: js
  file: _static/scripts/meta-bind/journal-remove-checklist.js
  
```

```meta-bind-button
label: Remove Evening Checklist
style: default
icon: trash-2
id: remove-evening
hidden: true
cssStyle: "height: 22px; min-height: 0; padding: 0 6px; font-size: 11px; line-height: 1; gap: 4px;"
action:
  type: js
  file: _static/scripts/meta-bind/journal-remove-checklist.js
```
