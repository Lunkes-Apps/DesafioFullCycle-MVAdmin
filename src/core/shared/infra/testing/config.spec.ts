import { Config } from "../config"

describe('Test config', ()=>{
    test('Config variables',()=>{
        expect(Config.db().host).toBe(":memory:");
    })
})