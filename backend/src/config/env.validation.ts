import { plainToInstance } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min, validateSync } from 'class-validator';

class EnvVariables {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(65535)
  PORT?: number;

  @IsString()
  @IsNotEmpty()
  DATABASE_URL!: string;

  @IsString()
  @IsNotEmpty()
  JWT_SECRET!: string;

  @IsString()
  @IsNotEmpty()
  JWT_EXPIRES_IN!: string;
}

export function validateEnv(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}