import { User } from "../../entities/User";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let showUserProfileUseCase: ShowUserProfileUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Show user profile", () => {
  let globalUser: User;

  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(
      inMemoryUsersRepository
    );

    globalUser = await inMemoryUsersRepository.create({
      email: "neymar@junior.com",
      name: "Neymar",
      password: "toiz",
    });
  });

  it("should be able to retrieve a user profile", async () => {
    const user = await showUserProfileUseCase.execute(<string>globalUser.id);
    expect(user).toHaveProperty("id");
  });

  it("should not be able to retrieve the profile of a non-existing user", () => {
    expect(async () => {
      await showUserProfileUseCase.execute("user_id");
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
