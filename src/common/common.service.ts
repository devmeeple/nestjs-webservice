import { BadRequestException, Injectable } from '@nestjs/common';
import { BasePaginationDto } from './dto/base-pagination.dto';
import { BaseTimeEntity } from './entity/base-time.entity';
import { FindManyOptions, FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';
import { FILTER_MAPPER } from './const/filter-mapper.const';
import { HOST, PROTOCOL } from './const/env.const';

@Injectable()
export class CommonService {
  paginate<T extends BaseTimeEntity>(
    request: BasePaginationDto,
    repository: Repository<T>,
    overrideFindOptions: FindManyOptions<T> = {},
    path: string,
  ) {
    if (request.page) {
      return this.pagePaginate(request, repository, overrideFindOptions);
    } else {
      return this.cursorPaginate(request, repository, overrideFindOptions, path);
    }
  }

  private async pagePaginate<T extends BaseTimeEntity>(
    request: BasePaginationDto,
    repository: Repository<T>,
    overrideFindOptions: FindManyOptions<T> = {},
  ) {

  }
  private async cursorPaginate<T extends BaseTimeEntity>(
    request: BasePaginationDto,
    repository: Repository<T>,
    overrideFindOptions: FindManyOptions<T> = {},
    path: string,
  ) {
    const findOptions = this.composeFindOptions<T>(request);

    const results = await repository.find({
      ...findOptions,
      ...overrideFindOptions,
    });

    const lastItem = results.length > 0 && results.length === request.take ? results[results.length - 1] : null;

    const nextURL = lastItem && new URL(`${PROTOCOL}://${HOST}/posts`);

    if (nextURL) {
      /**
       * dto의 키값들을 루핑하면서
       * 키값에 해당하는 값이 존재하면
       * param에 그대로 붙여넣는다.
       *
       * 단 where__id_more_than 값 만 lastItem의 마지막 값으로 넣어준다.
       */
      for (const key of Object.keys(request)) {
        if (request[key]) {
          if (key !== 'where__id__more_than' && key !== 'where__id__less_than') {
            nextURL.searchParams.append(key, request[key]);
          }
        }
      }

      let key = null;

      if (request.order__createdAt === 'ASC') {
        key = 'where__id__more_than';
      } else {
        key = 'where__id__less_than';
      }

      nextURL.searchParams.append(key, lastItem.id.toString());
    }

    return {
      data: results,
      cursor: {
        after: lastItem?.id ?? null,
      },
      count: results.length,
      next: nextURL?.toString() ?? null,
    }
  }

  private composeFindOptions<T extends BaseTimeEntity>(
    request: BasePaginationDto
  ): FindManyOptions<T> {
    /**
     * where,
     * order,
     * take,
     * skip -> page 기반일 때만
     */

    let where: FindOptionsWhere<T> = {};
    let order: FindOptionsOrder<T> = {};

    for (const [key, value] of Object.entries(request)) {
      if (key.startsWith('where__')) {
        where = {
          ...where,
          ...this.parseWhereFilter(key, value),
        };
      } else if (key.startsWith('order__')) {
        order = {
          ...order,
          ...this.parseWhereFilter(key, value),
        }
      }
    }

    return {
      where,
      order,
      take: request.take,
      skip: request.page ? request.take * (request.page - 1) : null,
    };
  }

  private parseWhereFilter<T extends BaseTimeEntity>(key: string, value: any): FindOptionsWhere<T> | FindOptionsOrder<T> {
    const options: FindOptionsWhere<T> = {};
    const split = key.split('__');
    if (split.length !== 2 && split.length !== 3) {
      throw new BadRequestException(`where 필터는 '__'로 split 했을 때 길이가 2 또는 3이어야 한다. - 문제되는 키 값 ${key}`);
    }

    if (split.length === 2) {
      // [where, id]
      const [_, field] = split;
      options[field] = value;
    } else {
      // 길이가 3인 경우 TypeORM 유틸리티가 필요
      // ['where', 'id', 'more_than']
      const [_, field, operator] = split;

      options[field] = FILTER_MAPPER[operator](value);
    }
    return options;
  }
}