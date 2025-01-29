import { Uuid } from "../../../../../shared/domain/value-objects/uuid.vo";
import { setupSequelize } from "../../../../../shared/infra/testing/helpers";
import { CategorySequelizeRepository } from "../../../../infra/db/sequelize/category-sequelize.repository";
import { CategoryModel } from "../../../../infra/db/sequelize/category.model";
import { CreateCategoryUseCase } from "../../create-category.use-case";

describe("Create Category use case tests", ()=>{
    let useCase: CreateCategoryUseCase;
    let repository: CategorySequelizeRepository;

    setupSequelize({models:[CategoryModel]});

    beforeEach(()=>{
        repository = new CategorySequelizeRepository(CategoryModel);
        useCase = new CreateCategoryUseCase(repository);
    })

    it('Should create a new Category when execute the use case', async()=>{
        let output = await useCase.execute({name: 'Categorya A'});
        let entiy = await repository.findById(new Uuid(output.id));


        expect(output).toStrictEqual({
            id: entiy.category_id.id,
            name: 'Categorya A',
            description: null,
            is_active: true,
            created_at: entiy.created_at,
        })

    });
});