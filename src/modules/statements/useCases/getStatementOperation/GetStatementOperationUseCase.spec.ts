import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let getStatementOperationUseCase: GetStatementOperationUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;

describe("Get user statement", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able to get a user statement", async () => {
    const user = await inMemoryUsersRepository.create({
      email: "neymar@junior.com",
      name: "Neymar",
      password: "toiz",
    });

    const statement = await inMemoryStatementsRepository.create({
      user_id: <string>user.id,
      type: OperationType.DEPOSIT,
      amount: 99,
      description: "Deposit",
    });

    const statementOperation = await getStatementOperationUseCase.execute({
      user_id: <string>user.id,
      statement_id: statement.id as string,
    });

    expect(statementOperation).toHaveProperty("id");
    expect(statementOperation.amount).toBe(99);
    expect(statementOperation.type).toBe(OperationType.DEPOSIT);
  });

  it("should not be able to get a statement of a non-existent user", () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: "user_id",
        statement_id: "statement_id",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("should not be able to get a non-existent statement", () => {
    expect(async () => {
      const user = await inMemoryUsersRepository.create({
        email: "neymar@junior.com",
        name: "Neymar",
        password: "toiz",
      });

      await getStatementOperationUseCase.execute({
        user_id: <string>user.id,
        statement_id: "statement_id",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});
