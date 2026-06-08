export const SECTION_LABELS = [
  "Safety Culture & Leadership (Part 1)",
  "Safety Culture & Leadership (Part 2)",
  "Training & Competency",
  "Incident Management",
  "Technology & AI in Safety",
  "Open Inputs",
  "Summary & Review",
];

export interface OrgProfile {
  companyName: string;
  industry: string;
  employees: string;
  sites: string;
  designation: string;
  vehicles: string;
  name: string;       
  email: string;      
  phone: string; 
}

export const INITIAL_ORG_PROFILE: OrgProfile = {
  companyName: "",
  industry: "",
  employees: "",
  sites: "",
  designation: "",
  vehicles: "",
  name: "",          
  email: "",          
  phone: "", 
};
