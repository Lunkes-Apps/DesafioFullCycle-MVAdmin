import { ValueObject } from "./value-object";

export abstract class Entity{
    abstract get_entity_id(): ValueObject;
    abstract toJSON(): any;
}