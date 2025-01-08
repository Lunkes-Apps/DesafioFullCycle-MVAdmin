import { Entity } from "../../../domain/entity";
import { NotFoundError } from "../../../domain/errors/not-found.error";
import {
  IRepository,
  ISearchableRepository,
} from "../../../domain/repository/repository-interface";
import { SearchParams, SortDirection } from "../../../domain/repository/search-params";
import { SearchResult } from "../../../domain/repository/search-result";
import { ValueObject } from "../../../domain/value-object";

export abstract class InMemoryRepository<
  E extends Entity,
  EntityId extends ValueObject
> implements IRepository<E, EntityId>
{
  items: E[] = [];

  async insert(entity: any): Promise<void> {
    this.items.push(entity);
  }

  async bulkInsert(entities: any[]): Promise<void> {
    this.items.push(...entities);
  }

  async update(entity: any): Promise<void> {
    const indexFound = this.items.findIndex((item) =>
      item.get_entity_id().equals(entity.get_entity_id())
    );
    if (indexFound === -1) {
      throw new Error("Entity not found");
    }
    this.items[indexFound] = entity;
  }

  async delete(entity_id: any): Promise<void> {
    const indexFound = this.items.findIndex((item) =>
      item.get_entity_id().equals(entity_id)
    );
    if (indexFound === -1) {
      throw new NotFoundError(entity_id, this.getEntity());
    }

    this.items.splice(indexFound, 1);
  }

  async findById(entity_id: any): Promise<any> {
    const item = this.items.find((item) =>
      item.get_entity_id().equals(entity_id)
    );
    return typeof item === "undefined" ? null : item;
  }

  async findAll(): Promise<any[]> {
    return this.items;
  }

  abstract getEntity(): new (...args: any) => any;
}

export abstract class InMemorySearchableRepository<
    E extends Entity,
    EntityId extends ValueObject,
    Filter = string
  >
  extends InMemoryRepository<E, EntityId>
  implements ISearchableRepository<E, EntityId, Filter>
{
  sortableFields: string[] = [];
  async search(props: SearchParams<Filter>): Promise<SearchResult<E>> {
    // Filter,  ordenação e paginação
    const filtredItems = await this.applyFilter(this.items, props.filter);
    const sortedItems = await this.applySort(
      filtredItems,
      props.sort,
      props.sort_dir
    );
    const paginatedItems = await this.applyPaginate(
      sortedItems,
      props.page,
      props.per_page
    );
    return new SearchResult({
      items: paginatedItems,
      total: filtredItems.length,
      current_page: props.page,
      per_page: props.per_page,
    });
  }

  protected abstract applyFilter(
    items: E[],
    filter: Filter | null
  ): Promise<E[]>;

  protected applySort(
    items: E[],
    sort: string | null,
    sort_dir: SortDirection | null,
    custom_getter?: (sort: string, item: E) => any
  ): E[] {
    if (!sort || !this.sortableFields.includes(sort)){
        return items;
    }

    return [...items].sort((a, b) => {
        //@ts-ignore
        const aValue = custom_getter ? custom_getter(sort, a) : a[sort];
        //@ts-ignore
        const bValue = custom_getter ? custom_getter(sort, b) : b[sort];
        if (aValue < bValue) {
          return sort_dir === "asc" ? -1 : 1;
        }
  
        if (aValue > bValue) {
          return sort_dir === "asc" ? 1 : -1;
        }
  
        return 0;
    })
  }

  protected applyPaginate(
    items: E[],
    page: SearchParams["page"],
    per_page: SearchParams["per_page"]
  ): E[] {
    const start = (page -1) * per_page;
    const limit = start + per_page;
    return items.slice(start,limit);
  }
}
