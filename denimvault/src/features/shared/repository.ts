import { JeanModel } from "@/core/types/models";
import { StockItem } from "@/core/types/inventory";
import { createClient } from "@/core/lib/supabase/server";

export const ModelRepository = {
  async getAll(): Promise<JeanModel[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('models')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data as JeanModel[];
  },

  async getById(id: string): Promise<JeanModel | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('models')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
       if (error.code === 'PGRST116') return null; // Not found
       throw new Error(error.message);
    }
    return data as JeanModel;
  },

  async create(model: Omit<JeanModel, 'id' | 'created_at'>): Promise<JeanModel> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('models')
      .insert([model])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as JeanModel;
  }
};

export const InventoryRepository = {
  async getAll(): Promise<StockItem[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .order('size', { ascending: true }); // We might need a custom sort for sizes later

    if (error) throw new Error(error.message);
    return data as StockItem[];
  },

  async getByModelId(modelId: string): Promise<StockItem[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .eq('model_id', modelId)
      .order('size', { ascending: true });

    if (error) throw new Error(error.message);
    return data as StockItem[];
  },

  async updateQuantity(id: string, newQuantity: number): Promise<StockItem> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('inventory')
      .update({ quantity: newQuantity })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as StockItem;
  },
  
  async createInitialStockForModel(modelId: string, minThreshold: number = 10): Promise<void> {
    const supabase = await createClient();
    // Generate initial zero-stock records for standard sizes
    const sizes = ['28', '30', '32', '36'];
    const initialStockTokens = sizes.map(size => ({
      model_id: modelId,
      size,
      quantity: 0,
      min_threshold: minThreshold
    }));

    const { error } = await supabase
      .from('inventory')
      .insert(initialStockTokens);

    if (error) throw new Error(error.message);
  }
};
