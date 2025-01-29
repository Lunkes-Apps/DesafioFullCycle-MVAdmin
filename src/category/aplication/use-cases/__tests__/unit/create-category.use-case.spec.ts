import { CategoryInMemoryRepository } from "../../../../infra/db/in-memory/category-in-memory-repository";
import { CategorySequelizeRepository } from "../../../../infra/db/sequelize/category-sequelize.repository";
import { CreateCategoryUseCase } from "../../create-category.use-case";

describe("Create Category use case tests", ()=>{
    let useCase: CreateCategoryUseCase;
    let repository: CategoryInMemoryRepository;

    beforeEach(()=>{
        repository = new CategoryInMemoryRepository();
        useCase = new CreateCategoryUseCase(repository);
    })

    it('Should create a new Category when execute the use case', async()=>{
        const spyInsert = jest.spyOn(repository, 'insert');
        let output = await useCase.execute({name: 'Categorya A'})

        expect(spyInsert).toHaveBeenCalledTimes(1)
        expect(output).toStrictEqual({
            id: repository.items[0].category_id.id,
            name: 'Categorya A',
            description: null,
            is_active: true,
            created_at: repository.items[0].created_at,
        })

    });
});