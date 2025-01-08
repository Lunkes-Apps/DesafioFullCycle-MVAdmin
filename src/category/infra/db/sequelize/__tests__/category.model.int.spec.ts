import { Sequelize } from "sequelize-typescript"
import { CategoryModel } from "../category.model"
import { Category } from "../../../../domain/category.entity"

describe('CategoryModel Unit Test', ()=>{
    let sequelize;
    beforeEach(async ()=>{
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory',
            models: [CategoryModel],
            logging: false,
        })
        await sequelize.sync({force: true})
    })

    it('should create a category', async ()=>{
        const attributesMap = CategoryModel.getAttributes();
        const attributes = Object.keys(attributesMap);
        
        expect(attributes).toStrictEqual([
            'category_id',
            'name',
            'description',
            'is_active',
            'created_at',
        ])
    
    })



})