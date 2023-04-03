export type EmulatorConfig = {
  host?: string;
  port?: number;
};

export type InitEmulatorsArgs = {
  enableAuth?: boolean | EmulatorConfig;
  enableFirestore?: boolean | EmulatorConfig;
};
