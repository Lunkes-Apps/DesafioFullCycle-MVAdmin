import { reject } from "lodash";
import { Entity } from "../../../../domain/entity";
import { NotFoundError } from "../../../../domain/errors/not-found.error";
import { ValueObject } from "../../../../domain/value-object";
import { Uuid } from "../../../../domain/value-objects/uuid.vo";
import { InMemoryRepository } from "../in-memory.repository";


type StubEntityConstructor = {
    entity_id?: Uuid;
    name: string;
    price: number;
}

class StubEntity extends Entity{
    entity_id: Uuid;
    name: string;
    price: number;

    constructor(props: StubEntityConstructor){
        super();
        this.entity_id = props.entity_id || new Uuid();
        this.name = props.name;
        this.price = props.price;
    }

    get_entity_id(): ValueObject {
        return this.entity_id;
    }

    toJSON() {
        return {
            entity_id: this.entity_id,
            name: this.name,
            prince: this.price    
        }
    }
}

class StubInMemoryRepository extends InMemoryRepository<StubEntity, Uuid>{
    
    getEntity(): new (...args: any) => any {
        return StubEntity;
    }
}


describe('Tests In Memory',()=>{
    let repo: StubInMemoryRepository;

    beforeEach(()=>{
        repo = new StubInMemoryRepository()
    })

    test('Test shoul insert new entity', async ()=>{
        const entity = new StubEntity({name: 'Carro', price: 2333.4})
        await repo.insert(entity);
        expect(repo.items.length).toBe(1);
    })

    test('Test shoul insert 2 new entity with bulk function', async ()=>{
        const entity1 = new StubEntity({name: 'Carro1', price: 2333.4})
        const entity2 = new StubEntity({name: 'Carro2', price: 2333.4})
        const bulk: StubEntity[] = [entity1, entity2]
        
        await repo.bulkInsert(bulk);
        expect(repo.items.length).toBe(2);
    })

    test('Test shoul delete an entity', async ()=>{
        const entity1 = new StubEntity({name: 'Carro1', price: 2333.4})
        const entity2 = new StubEntity({name: 'Carro2', price: 2333.4})
        const bulk: StubEntity[] = [entity1, entity2]
        
        await repo.bulkInsert(bulk);
        expect(repo.items.length).toBe(2);

        await repo.delete(bulk[1].get_entity_id())

        expect(repo.items.length).toBe(1);
    })

    test('Test shoul Find an entity by id', async ()=>{
        const entity1 = new StubEntity({name: 'Carro1', price: 2333.4})
        const entity2 = new StubEntity({name: 'Carro2', price: 2333.4})
        const bulk: StubEntity[] = [entity1, entity2]
        
        await repo.bulkInsert(bulk);
        expect(repo.items.length).toBe(2);

        const entity3 = await repo.findById(entity2.get_entity_id())

        expect(entity2.name).toBe('Carro2');
    })

    test('Test it should give all entities', async ()=>{
        const entity1 = new StubEntity({name: 'Carro1', price: 2333.4})
        const entity2 = new StubEntity({name: 'Carro2', price: 2332.4})
        const entity3 = new StubEntity({name: 'Carro3', price: 2334.4})
        const bulk: StubEntity[] = [entity1, entity2, entity3]
        
        await repo.bulkInsert(bulk);
        expect(repo.items.length).toBe(3);

        const entities = await repo.findAll();

        expect(entities.length).toBe(3)
        expect(entities[0]).toBeInstanceOf(StubEntity)
    })

    test('Test shoul throw an error when try delete  no exist id', async ()=>{
        const entity1 = new StubEntity({name: 'Carro1', price: 2333.4})
        const entity2 = new StubEntity({name: 'Carro2', price: 2333.4})
        const bulk: StubEntity[] = [entity1, entity2]
        
        await repo.bulkInsert(bulk);
        expect(repo.items.length).toBe(2);

        expect(repo.delete('123'))
            .rejects
            .toThrow(new NotFoundError('123',StubEntity));
        

        expect(entity2.name).toBe('Carro2');
    })



})