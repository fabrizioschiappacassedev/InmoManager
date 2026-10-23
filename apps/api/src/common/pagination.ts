import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

export class PaginationQuery {
  @Type(() => Number) @IsInt() @Min(1)
  page = 1;

  @Type(() => Number) @IsInt() @Min(1) @Max(100)
  limit = 20;
}

export const paginate = <T>(items: T[], total: number, q: PaginationQuery) => ({
  items,
  meta: { page: q.page, limit: q.limit, total, pages: Math.ceil(total / q.limit) },
});
