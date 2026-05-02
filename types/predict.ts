// types/predict.ts
export interface PredictInput {
  Sex: "Male" | "Female";
  Age: number;
  Birth_Weight: number;
  Birth_Length: number;
  Body_Weight: number;
  Body_Length: number;
  ASI_Eksklusif: "Yes" | "No";
}

export interface WhoFlags {
  length_for_age_z: number;
  weight_for_age_z: number;
  stunting_who_indicator: 0 | 1;
  severe_stunting: 0 | 1;
  underweight: 0 | 1;
  low_birth_weight: 0 | 1;
}

export interface PredictResult {
  prediction: 0 | 1;
  label: string;
  probability: {
    stunting: number;
    tidak_stunting: number;
  };
  risk_level: "LOW" | "MEDIUM" | "HIGH";
  who_flags: WhoFlags;
  model_used: string;
}
