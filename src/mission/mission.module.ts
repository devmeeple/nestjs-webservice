import { Module } from '@nestjs/common';
import { MissionController } from './mission.controller';

@Module({
  controllers: [MissionController]
})
export class MissionModule {}
