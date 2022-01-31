import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Authenticate user use case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository
    );
  });

  it("should be able to authenticate a user", async () => {
    const { email } = await createUserUseCase.execute({
      email: "neymar@junior.com",
      name: "Neymar",
      password: "toiz",
    });

    const session = await authenticateUserUseCase.execute({
      email,
      password: "toiz",
    });

    expect(session).toHaveProperty("token");
    expect(session).toHaveProperty("user");
  });

  it("should not be able to authenticate a user with non-existent email", async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "test@email",
        password: "123",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be able to authenticate a user with wrong password", async () => {
    expect(async () => {
      const { email } = await createUserUseCase.execute({
        email: "neymar@junior.com",
        name: "Neymar",
        password: "toiz",
      });

      await authenticateUserUseCase.execute({
        email,
        password: "wrong-password",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
