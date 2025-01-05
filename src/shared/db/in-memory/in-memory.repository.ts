import { Entity } from "../../domain/entity";
import { NotFoundError } from "../../domain/errors/not-found.error";
import { IRepository } from "../../domain/repository/repository-interface";
import { ValueObject } from "../../domain/value-object";

export abstract class InMemoryRepository<E extends Entity, EntittyId extends ValueObject> 
implements IRepository<E, EntittyId>{
    items: E[] = [];


    async insert(entity: any): Promise<void> {
        this.items.push(entity)
    }

    async bulkInsert(entities: any[]): Promise<void> {
        this.items.push(...entities)
    }

    async update(entity: any): Promise<void> {
        const indexFound = this.items.findIndex(item => 
            item.get_entity_id().equals(entity.get_entity_id())
        );
        if (indexFound === -1){
            throw new Error("Entity not found");
        }
        this.items[indexFound] = entity
    }

    async delete(entity_id: any): Promise<void> {
        const indexFound = this.items.findIndex(item => 
            item.get_entity_id().equals(entity_id)
        );
        if (indexFound === -1){
            throw new NotFoundError(entity_id, this.getEntity())
        }
        
        this.items.splice(indexFound, 1);
    }
    
    async findById(entity_id: any): Promise<any> {
        const item = this.items.find(item => item.get_entity_id().equals(entity_id))
        return typeof item === "undefined" ? null : item;
    }

    
    async findAll(): Promise<any[]> {
        return this.items;
    }
    
    abstract getEntity(): new (...args: any) => any;


}