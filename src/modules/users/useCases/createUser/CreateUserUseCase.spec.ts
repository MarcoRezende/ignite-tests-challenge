import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Create user", () => {
  const globalUser = {
    email: "neymar@junior.com",
    name: "Neymar",
    password: "toiz",
  };

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to create a user", async () => {
    const user = await createUserUseCase.execute(globalUser);
    expect(user).toHaveProperty("id");
  });

  it("should not be able to create a user with duplicated email", () => {
    expect(async () => {
      await createUserUseCase.execute(globalUser);
      await createUserUseCase.execute(globalUser);
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
