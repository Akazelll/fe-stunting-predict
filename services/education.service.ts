import { createClient } from "@/lib/supabase/client";
import { EducationContent } from "@/types/education";

export const EducationService = {
  async getAllContent(): Promise<EducationContent[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("education_content")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as EducationContent[];
  },

  async getUserCondition(): Promise<"normal" | "risk" | "stunted"> {
    // Logic untuk mendapatkan status terburuk dari anak user untuk personalisasi AI
    const supabase = createClient();
    const { data, error } = await supabase
      .from("predictions")
      .select("result")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) return "normal";

    const results = data.map((d) => d.result);
    if (results.includes("stunted")) return "stunted";
    if (results.includes("risk")) return "risk";
    return "normal";
  },
};
