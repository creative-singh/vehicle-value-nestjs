import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { Report } from './report.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report) private repo: Repository<Report>
  ) { }

  // createEstimate(estimateDto: GetEstimateDto) {
  createEstimate({ make, lng, lat, model, year, mileage }: GetEstimateDto) {
    return this.repo.createQueryBuilder()
      .select("*")
      .select("AVG(price)", "price")
      // .where("make = :make", { make: estimateDto.make })
      .where("make = :make", { make })
      .andWhere("model = :model", { model })
      .andWhere("lng - :lng BETWEEN -5 AND 5", { lng })
      .andWhere("lat - :lat BETWEEN -5 AND 5", { lat })
      .andWhere("year - :year BETWEEN -3 AND 3", { year })
      // .andWhere("approved IS TRUE")
      .orderBy("ABS(mileage - :mileage)", "DESC")   // orderBy doesn't accept parameter object as second arguement
      .setParameters({ mileage })
      .limit(3)
      .getRawOne();
  }

  create(reportDto: CreateReportDto, user: User) {
    const report = this.repo.create(reportDto);
    report.user = user;

    return this.repo.save(report);
  };

  async updateApproval(id: number, approved: boolean) {
    const report = await this.repo.findOneBy({ id });
    if (!report) {
      throw new NotFoundException("Report not found");
    }

    report.approved = approved;
    return this.repo.save(report);
  }
}
