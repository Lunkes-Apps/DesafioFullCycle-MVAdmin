import { InvalidUuidError, Uuid } from "../uuid.vo"

describe('Uuid value object Unit Test', ()=>{

    const validateSpy = jest.spyOn(Uuid.prototype as any, 'validate')

    test('Should be able to validate uuid value', ()=>{
        const uuid1 = new Uuid();
        expect(uuid1.id).toBeDefined();
    });

    test('Should accept a valid uuid', ()=>{
        const uuid1 = new Uuid('f91746c9-27a8-4ab3-9306-cd3ac65ec91e');
        expect(uuid1.id).toBe('f91746c9-27a8-4ab3-9306-cd3ac65ec91e');
    });

    test('Should throw error when uuid is invalid', ()=>{
        expect(()=>{
            const uuid1 = new Uuid('teste');
        }).toThrow(new InvalidUuidError());

        expect(validateSpy).toHaveBeenCalledTimes(1);
    });

})