export interface StockItem {
  id: string; // UUID
  model_id: string; // FK to JeanModel
  size: string;
  quantity: number;
  min_threshold: number;
}
