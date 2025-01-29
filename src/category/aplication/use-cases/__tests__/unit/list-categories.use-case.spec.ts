import { Category } from "../../../../domain/category.entity";
import { CategorySearchResult } from "../../../../domain/category.repository";
import { CategoryInMemoryRepository } from "../../../../infra/db/in-memory/category-in-memory-repository";
import { ListCategoriesUeCase } from "../../list-categories.use-case";
import { CategoryOutputMapper } from "../../shared/category-output";

describe("Unit tests for use case list categories", () => {
  let useCase: ListCategoriesUeCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new ListCategoriesUeCase(repository);
  });

  it("Should list all categories searched", () => {
    let result = new CategorySearchResult({
      items: [],
      total: 1,
      current_page: 1,
      per_page: 2,
    });
    let output = useCase["toOutput"](result);

    expect(output).toStrictEqual({
      items: [],
      total: 1,
      current_page: 1,
      per_page: 2,
      last_page: 1,
    });

    const entity = Category.create({ name: "Movie" });
    result = new CategorySearchResult({
      items: [entity],
      total: 1,
      current_page: 1,
      per_page: 2,
    });
    output = useCase["toOutput"](result);
    expect(output).toStrictEqual({
      items: [entity].map(CategoryOutputMapper.toOutput),
      total: 1,
      current_page: 1,
      per_page: 2,
      last_page: 1,
    });
  });

  it("should return output sorted by created_at when input param is empty", async () => {
    // Arrange
    
    const categ1 = Category.create({ name: "Category A" });
    const categ2 = Category.create({ name: "Category B" });
    const categ3 = Category.create({ name: "Category 1" });
    const categ4 = Category.create({ name: "Teste 2" });
    const categ5 = Category.create({ name: "Category 3" });
    
    const items = [
      categ1,
      categ2,
      categ3,
      categ4,
      categ5,
    ];

    const itemsResult = [
        categ2,
        categ1,
    ]

    const itemsResult2 = [
        categ5,
        categ3,
    ]

    repository.items = items;


    // Act
    const output1 = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: "name",
      filter: "Cate",
      sort_dir: "desc",
    });

    const output2 = await useCase.execute({
        page: 2,
        per_page: 2,
        sort: "name",
        filter: "Cate",
        sort_dir: "desc",
      });

    expect(output1).toStrictEqual({
      items: itemsResult.map(CategoryOutputMapper.toOutput),
      total: 4,
      current_page: 1,
      last_page: 2,
      per_page: 2,
    });

    expect(output2).toStrictEqual({
        items: itemsResult2.map(CategoryOutputMapper.toOutput),
        total: 4,
        current_page: 2,
        last_page: 2,
        per_page: 2,
      });

  });
});
