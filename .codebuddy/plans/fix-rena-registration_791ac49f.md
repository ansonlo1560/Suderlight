---
name: fix-rena-registration
overview: 按照 NPC 註冊指南完善 Rena 的系統集成，包括線索、世界模組、狀態引擎及 UI 視覺。
todos:
  - id: integrate-rena-clues
    content: 在 src/data/verticalSlice.ts 中集成 RenaClueId 與 ALL_CLUES
    status: completed
  - id: setup-rena-psych-world
    content: 創建 Rena 心理世界模組並在 src/data/psychologicalWorlds/index.ts 註冊
    status: completed
  - id: setup-rena-outer-world
    content: 創建 Rena 表世界模組並在 src/data/outerWorlds/index.ts 註冊
    status: completed
  - id: implement-rena-state-logic
    content: 在 src/systems/npcStateEngine.ts 實作 Rena 的狀態創建與對話評估函數
    status: completed
    dependencies:
      - integrate-rena-clues
  - id: adapt-rena-ui-rendering
    content: 在 src/ui/NpcInnerWorld.tsx 中添加 Rena 專屬的 UI 背景與視覺渲染邏輯
    status: completed
    dependencies:
      - setup-rena-psych-world
  - id: sync-backend-data
    content: 檢查並更新 cloud-functions 下的 NPC 數據以確保後端同步一致
    status: completed
    dependencies:
      - integrate-rena-clues
---

## 項目概述

補全 NPC Rena 的角色註冊與系統集成，使其在遊戲中完全可用。目前 Rena 的基礎定義已存在，但尚未接入線索系統、世界模組、狀態引擎及 UI 渲染層。

## 核心功能需求

- **線索集成**：將 Rena 的線索 ID 與定義整合至全局線索清單，確保線索收集功能正常。
- **心理世界註冊**：建立 Rena 的心理世界模組，並在中央註冊處登記，使其場景可被加載。
- **表世界註冊**：建立 Rena 在表世界的建築與實體定義，完成地圖集成。
- **狀態引擎適配**：實作 Rena 的初始狀態生成邏輯與對話評估邏輯，驅動角色 AI 行為。
- **UI 視覺適配**：在心理世界界面中加入 Rena 專屬的背景、交互物件及視覺主題。

## 技術方案

- **架構模式**：遵循項目現有的註冊中心模式（Registry Pattern），確保 NPC 數據與系統邏輯解耦。
- **數據流**：通過 `gameStore` 管理 NPC 狀態，並與 `npcStateEngine` 進行交互。
- **模組化**：為 Rena 創建獨立的世界模組（OuterWorld/PsychologicalWorld），保持代碼結構清晰。

## 實作細節

### 關鍵目錄與文件

- **`src/data/verticalSlice.ts`**：定義全局 `ClueId` 與 `ALL_CLUES` 映射。
- **`src/data/psychologicalWorlds/rena/`**：定義 Rena 心理世界的層級結構與視覺坐標。
- **`src/data/outerWorlds/rena/`**：定義 Rena 在表世界的地圖塊、碰撞及觸發器。
- **`src/systems/npcStateEngine.ts`**：核心狀態邏輯，控制對話分支與狀態遷移。
- **`src/ui/NpcInnerWorld.tsx`**：前端渲染組件，負責 NPC 心理世界的視覺呈現。

## 代理擴展

### SubAgent

- **code-explorer**
- 目的：深入探索 Aoi 的集成實作細節，作為 Rena 註冊的參考模版。
- 預期結果：獲取 Aoi 在線索、世界模組和狀態引擎中的具體實作模式。