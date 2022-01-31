import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let createStatementUseCase: CreateStatementUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;

describe("Create statement", () => {
  const globalUser = {
    email: "neymar@junior.com",
    name: "Neymar",
    password: "toiz",
  };

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able to create a statement", async () => {
    const user = await inMemoryUsersRepository.create(globalUser);

    const statement = {
      user_id: <string>user.id,
      type: OperationType.DEPOSIT,
      amount: 1,
      description: "Deposit",
    };

    const statementOperation = await createStatementUseCase.execute(statement);

    expect(statementOperation).toHaveProperty("id");
    expect(statementOperation.user_id).toBe(user.id);
  });

  it("should not be able create a statement with a non-existent user", () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: "user_id",
        type: OperationType.DEPOSIT,
        amount: 1,
        description: "Deposit",
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("should not be able create a withdraw statement with insufficient funds", () => {
    expect(async () => {
      const user = await inMemoryUsersRepository.create(globalUser);

      await createStatementUseCase.execute({
        user_id: <string>user.id,
        type: OperationType.WITHDRAW,
        amount: 1,
        description: "Deposit",
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
});
