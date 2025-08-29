export interface GeneratedFile {
  path: string;
  content: string;
  language?: string;
}

export interface GeneratedCode {
  files: GeneratedFile[];
  dependencies: string[];
  instructions?: string;
}