import { ref, watch, type Ref } from "vue";
import type { CircuitDocument } from "@/shared/types";
import type { Notice } from "@/shared/commands";
import { decodeDocument, encodeDocument } from "../lib/codec";
import { sampleCircuit, emptyCircuit } from "../lib/seeds";
export const STORAGE_KEY = "logic-lab-jdk-028-v1";
export function loadInitial(): {
  document: CircuitDocument;
  warning: string | null;
} {
  try {
    const text = localStorage.getItem(STORAGE_KEY);
    return {
      document: text ? decodeDocument(text) : sampleCircuit(),
      warning: null,
    };
  } catch {
    return {
      document: sampleCircuit(),
      warning: "本地存档无法读取，已打开示例；导出当前实验后可重新保存。",
    };
  }
}
export function useWorkspace(
  document: Ref<CircuitDocument>,
  notify: (notice: Notice) => void,
  reset: () => void,
) {
  const status = ref("本地自动保存");
  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, encodeDocument(document.value));
      status.value = "已保存到此浏览器";
    } catch {
      status.value = "保存失败，请导出文件";
      notify({ tone: "error", message: "浏览器存储不可用，请导出实验文件" });
    }
  }
  watch(document, save, { deep: true });
  function replace(next: CircuitDocument) {
    document.value = next;
    reset();
  }
  function sample() {
    replace(sampleCircuit());
    notify({ tone: "success", message: "已载入异或示例" });
  }
  function clear() {
    replace(emptyCircuit());
    notify({ tone: "info", message: "已新建空白实验" });
  }
  function importText(text: string) {
    try {
      const next = decodeDocument(text);
      replace(next);
      notify({ tone: "success", message: "导入成功，实验已恢复" });
    } catch (error) {
      notify({
        tone: "error",
        message: `导入失败：${error instanceof Error ? error.message : "文件无法读取"}；当前实验已保留`,
      });
    }
  }
  function exportFile() {
    const url = URL.createObjectURL(
      new Blob([encodeDocument(document.value)], { type: "application/json" }),
    );
    const a = window.document.createElement("a");
    a.href = url;
    a.download = `${document.value.name.replace(/[^\p{L}\p{N}_-]/gu, "_") || "logic-lab"}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    notify({ tone: "success", message: "实验文件已导出" });
  }
  return { status, save, sample, clear, importText, exportFile };
}
