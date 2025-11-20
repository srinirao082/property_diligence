export interface PropertyDetails {
  address: string;
  surveyNumber: string;
  totalArea: string;
  propertyType: string;
  zoneType?: string;
}

export interface Transaction {
  date: string;
  transactionType: string;
  from: string;
  to: string;
  amount: string;
  documentNumber?: string;
  details?: string;
}

export interface RiskFactor {
  category: string; // e.g., Zoning, Environmental, Title
  risk: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  explanation: string;
}

export interface RiskAssessment {
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  score: number; // 0 to 100
  factors: RiskFactor[];
  recommendations: string[];
}

export interface Financials {
  summary: string;
  lastTransactionValue: string;
  taxStatus: string;
}

export interface LegalClause {
  clause: string;
  explanation: string;
  significance: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface DueDiligenceReport {
  reportSummary: string;
  propertyDetails: PropertyDetails;
  currentOwner: string;
  ownershipHistory: Transaction[];
  encumbrances: string[];
  financials: Financials;
  legalClauses: LegalClause[];
  riskAssessment: RiskAssessment;
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
