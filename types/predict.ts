export interface PredictInput {
  Sex: "Male" | "Female" | "Laki-laki" | "Perempuan";
  Age: number;
  Birth_Weight: number;
  Birth_Length: number;
  Body_Weight: number;
  Body_Length: number;
  ASI_Eksklusif: "Yes" | "No" | "Ya" | "Tidak";
}

export interface HuggingFacePredictResponse {
  status: "success";
  prediction: "no" | "yes";
  prediction_label: "Tidak Stunting" | "Stunting";
  confidence: number;
  probabilities: {
    no: number;
    yes: number;
  };
  recommendation: string;
}

export interface PredictResult {
  prediction: "Normal" | "Stunting";
  is_stunting: boolean;
  prediction_label: string;
  confidence: number;
  stunting_probability: number;
  risk_level: "Rendah" | "Sedang" | "Tinggi";
  probabilities: {
    Normal: number;
    Stunting: number;
  };
  recommendation: string;
  model_used: string;
  input_received?: PredictInput;
  raw_response?: HuggingFacePredictResponse;
}
