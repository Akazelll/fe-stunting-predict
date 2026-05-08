export type EducationCategory = "nutrition" | "parenting" | "health";
export type EducationCondition = "normal" | "risk" | "stunted";
export type EducationAgeGroup = "0-2" | "2-5";

export interface EducationContent {
  id: string;
  title: string;
  category: EducationCategory;
  condition: EducationCondition;
  age_group: EducationAgeGroup;
  content: string;
  source: string;
  created_at: string;
}

export interface EducationFilterState {
  search: string;
  category: EducationCategory | "all";
  ageGroup: EducationAgeGroup | "all";
}
