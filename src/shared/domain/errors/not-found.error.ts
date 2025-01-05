import { Entity } from "../entity";
import { ValueObject } from "../value-object";
import { Uuid } from "../value-objects/uuid.vo";

export class NotFoundError extends Error{
    constructor(
        id: any[] | any, 
        entityClass: new(...args: any[])=>Entity
    ){
        const idsMessage = Array.isArray(id) ? id.join(', ') : id;
        super(`${entityClass.name} Not Found using ID ${idsMessage}`);
        this.name = 'NotFoundError';
    }
}