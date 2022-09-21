import { Body, Controller, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { Serialize } from '../interceptors/serialize.interceptor';
import { AuthGuard } from '../guards/auth.guards';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportDto } from './dtos/report.dto';
import { ReportsService } from './reports.service';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { AdminGuard } from '../guards/admin.guards';

@Controller('reports')
export class ReportsController {

  constructor(private reportsService: ReportsService) { }

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    return this.reportsService.create(body, user);
  };

  @Patch("/:id")
  @UseGuards(AdminGuard)
  approveReport(@Param("id") id: number, @Body() body: ApproveReportDto) {
    return this.reportsService.updateApproval(id, body.approved);
  }
}
