import { Category } from "../../../../domain/category.entity";
import { CategoryInMemoryRepository } from "../../../../infra/db/in-memory/category-in-memory-repository";
import { UpdateCategoryUseCase } from "../../update-category.use-case";

describe("Update category use case test", () => {
  let updateUsecase: UpdateCategoryUseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    updateUsecase = new UpdateCategoryUseCase(repository);
  });

  it("Should update the name of a category in data base", async () => {
    let spyFindById = jest.spyOn(repository, 'update');
    
    const category = Category.create({ name: "Category B" });
    await repository.insert(Category.create(category));

    await updateUsecase.execute({
      id: category.category_id.id,
      name: "New Category C",
    });

    const newCategory = await repository.findById(category.category_id)
    
    expect(spyFindById).toHaveBeenCalledTimes(1);
    expect(newCategory.name).toBe("New Category C");


  });
});
