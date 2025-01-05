import { EntityValidationError } from "../../../shared/domain/validators/validation.error";
import { Uuid } from "../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../category.entity"
import {validate as uuidValidate} from 'uuid';


describe('Category Unit Tests', ()=>{
    let validateSpy: any;

    beforeEach(()=>{
        validateSpy = jest.spyOn(Category, 'validate')
    })

    //Arrange
    const myNameMovie = 'My Movie'
    const date = new Date(Date.parse('2025-01-01'))

    test('should create with minimal values', ()=>{
        const category = new Category({
            name: myNameMovie
        })  

        expect(uuidValidate(category.category_id.id)).toBeTruthy()
        expect(category.name).toBe(myNameMovie)
        expect(category.description).toBeNull()
        expect(category.is_active).toBeTruthy()
        expect(category.created_at).toBeInstanceOf(Date)
        
    })

    test('should create with all values', ()=>{
        

        //Act
        const category = new Category({
            name: myNameMovie,
            description: 'Description of my movie',
            is_active: false,
            created_at: date
        })  

        //Assert
        expect(uuidValidate(category.category_id.id)).toBeTruthy()
        expect(category.name).toBe(myNameMovie)
        expect(category.description).toBe('Description of my movie')
        expect(category.is_active).toBeFalsy()
        expect(category.created_at).toBe(date)
        
    })

    test('Should change name when use changeName function', ()=>{
        //Assert
        
        const category = Category.create({
            name: "My Movie",
            description: 'Description of my movie',
            is_active: true
        })
        

        category.changeName('New name for test')
               
        expect(category.name).toBe('New name for test')
        expect(uuidValidate(category.category_id.id)).toBeTruthy()
        expect(validateSpy).toHaveBeenCalledTimes(2);

    })

    

})

describe('Category id field unit test', ()=>{
    const arrange = [
        {category_id: null}, {category_id: undefined}, {category_id: new Uuid()}
    ];
    test.each(arrange)('category_id = %j', ({category_id})=>{
        const category = new Category({
            name: "Movie",
            category_id: category_id as any
        })

        expect(category.category_id).toBeInstanceOf(Uuid)
    })
})

describe('Category validator', ()=>{
    describe('create command', ()=>{
        test('should throw an error when create a category with null name', ()=>{
            expect(()=> Category.create({name: null})).containsErrorMessages({
                name: [
                        'name should not be empty',
                        'name must be a string',
                        'name must be shorter than or equal to 255 characters'
                      ]
                }                
            )
        })

        test('should throw an error when create a category with invali', ()=>{
            expect(()=> Category.create({name: '', description: null})).containsErrorMessages(
                {"name":["name should not be empty"]}            
            )
        })
    })
})