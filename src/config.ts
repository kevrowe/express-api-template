const configKeys = {
  jwtSecret: "JWT_SECRET",
  port: "PORT",
  databaseUrl: "DATABASE_URL",
  jwtExpiresIn: "JWT_EXPIRES_IN",
};

type SpecificConfig = {
  /**
   * This is consumed in schema.prisma
   */
  databaseUrl: string;
};

type Config = {
  [key in keyof typeof configKeys]: string;
} & SpecificConfig;

const buildConfig = () => {
  const config: Partial<Config> = {};

  for (const key in configKeys) {
    const validKey = key as keyof typeof config;
    const val = process.env[configKeys[validKey]];
    if (!val) {
      throw new Error(`${configKeys[validKey]} is not set`);
    }
    config[validKey] = val;
  }

  return config as Config;
};

export { buildConfig };
export default buildConfig();
