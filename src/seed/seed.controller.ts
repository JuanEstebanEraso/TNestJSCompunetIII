import { Controller, Post, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SeedService } from './seed.service';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post()
  @ApiOperation({ summary: 'Ejecutar seed de datos (poblar BD)' })
  @ApiResponse({ status: 200, description: 'Seed ejecutado exitosamente.' })
  @ApiResponse({ status: 500, description: 'Error al ejecutar seed.' })
  async executeSeed() {
    return await this.seedService.seedAll();
  }

  @Delete()
  @ApiOperation({ summary: 'Limpiar todos los datos de la base de datos' })
  @ApiResponse({ status: 200, description: 'Base de datos limpiada exitosamente.' })
  @ApiResponse({ status: 500, description: 'Error al limpiar la base de datos.' })
  async clearDatabase() {
    return await this.seedService.clearAll();
  }
}

