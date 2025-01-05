import { ValueObject } from "../value-object";

class StringValueObject extends ValueObject {
    constructor(readonly value: string){
        super();
    }
}

class ComplexValueObject extends ValueObject {
    constructor(readonly value1: string, readonly value2: number){
        super();
    }
}


describe('Value object unit test', ()=>{
    test('Shoul be equal', ()=>{
        const valueObject1 = new StringValueObject('test');
        const valueObject2 = new StringValueObject('test');

        expect(valueObject1.equals(valueObject2)).toBeTruthy();

        const complexValue1 = new ComplexValueObject('test', 2)
        const complexValue2 = new ComplexValueObject('test', 2)

        expect(complexValue1.equals(complexValue2)).toBeTruthy();

    })

    test('Shoul not be equal', ()=>{
        const valueObject1 = new StringValueObject('test1');
        const valueObject2 = new StringValueObject('test');

        expect(valueObject1.equals(valueObject2)).toBeFalsy();

        const complexValue1 = new ComplexValueObject('test', 2)
        const complexValue2 = new ComplexValueObject('test', 3)

        expect(complexValue1.equals(complexValue2)).toBeFalsy();
        expect(complexValue1.equals(null as any)).toBeFalsy();
        expect(complexValue1.equals(undefined as any)).toBeFalsy();

    })

})