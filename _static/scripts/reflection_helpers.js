// _static/scripts/reflection_helpers.js

function buildClickableList(pages) {
    if (!pages || pages.length === 0) {
        return "<p style='color: var(--text-muted); font-style: italic; margin: 0;'>No files found</p>";
    }
    const linksHtml = pages
        .map(p => `<li><a class="internal-link" href="${p.file.path}">${p.file.name}</a></li>`)
        .join("");
    return `<ul class="dataview list-view-list" style="margin: 0; font-size: 0.8rem; padding-left: 0px;">${linksHtml}</ul>`;
}

async function renderColumns(dv, container) {
    const currentFolder = dv.current()?.file?.folder ?? "";
    const prefix = currentFolder ? `${currentFolder}/` : "";

    const reflections = dv.pages(`"${prefix}_reflections"`).sort(p => p.file.ctime, 'desc');
    const ideas = dv.pages(`"${prefix}ideas"`).sort(p => p.file.ctime, 'desc');
    const artifacts = dv.pages(`"${prefix}artifacts"`).sort(p => p.file.ctime, 'desc');

    container.innerHTML = `
      <div style="display: flex; gap: 10px; align-items: flex-start; box-sizing: border-box;">
        <div style="flex: 1; min-width: 0; height: 100%; display: flex; flex-direction: column;">
          <h3 style="margin-top: 0; border-bottom: 1px solid var(--background-modifier-border); padding-bottom: 6px; margin-bottom: 8px;">Reflections</h3>
          <div style="overflow-y: auto; flex-shrink: 0;">
            ${buildClickableList(reflections)}
          </div>
        </div>
        <div style="flex: 1; min-width: 0; height: 100%; display: flex; flex-direction: column;">
          <h3 style="margin-top: 0; border-bottom: 1px solid var(--background-modifier-border); padding-bottom: 6px; margin-bottom: 8px;">Ideas</h3>
          <div style="overflow-y: auto; flex-shrink: 0;">
            ${buildClickableList(ideas)}
          </div>
        </div>
        <div style="flex: 1; min-width: 0; height: 100%; display: flex; flex-direction: column;">
          <h3 style="margin-top: 0; border-bottom: 1px solid var(--background-modifier-border); padding-bottom: 6px; margin-bottom: 8px;">Artifacts</h3>
          <div style="overflow-y: auto; flex-shrink: 0;">
            ${buildClickableList(artifacts)}
          </div>
        </div>
      </div>
    `;
}

window.RenderReflectionHelpers = { renderColumns };
