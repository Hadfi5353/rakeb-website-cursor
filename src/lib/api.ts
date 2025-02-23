
import { supabase } from './supabase';
import { Vehicle } from './types';

export const vehiclesApi = {
  async getVehicles() {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data;
  },

  async getVehicle(id: string) {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data;
  },

  async createVehicle(vehicle: Omit<Vehicle, 'id' | 'created_at' | 'owner_id'>) {
    const { data, error } = await supabase
      .from('vehicles')
      .insert([{ ...vehicle, owner_id: supabase.auth.getUser() }])
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },

  async updateVehicle(id: string, vehicle: Partial<Vehicle>) {
    const { data, error } = await supabase
      .from('vehicles')
      .update(vehicle)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },

  async deleteVehicle(id: string) {
    const { error } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
  }
};
