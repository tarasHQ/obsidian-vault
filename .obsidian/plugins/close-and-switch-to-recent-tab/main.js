"use strict";

const { Plugin, WorkspaceLeaf } = require('obsidian');

module.exports = class CloseAndSwitchToRecentTab extends Plugin {

    async onload() {
        this.mruStack = [];
        this.MRU_MAX = 30;
        this.isSwitching = false;

        if (this.app.workspace.activeLeaf) {
            this.pushMRU(this.app.workspace.activeLeaf.id);
        }

        // monkey-patch detach：在标签页关闭前捕获 MRU 状态
        const self = this;
        const origDetach = WorkspaceLeaf.prototype.detach;
        WorkspaceLeaf.prototype.detach = function () {
            if (!self.isSwitching) {
                self.handleBeforeDetach(this);
            }
            return origDetach.apply(this, arguments);
        };
        this.register(() => {
            WorkspaceLeaf.prototype.detach = origDetach;
        });

        this.addCommand({
            id: 'close-and-switch-to-recent-tab',
            name: '关闭当前标签页并切换到最近所在的标签页',
            callback: () => {
                const leaf = this.app.workspace.activeLeaf;
                if (leaf) leaf.detach();
            }
        });

        this.registerEvent(
            this.app.workspace.on('active-leaf-change', (leaf) => {
                if (!leaf || this.isSwitching) return;
                this.pushMRU(leaf.id);
            })
        );
    }

    /**
     * detach 调用前：保存当前标签页的 MRU 上一个，
     * detach 完成后（Obsidian 自动切换到相邻标签页之后）覆盖为 MRU 上一个
     */
    handleBeforeDetach(closingLeaf) {
        if (this.app.workspace.activeLeaf !== closingLeaf) return;

        const targetId = this.findMRUPrevious(closingLeaf.id);
        if (!targetId) return;

        this.isSwitching = true;
        setTimeout(() => {
            this.isSwitching = false;
            const target = this.getLeafById(targetId);
            if (target) {
                this.app.workspace.setActiveLeaf(target, { focus: true });
            }
        }, 0);
    }

    findMRUPrevious(excludeId) {
        for (const id of this.mruStack) {
            if (id !== excludeId) return id;
        }
        return null;
    }

    pushMRU(leafId) {
        const idx = this.mruStack.indexOf(leafId);
        if (idx !== -1) this.mruStack.splice(idx, 1);
        this.mruStack.unshift(leafId);
        if (this.mruStack.length > this.MRU_MAX) this.mruStack.length = this.MRU_MAX;
    }

    getLeafById(leafId) {
        let found = null;
        this.app.workspace.iterateAllLeaves(leaf => {
            if (leaf.id === leafId) { found = leaf; return true; }
        });
        return found;
    }
};

/* nosourcemap */