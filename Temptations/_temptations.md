---
title: Temptations
---

```dataviewjs
const excludedPaths = ["@projects/0vibes"]
const currentFolder = app.vault.getAbstractFileByPath(dv.current().file.folder)

if (!currentFolder || !Array.isArray(currentFolder.children)) {
  dv.paragraph("Unable to find this page's folder.")
} else {
  const isExcluded = (path) => excludedPaths.some((excluded) => path === excluded || path.startsWith(`${excluded}/`))
  const isFolder = (item) => Array.isArray(item.children)

  const renderFolder = (folder, parent) => {
    const items = folder.children
      .filter((item) => !isExcluded(item.path))
      .sort((a, b) => Number(isFolder(b)) - Number(isFolder(a)) || a.name.localeCompare(b.name))

    if (items.length === 0) return

    const list = parent.createEl("ul")
    for (const item of items) {
      const entry = list.createEl("li")
      if (isFolder(item)) {
        entry.createSpan({ text: item.name })
        renderFolder(item, entry)
      } else {
        const link = entry.createEl("a", { text: item.name, cls: "internal-link", href: item.path })
        link.setAttribute("data-href", item.path)
      }
    }
  }

  renderFolder(currentFolder, dv.container)
}
```
