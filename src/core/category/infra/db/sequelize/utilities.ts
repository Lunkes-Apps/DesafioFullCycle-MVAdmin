import { Sequelize } from "sequelize-typescript";
import { CategorySequelizeRepository } from "./category-sequelize.repository";
import { CategoryModel } from "./category.model";
let sequelize: Sequelize;

export async function initNewRepository(): Promise<CategorySequelizeRepository>{
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory",
    models: [CategoryModel],
    logging: false,
  });
  await sequelize.sync({ force: true });
  return new CategorySequelizeRepository(CategoryModel);
}
