export type ActionState<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }
  | null;

export type ItemType = "inbox" | "task";

export const itemTypes: ItemType[] = ["inbox", "task"];

export const DEFAULT_ITEM_TYPE: ItemType = "inbox";

const routeTypeMap: Record<string, ItemType> = {
  "/tasks": "task",
};

export function getItemTypeForRoute(pathname: string): ItemType {
  for (const [route, type] of Object.entries(routeTypeMap)) {
    if (pathname.startsWith(route)) return type;
  }
  return DEFAULT_ITEM_TYPE;
}
