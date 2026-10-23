import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class TypeOrmService {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  getDataSource(): DataSource {
    return this.dataSource;
  }

  async query(query: string, parameters?: any[]) {
    return this.dataSource.query(query, parameters);
  }
}
