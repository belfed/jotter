export type ActionState<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }
  | null;

export type ItemType = "inbox" | "task";

export const itemTypes: ItemType[] = ["inbox", "task"];

export const DEFAULT_ITEM_TYPE: ItemType = "inbox";
