<%*
setTimeout(() => {
    const view = app.workspace.getActiveViewOfType(
        tp.obsidian.MarkdownView
    );
    if (!view) return;

    const editor = view.editor;

    // Find target heading
    let line = -1;
    for (let i = 0; i < editor.lineCount(); i++) {
        if (editor.getLine(i).includes("TASK EXECUTION")) {
            line = i;
            break;
        }
    }

    if (line === -1) {
        new tp.obsidian.Notice("TASK EXECUTION heading not found");
        return;
    }

    // Insert newest entry directly after heading
    const time = window.moment().format("HH:mm");
    const entry = `\n- ##### ${time}\n\t - `;

    editor.replaceRange(entry, {
        line,
        ch: editor.getLine(line).length
    });

    // Put cursor at nested bullet
    editor.setCursor({ line: line + 2, ch: 4 });
    editor.focus();

    // Scroll heading to top (same method as journal-time-entry.js)
    requestAnimationFrame(() => {
        editor.scrollIntoView(
            {
                from: { line, ch: 0 },
                to: { line, ch: 0 }
            },
            false
        );

        const cm = editor.cm;
        const scroller = cm?.scrollDOM;
        const coords = cm?.coordsAtPos(
            cm.state.doc.line(line + 1).from
        );

        if (scroller && coords) {
            scroller.scrollTop +=
                coords.top - scroller.getBoundingClientRect().top;
        }
    });

}, 50);
%>