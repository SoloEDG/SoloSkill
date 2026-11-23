import { ref } from "vue";
import type { Notice } from "@/shared/commands";
import type { Point } from "@/shared/types";
import { usePlacement } from "@/features/catalog";
import { useCircuit } from "@/features/circuit";
import { useSimulation } from "@/features/simulation";
import { useChallenge } from "@/features/challenge";
import { loadInitial, useWorkspace } from "@/features/workspace";
export function useLab() {
  const initial = loadInitial(),
    document = ref(initial.document);
  const notice = ref<Notice>({
    tone: initial.warning ? "error" : "info",
    message: initial.warning ?? "示例已就绪。切换输入，观察信号如何到达输出。",
  });
  const notify = (next: Notice) => {
    notice.value = next;
  };
  const placement = usePlacement();
  const circuit = useCircuit(document, notify);
  const simulation = useSimulation(document),
    challenge = useChallenge(document);
  const workspace = useWorkspace(document, notify, () => {
    circuit.resetSelection();
    challenge.reset();
    placement.tool.value = null;
  });
  function place(point: Point) {
    if (!placement.tool.value) return;
    if (document.value.nodes.length >= 120) {
      notify({
        tone: "error",
        message: "最多支持 120 个元件，请先删除不用的元件",
      });
      return;
    }
    const node = placement.createNode(
      document.value,
      placement.tool.value,
      point,
    );
    document.value.nodes.push(node);
    circuit.selected.value = node.id;
    placement.tool.value = null;
    notify({
      tone: "success",
      message: `已放置 ${node.label}，点击端口开始连线`,
    });
  }
  function move(id: string, point: Point) {
    const node = document.value.nodes.find((n) => n.id === id);
    if (node) {
      node.x = point.x;
      node.y = point.y;
    }
  }
  function cancel() {
    circuit.pending.value = null;
    placement.tool.value = null;
    notify({ tone: "info", message: "已取消当前放置或连线" });
  }
  function renameNode(label: string) {
    const node = document.value.nodes.find(
      (n) => n.id === circuit.selected.value,
    );
    if (node) node.label = label.trim().slice(0, 40) || node.kind;
  }
  return {
    document,
    notice,
    notify,
    placement,
    circuit,
    simulation,
    challenge,
    workspace,
    place,
    move,
    cancel,
    renameNode,
  };
}
