<%*
setTimeout(() => {
    const view = app.workspace.getActiveViewOfType(
        tp.obsidian.MarkdownView
    );
    if (!view) return;

    const editor = view.editor;
    const heading = "## TASK EXECUTION";

    // Find target heading
    let line = -1;
    for (let i = 0; i < editor.lineCount(); i++) {
        if (editor.getLine(i).trim() === heading) {
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

    // Align heading with top of editor viewport
    requestAnimationFrame(() => {
        const cm = editor.cm;
        if (!cm) return;

        const pos = cm.state.doc.line(line + 1).from;
        cm.scrollDOM.scrollTop = cm.lineBlockAt(pos).top;
    });
}, 50);
%>