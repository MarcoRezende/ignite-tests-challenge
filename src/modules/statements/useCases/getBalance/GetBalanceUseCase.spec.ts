import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let getUserBalanceUseCase: GetBalanceUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Get user balance", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    getUserBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository
    );
  });

  it("should be able to get user balance", async () => {
    const user = await inMemoryUsersRepository.create({
      email: "neymar@junior.com",
      name: "Neymar",
      password: "toiz",
    });

    const userBalance = await getUserBalanceUseCase.execute({
      user_id: <string>user.id,
    });

    expect(userBalance.balance).toBe(0);
    expect(userBalance.statement.length).toBe(0);
  });

  it("should not be able to get balance of a non-existent user", () => {
    expect(async () => {
      await getUserBalanceUseCase.execute({ user_id: "user_id" });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
